## Outcome

Extend Gentle-pi's existing managed background-subagents feature so a bounded task can execute headlessly in an explicit linked-worktree `cwd` without moving the owner Pi session and without creating a terminal, durable peer, or Herdr pane.

When the user-owned background policy is enabled and the workload is eligible, the selected runtime launches an actual asynchronous background task in the target `cwd`. When orchestration must wait, the same adapter runs the task headlessly in foreground mode.

## Current limitation

Gentle-pi currently delegates through `subagent_run`. The configured runtime supports foreground/background task execution, task IDs, cancellation, history, profiles, and terminal results, but the caller cannot supply a target `cwd`.

`pi-intercom` can route to a peer in another cwd and can explicitly create a visible Herdr pane, but peer transport is not a managed subagent runtime. The separately tracked automatic-pane bug prevents that visible route from being used as a delegation fallback.

## Existing foundation

This issue extends the merged background-subagent control plane instead of creating another policy:

| Foundation | Existing contract retained | Extension required here |
| --- | --- | --- |
| [gentle-ai#3179](https://github.com/Gentleman-Programming/gentle-ai/pull/3179) | Native background-execution precedent, foreground fallback, bounded concurrency, completion notifications, and process-local jobs | Conceptual precedent only; it does not provide Pi target-`cwd` execution |
| [gentle-ai#3283](https://github.com/Gentleman-Programming/gentle-ai/pull/3283) | Projects the managed Pi background policy | Preserve control-plane ownership; do not add another installer/TUI switch |
| [#321](https://github.com/Gentleman-Programming/gentle-pi/pull/321) | Pi policy cascade, prompt projection, max-two guardrail, notification-only completion, foreground writers/dependencies, and no recovery claim | Primary consumer seam: extend capability routing beyond tool presence |
| [#326](https://github.com/Gentleman-Programming/gentle-pi/pull/326) | Live `subagent_run` detection with package fallback | Preserve presence detection, then require adapter-declared capabilities |
| [#346](https://github.com/Gentleman-Programming/gentle-pi/pull/346) | User-owned `status|enable|disable` and policy-source reporting | Reuse its reporting surface; policy `on` does not imply target-`cwd` support |
| [#371](https://github.com/Gentleman-Programming/gentle-pi/pull/371) | Detects project-local `.pi` configuration missing from linked worktrees | Use as a pre-launch diagnostic when available; it is not an execution adapter |

## Desired behavior

```text
bounded task with target cwd
→ resolve existing background policy and workload eligibility
→ validate linked worktree/cwd and project-local configuration
→ resolve the explicitly selected runtime adapter
→ require headless target-cwd capability
→ choose runtime mode
   ├─ eligible + policy on → asynchronous background task
   └─ dependency/writer/policy off → foreground task; owner waits
→ selected runtime creates and owns the task
→ worker runs headlessly in the target cwd
→ runtime persists one terminal result
→ owner receives completion notification/result
```

Headless execution and asynchronous scheduling are separate capabilities. Both modes must use the same target-`cwd` adapter and runtime-owned task contract.

## Runtime capability contract

Gentle-pi should consume a versioned, provider-neutral adapter surface that declares at least:

```text
runtime identity and adapter version
foreground headless execution
asynchronous background execution
target-cwd support
result persistence/recovery capability
resolved worker profile and tool restrictions
parent/task ancestry support
start(task, cwd, mode) → runtime-owned task ID
status(task ID)
cancel(task ID)
result(task ID)
completion notification or equivalent recovery path
```

Capability detection must identify the selected adapter and its version. Tool presence or package load order alone is insufficient.

## Ownership and integration boundary

1. **Gentle-pi owns policy and routing.** It resolves the user-owned background policy, workload eligibility, selected adapter, target cwd, and execution mode.
2. **The selected runtime owns task authority.** Task IDs, status, cancellation, profiles/models, tool restrictions, history, terminal results, and recovery stay in that runtime.
3. **The adapter preserves the resolved worker contract.** It must not reconstruct an agent from a package name or prompt text.
4. **Runtime stores remain isolated.** A task ID, history entry, cancellation, or result from one runtime is never passed to another.
5. **Intercom remains peer transport.** It is not used to emulate headless task creation.
6. **Herdr remains independent UI infrastructure.** This execution path neither requires nor creates a pane.
7. **Parent/task ancestry remains inspectable.** Nested delegation cannot escape the selected runtime or no-pane policy.

## Product and compatibility constraints

- Runtime selection remains a separate product decision.
- The existing user-owned background policy remains authoritative and is never enabled automatically.
- Existing runtime support must not be removed, deprecated, or silently bypassed.
- Another runtime is supported only through an explicit versioned adapter.
- Multiple available runtimes never select authority by package load order.
- No tracked, staged, or untracked content is transferred between worktrees.
- Missing configuration, capability, or adapter support fails closed without opening another execution surface.

## Failure contract

1. **Invalid target cwd/worktree:** reject before task creation.
2. **Missing project-local configuration:** report the exact missing capability/configuration without provisioning it implicitly.
3. **No target-cwd-capable adapter:** return an actionable `target_cwd_unsupported` result.
4. **Background unavailable or workload ineligible:** retain the existing headless foreground fallback when target-`cwd` execution is available.
5. **Launch failure before task creation:** return an error without fabricating a task ID.
6. **Launch failure after task creation:** preserve the runtime-owned failed task identity and state.
7. **Worker failure/cancellation:** persist and return the runtime's terminal disposition.
8. **Owner restart/disconnection:** recover only when the runtime declares persisted result/recovery capability.
9. **Nested delegation:** preserve ancestry and the same execution-surface policy.

The separately tracked automatic-pane bug owns enforcement that none of these paths may switch to a visible peer.

## Delivery slices

1. Extend #321/#326 capability detection with a versioned runtime-adapter contract and deterministic tests for no runtime, each runtime independently, and multiple runtimes present.
2. Add target-`cwd` headless foreground execution through one supported adapter without changing runtime-selection or background-policy defaults.
3. Add actual asynchronous target-`cwd` execution for workloads already eligible under #321, preserving foreground writers/dependencies and the max-two guardrail.
4. Extend #346 status reporting with selected adapter, version, target-`cwd`, background, persistence/recovery, and ancestry capabilities.
5. Add linked-worktree configuration, launch failure, cancellation, completion, restart, and nested-delegation coverage.

## Acceptance criteria

- [ ] Capability detection is versioned and tested with no runtime, each supported runtime independently, and multiple runtimes loaded.
- [ ] Package load order never selects the task authority.
- [ ] A managed task executes headlessly in an explicit linked-worktree cwd without moving the owner Pi session.
- [ ] With the existing background policy enabled and workload checks satisfied, the runtime launches an actual asynchronous task in that cwd.
- [ ] Dependent, writer, policy-off, or background-ineligible work executes headlessly in foreground mode through the same adapter.
- [ ] The selected runtime owns task identity, status, cancellation, history, profile/tool restrictions, terminal result, and recovery.
- [ ] Missing target-`cwd` capability fails before task creation with an actionable result.
- [ ] Missing asynchronous-background capability alone retains the headless foreground fallback.
- [ ] Missing linked-worktree configuration is diagnosed before launch without implicit copying or provisioning.
- [ ] Runtime launch failures distinguish pre-task failure from a runtime-owned failed task.
- [ ] Parent/task ancestry remains enforceable across nested delegation.
- [ ] No path creates a terminal, durable peer, or Herdr pane.
- [ ] Tests cover capability absence, runtime coexistence, invalid cwd, missing configuration, foreground completion, background completion, launch failure, worker failure, cancellation, blocked work, owner shutdown, result recovery, and nested delegation.

## Relationship to #379

[#379](https://github.com/Gentleman-Programming/gentle-pi/issues/379) is the immediate safety guard and should land first.

This feature supplies the positive replacement path. Until it ships, unsupported target-`cwd` delegation must return #379's actionable failure instead of opening a visible peer.

## Related context

- #134 covers explicitly visible Herdr subagents. This issue remains headless and does not reopen that scope.
- #347 moves the active owner conversation between worktrees. This issue keeps the owner in place while a managed worker executes elsewhere.

## Non-goals

- Selecting, replacing, deprecating, or removing a subagent runtime.
- Creating a second background policy or installer/TUI decision.
- Treating package popularity, ownership, or load order as runtime authority.
- Migrating or merging task histories between runtimes.
- Creating, managing, adopting, reconciling, or closing Herdr panes.
- Replacing persistent peer-to-peer intercom conversations.
- Moving the owner conversation between worktrees.
- Moving dirty filesystem content between worktrees.
- Teaching Gentle-pi to manage terminal multiplexer internals.

