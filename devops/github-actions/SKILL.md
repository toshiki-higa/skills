---
name: github-actions
description: Use when creating, editing, reviewing, or debugging GitHub Actions workflows, reusable workflows, or composite actions.
---

# GitHub Actions

Inspect existing workflows and repository conventions first. Do not change unrelated workflows.

## Creating

Use the template as a starting point:

```sh
cp $SKILL/assets/workflow.yml .github/workflows/<name>.yml
```

- Regular CI/CD: `.github/workflows/<name>.yml`
- Reusable jobs: `workflow_call`
- Reusable steps: `.github/actions/<name>/action.yml`

## Minimum security rules

Keep these template settings:

- Minimal `permissions`
- Full commit SHA pins for `uses:`
- `persist-credentials: false` for checkout
- A job `timeout-minutes`
- A fixed runner such as `ubuntu-24.04`

Additionally:

- Do not expose secrets in logs, arguments, outputs, or artifacts.
- Pass GitHub context to shell through `env` and always quote it.
- Do not execute untrusted pull-request code from `pull_request_target`.

## Lint

```sh
# Must
actrun lint
pinact run  # Do not invent action SHAs

# Optional
actionlint .github/workflows/*.yml
zizmor --persona=regular .github/workflows
```

- Use `actrun viz` for dependencies
- Use `actrun workflow run <workflow> --dry-run` for a local smoke test

## Debug

```sh
gh run view <run-id> --log-failed
```

Classify the failure as syntax, expression, permission, runner, shell, or application; reproduce the smallest command locally and make the smallest fix. Do not broaden permissions or expose secrets to make CI pass.
