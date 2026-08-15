# Coding Rule for Frontend

## Collocation

Tanstack Router are:
- File based Routing
- Use `_*` to recognize it as layout under `src/routes`
- Use `-*` to ignore routing under `src/routes`

Example:
```yaml
src/routes:
  _authenticated:
    -components:
      sidebar.tsx: Component
    -lib:
      auth.ts: Helper
    route.tsx: Layout (Use beforeLoad to protect routes)
    index.tsx: Page
```

## Data Flow

### Command–query Separation
GET (Query):
- Use `useSuspenseQuery` basically.
POST/PUT/PATCH/DELETE (Command):
- Use `useMutation` in event handlers.

### Data Flow
- State management prefer `URL Params` over `useState`.

### useEffect

useEffect MUST be used ONLY for synchronizing with the external world.

Principles:
- Compute during render when a value can be derived from props or state.
- Handle user actions in event handlers, not in effects.
- Keep effects only for real side effects that touch external systems.
- Whenever you write a useEffect, add a short comment explaining what external resource it synchronizes with.

## Backend for Frontend

Keep any public API separate. **Design the BFF as a private API for your own frontend.**

Query:

- Define queries by screen and read use case.
- Return all data required to render the screen in a single response.
- Shape query responses as UI view models rather than generic resource models.
- Let the BFF aggregate, transform, authorize, and optimize read-side data.

Command:

- Define commands by user task and form submission.
- Accept inputs in the shape of the intended user action.
- Let the BFF validate, authorize, orchestrate, and execute the required business operation.
- Return the state required for the next UI step.

Reference: https://max.engineer/server-informed-ui
