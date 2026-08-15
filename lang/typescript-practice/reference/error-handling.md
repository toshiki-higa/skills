# Error handling for Typescript

## Library

- byethrow:
  - Use `Result<Success, Error>` for type-safe error handling
  - synchronous / asynchronous with same API
  - tree shaking compatible

## Installation

```sh
pnpm add @praha/byethrow @praha/error-factory
```

## **Rules**

Prefer stripped-down error handling:

- Use Result in domain APIs only for expected, recoverable failures.
    - Use custom error (using `@praha/error-factory`) only when callers need explicit handling, user feedback, or logic branching.
    - Default to `UnexpectedError` for all other errors unless callers need specific handling.
- Never surface raw exceptions.
    - Convert thrown exceptions to `UnexpectedError` at Result boundaries and preserve the original cause for diagnostics.
    - Fail fast by propagating `UnexpectedError` immediately.
- Prefer Railway-Oriented Programming for sequential recoverable flows.

## Code Example

```typescript
import { Result } from "@praha/byethrow";

// Bad - try-catch
try {
  const data = JSON.parse(input);
} catch (e) {
  console.error(e);
}

// Good - Result type
const parse = Result.fn({
  try: (input: Input) => JSON.parse(input),
  catch: (error) => error as Error,
})();

const result = parse(input)
if (Result.isFailure(result)) {
  console.error(result.error);
}
```

```typescript
import { Result } from '@praha/byethrow'
import { ErrorFactory } from '@praha/error-factory'
import { UnexpectedError } from '@praha/error-factory/presets'

class ValidationError extends ErrorFactory(/* ... */) {}
class DuplicateEmailError extends ErrorFactory(/* ... */) {}

interface Input { email: string }
interface User { id: string; email: string }

// reusable => Result.fn
const parseInput = Result.fn({
  try: (raw: string) => JSON.parse(raw) as Input,
  catch: (cause) => new UnexpectedError({ cause }),
})

const validate = (input: Input) =>
  input.email.includes('@')
    ? Result.succeed(input)
    : Result.fail(new ValidationError(/* ... */))

const saveUser = async (input: Input) => {
  const existing = await repo.findByEmail(input.email)
  if (existing) {
    return Result.fail(new DuplicateEmailError(/* ... */))
  }

  // Use `Result.try` instead of `Result.fn` for single use
  return Result.try({
    try: () => repo.insert(input),
    catch: (cause) => new UnexpectedError({ cause }),
  })
}

const log = async (user: User) => {
  console.info('user.created', { userId: user.id })
}

// Railway-Oriented Programming in a functional style
await Result.pipe(
  parseInput('{"email":"alice@example.com"}'),
  Result.andThen(validate), // sequential operation
  Result.andThen(saveUser), // sequential operation
  Result.andThrough(log),   // side effect
  Result.inspectError((error) => {
    if (error instanceof ValidationError) {
      console.error('Invalid input.')
    }
    if (error instanceof DuplicateEmailError) {
      console.error('Email already exists.')
    }
    if (error instanceof UnexpectedError) {
      console.error('Unexpected failure.', error.cause)
    }
  }),
)
```

## Lint

Add the following to vite.config.ts:

```typescript
import oxlintByethrowPlugin from '@praha/byethrow-oxlint';
import { defineConfig } from 'vite-plus';

const oxlintByethrow = oxlintByethrowPlugin.recommended;
const oxlintByethrowTesting = oxlintByethrow.overrides[0];

export default defineConfig({
  lint: {
    jsPlugins: [
      oxlintByethrow.jsPlugins
    ],
    rules: {
      ...oxlintByethrow.rules,
    },
    overrides: [
      {
        files: [
          '**/*.{test}.{ts,tsx,js,jsx}',
        ],
        jsPlugins: oxlintByethrowTesting.jsPlugins,
        rules: {
          ...oxlintByethrowTesting.rules,
        },
      },
    ],
  },
});
```

## Others
- effect-ts: `Effect<Success, Error, Requirements>` as dependency-aware Result
- [errore](https://github.com/remorses/errore): Go-style error handling as a union type. zero dependency & ultra lightweight.
