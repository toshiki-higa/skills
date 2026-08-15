---
name: codegraph
description: Query the indexed code graph (.codegraph/ exists) for locating code, call flows, or change impact instead of grep.
---

# CodeGraph

Indexed code graph (`@colbymchenry/codegraph`).

## Setup

Only when the user asks and `.codegraph/` is absent:

```sh
codegraph init
```

## Usage

Rules:

- `explore` first for almost any question
- `codegraph node <file> --symbols-only` to read file outline
- Treat returned source as already Read because of same format

Commands:

```sh
codegraph explore "<query>"          # source + call paths + impact in one call
codegraph callers <symbol>           # who calls this
codegraph callees <symbol>           # what this calls
codegraph impact <symbol> -d 4       # affected symbols
codegraph node <file> --symbols-only # symbol outline + who uses the file
codegraph node <symbol>              # one symbol: source + caller/callee trail
codegraph affected <files...>        # changed files → tests to run
```
