---
name: dotenvx
description: Use to handle env files (encrypt, manage, etc.)
---

# dotenvx

Manage encrypted `.env` files in git.

## Installation

1. Run `pnpm add -D @dotenvx/dotenvx`
2. Run `dotenvx gitignore --pattern .env.keys`

## How to use

1. Create env files by user
2. Run `dotenvx encrypt`
3. Commit encrypt env files
4. Run `dotenvx run -- <command>`

See details: https://dotenvx.com/docs/cli

## Do not

- Commit `.env.keys` or `DOTENV_PRIVATE_KEY*`
- Print secrets or paste them in chat
- Run `dotenvx get` without a key name (dumps every value)
- Pass a real secret through agent tools (`dotenvx set KEY <secret>`)

## Manage `DOTENV_PRIVATE_KEY`

- Private key stays in a secret store

### Bitwarden (Recommended)

1. Official approach: https://dotenvx.com/docs/bitwarden/
2. `Secret Note` approach: https://zenn.dev/bony_chops/articles/25024f5b13d7a6

Save into bitwarden:
```sh
VAULT_ITEM_NAME='<owner>/<repository>/dotenvx'
encoded_item="$({
  jq -n \
    --arg name "$VAULT_ITEM_NAME" \
    --rawfile notes .env.keys \
    '{type: 2, name: $name, secureNote: {type: 0}, notes: $notes}'
} | bw encode)"
BW_ITEM_ID="$(bw create item "$encoded_item" | jq -er '.id')"
unset encoded_item
bw sync
```

Extract from bitwarden:
```sh
umask 077
bw get notes "$BW_ITEM_ID" > .env.keys
chmod 600 .env.keys
```

## Monorepo

- One `.env.keys` at the repo root. Do not add per-package key files.
- From `packages/<pkg>`: `dotenvx run -f .env -fk ../../.env.keys -- <command>`
- See details: https://dotenvx.com/docs/monorepos/

## Pre-commit

- Verify on pre-commit:
  - `dotenvx precommit`: `.env*` is encrypted
  - `dotenvx validate --overload`: required keys from `.env.example` exist
- Example (`vite.config.ts` via vite-plus):

```typescript
export default defineConfig({
  ...
  staged: {
    '.env{,.*}': [() => 'dotenvx precommit .', () => 'dotenvx validate --overload'],
  },
});
```
