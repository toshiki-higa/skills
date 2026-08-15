---
name: orchestrate
description: Orchestrate agents through issues with dependencies.
---

## Prerequisites

- `pi`: Agent runtime (recommended)
- `herdr`: Run and manage sub-agents through multiplexer panes
- `bit`: Manage tasks through issues with dependencies

## Workflow

Follow this workflow after clarifying the user's request, except for:

- Questions or read-only investigations
- Trivial, single-step changes
- Explicit requests to skip orchestration

### Plan tasks as issues

0. Check how to use tools if needed
   ```sh
   bit issue --help
   herdr pane --help
   herdr agent --help
   ```
1. Create a parent issue:
   ```sh
   bit issue create --title "<title>" --body "<description>"
   ```
2. Split the work into independently verifiable child tasks.
3. Create each child under the parent:
   ```sh
   bit issue create --title "<child-title>" --parent <parent-id>
   ```
4. Add only required dependencies:
   ```sh
   bit issue dep add <blocked-id> <blocker-id>
   ```
5. Extract and validate the parent issue DAG:
   ```sh
   node $HOME/.agents/skills/orchestrate/assets/issue-dag.ts <parent-id>
   ```

### Execute tasks with agents

6. List open child tasks as JSON and inspect their blockers:
   ```sh
   bit issue list \
     --parent <parent-id> \
     --open \
     --format json
   bit issue dep list <child-id>
   bit issue get <blocker-id>
   ```
7. Decide which tasks can run in parallel:
   - Follow dependency order.
   - Proactively parallelize tasks with no dependencies and non-overlapping impact scopes.
8. Delegate each ready task to its own sub-agent through `herdr` in the parent worktree:
   ```sh
   # Create a pane
   herdr tab create \
     --workspace <workspace-id> \
     --label "<task-label>" \
     --cwd "<worktree>" \
     --no-focus
   # Run agent as sub-agent on a pane
   herdr agent start <agent-name> \
     --kind pi \
     --pane <pane-id> \
     -- \
     --model <model>
   herdr agent prompt <workspace-id>:<pane-id> "<task>"
   ```
9. Orchestrate each task until it is complete and verified:
   - Communicate with the agent as needed.
   - Inspect its status and output:
     ```sh
     herdr agent get <workspace-id>:<pane-id>
     herdr agent read <workspace-id>:<pane-id> --lines 200
     ```
   - Close the pane when the task is complete:
     ```sh
     herdr pane close <pane-id>
     ```
10. Close each verified task:
   ```sh
   bit issue close <child-id>
   ```
11. Recheck blockers and start newly unblocked tasks; return to step 6.
  - Make sure to check the TODO list defined as Issues each time.
12. After all children are closed and the final validation passes, close the parent:
   ```sh
   bit issue close <parent-id>
   ```

## Select Models

```sh
pi --model <provider>/<model>:<thinking-level>
```

- General Purpose: `openai-codex/gpt-5.6-luna:max`
- High-difficulty coding with a clear objective: `zai/glm-5.3`
