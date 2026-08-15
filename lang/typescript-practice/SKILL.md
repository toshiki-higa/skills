---
name: typescript-practice
description: Use proactively this to develop with Typescript.
---

# TypeScript Practice

## Principles

- YAGNI: Write only essential code
  - Understand, then make minimal surgical changes that work.
  - Focus on root causes, not symptoms
- KISS: Prefer readable one-line simplicity over pathological correctness
  - Prefer standard library, then native platform feature, then already-installed dependencies.
  - No abstractions and backward-compat shims/fallbacks unless requested.
  - Never simplify away data loss prevention, security, or accessibility.
- Keep separation of concerns
- Functional programming
  - Avoid classes; use pure functions and separate state
  - Keep functions idempotent
- Define strict contract layers through APIs and types; keep implementation layers regenerable
- Prefer Type safety
  - Parse, don't validate; Prohibit `isRecord` checks.
- Prefer testability
  - Test intended behaviors only through public interfaces
  - Isolate only system boundaries; HTTP requests, third-party services, time, and user input
  - Prefer stable fakes/fixtures (in-memory DB, recorded HTTP) over deep mocks
  - Keep tests fast and deterministic
- Prefer stripped-down error handling
  - Use Result types with Railway Oriented Programming for domain errors; Infrastructure errors stay exceptions unless promoted
  - Else fail fast; Surface exceptions for diagnostics

## Coding Rules

- [Error handling](reference/error-handling.md)
- [Frontend](reference/frontend.md)

## Package Manager

Use pnpm instead of npm
```sh
pnpm install
pnpm add <package>
```

## Execute

Node 24+ runs TypeScript directly without flags:
```sh
node foo.ts
```

`pnpm dlx` runs executable package instead of `npx`:
```sh
pnpm dlx <package>
```

## Toolchain

Installtion:
```sh
pnpm add -D vite-plus
```

### Bundler

- Fronend: vite (via vite-plus)
  - build: `vp build`
  - dev: `vp dev`
- Library: tsdown (via vite-plus)
  - build: `vp pack`
  - dev: `vp pack --watch`

### Lint & Format

Use oxfmt and oxlint via vite-plus:
```sh
vp check --fix # autofix
vp check # check only
```
See `assets/vite.config.ts` for config example.

### Test

Use vitest via vite-plus:
```sh
vp test
```

```typescript
// foo.test.ts
import { expect, test } from 'vitest';
import { add } from './foo.ts';

test('add', () => {
  expect(add(1, 2)).toBe(3);
});
```

### monorepo workspace

- Use vite-task via vite-plus by default.

### precommit

- Use `.vite-hooks/pre-commit` via vite-plus
- Options:
  - secretlint: `pnpm add -D secretlint @secretlint/secretlint-rule-preset-recommend`
  - dotenvx
  - commitlint
  - actrun: via Nix

## Setup
- Tanstack Start + Hono
