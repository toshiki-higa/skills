---
name: nix-setup
description: Always use when the user asks to set up a development environment or skills. Sets up via Nix.
---

# Nix setup

1. Copy a template. Do not overwrite an existing flake without asking.

```sh
# $SKILL is this skill directory
cp $SKILL/assets/<lang>/flake.nix $SKILL/assets/<lang>/.envrc .
direnv allow
```

| lang | When |
|---|---|
| `typescript` | Node / pnpm |
| `moonbit` | MoonBit |

2. Edit `selectedSkills` in `flake.nix`. Use each skill's repository-relative path (`<group>/<skill>`); the template derives grouped sources and skill IDs automatically. Extra skill repositories need another `flake = false` input and a corresponding source mapping.

3. Add `.direnv/`, `.agents/skills/`, `.pnpm/` into `.gitignore`
