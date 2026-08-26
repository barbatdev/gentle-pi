# feat(agents): define managed-task cancellation, concurrency, ancestry, foreground, and shutdown

## Parent and gate

Parent: #419 requires `status:needs-review` for publication. Fresh discovery found remote status drift from that required state. Before any publication, restore `status:needs-review` and read it back; stop if unconfirmed. This draft does not inherit remote status and is not approved or implementation-ready. #379 is OPEN with `status:approved`, not delivered or merged; it is an approved/open prerequisite that must merge before implementation. Formal child links are a re-review prerequisite.

## Outcome

Extend the core process-local task manager with deterministic cancellation, bounded admission, ancestry, foreground semantics, completion settlement, and shutdown disposition.

## Evidence and current limitation

The #419 review identifies omitted queued cancellation, launch/cancel/completion races, duplicate operations, shutdown disposition, foreground semantics, and the need to use host-runtime `agent_settled`, not assumed `agent_end`, for completion. The current production max-two and foreground/background rules are prompt policy, not a local scheduler.

## Included scope

- Queued and running cancellation races, idempotent cancel/result operations, and terminal precedence.
- Parent/task ancestry and bounded parent-level concurrency consistent with the frozen compatibility contract.
- Foreground wait semantics and notification behavior.
- Deterministic shutdown handling for queued and running tasks, based on settled completion.

## Non-goals

- No durable recovery, restart resume, per-task failover, target-cwd routing, worktree switching, peer messaging, or new policy switch.

## Normative behavioral contract

Cancellation, launch, completion, and shutdown serialize through A3's task-record authority and its first-terminal compare-and-set rule. `agent_end` is observational and cannot terminalize a task. Successful completion and settled running cancellation require `agent_settled`; if settlement evidence is unavailable, fail closed rather than infer success. A queued cancel terminalizes `cancelled` and prevents launch. A launch failure after publication terminalizes `failed` while preserving the published ID. A running cancel is delivered once and terminalizes only after settled cancellation. Completion, cancellation, and failure races use A3's first-terminal compare-and-set authority. Duplicate cancel and result operations remain idempotent. Foreground mode waits for the same managed task authority, not a separate execution path. Shutdown closes admission; terminalizes queued tasks as `cancelled`; delivers one cancellation request to each running task; waits a bounded interval for settlement; terminalizes each deadline-exhausted task as immutable `failed/shutdown_unsettled`; and ensures every published task is terminal before manager disposal. v1 never resumes work after restart.

## Dependencies

- A3.
- A5b and A6a consume its admission and active-work behavior; A7a1/A7b1/A7b2/A7c1 consume delivered shutdown and cutover evidence.

## Acceptance criteria

- [ ] `agent_end` is observational and never terminalizes a task; successful completion and settled running cancellation require `agent_settled`, and unavailable settlement evidence fails closed.
- [ ] Queued cancel terminalizes `cancelled` and prevents launch.
- [ ] Launch failure after publication terminalizes `failed` while preserving the published ID.
- [ ] A running cancel is delivered once and terminalizes only after settled cancellation.
- [ ] Completion, cancellation, and failure races use A3 first-terminal compare-and-set authority and produce one immutable terminal result.
- [ ] Duplicate cancel, status, and result operations are idempotent.
- [ ] Shutdown closes admission; terminalizes queued tasks as `cancelled`; sends one cancellation request per running task; waits a bounded interval for settlement; marks deadline-exhausted tasks immutable `failed/shutdown_unsettled`; and leaves every published task terminal before manager disposal.
- [ ] Concurrency and ancestry cannot escape the frozen selected-runtime policy.
- [ ] Foreground and background behavior uses one task authority.
- [ ] Restart creates no recovery or resume obligation.

## Verification

Focused race/state-machine tests and fake settled-session integration tests cover `agent_end` observation, unavailable settlement evidence, queued cancellation, launch failure after publication, running cancellation delivery and settlement, completion/cancel/failure first-terminal races, duplicate cancel/result idempotency, and every shutdown disposition; then run affected package tests. Packed-install proof belongs to A7.

## Rollback boundary

Revert scheduler extensions while retaining A3's core record contract; no task is migrated to another runtime.

## Review workload forecast

One lifecycle-extension work unit.

## Pre-publication measured A+D/test-inventory gate

Before the first publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the complete active register. If it exceeds 400 A+D or 60 minutes, stop before publication; split locally, regenerate the register, counts, topology, parent and #376, update tombstones and hash-bound diffs, rerun exact-title searches and full human validation, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
