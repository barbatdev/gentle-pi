# feat(agents): add owner-scoped admission barrier and generation-lease core

## Parent and gate

Parent: #419 requires `status:needs-review` for publication. Fresh discovery found remote status drift from that required state. Before any publication, restore `status:needs-review` and read it back; stop if unconfirmed. This draft does not inherit remote status and is not approved or implementation-ready. #379 is OPEN with `status:approved`, not delivered or merged, and must merge before A-track implementation. Every child must be created and formally linked before tracker re-review.

## Outcome

Provide the process-local owner admission barrier, lease/generation records, and terminal compare-and-set core for same-cwd managed execution.

## Evidence and constraint

This core owns its state only for the current process and cwd. v1 is non-durable: process restart has no recovery or resume obligation.

## Included scope

- Acquire, active-task failure/release, same-owner admission rejection, explicit release, terminal CAS, generation records, and focused race tests.
- Bounded active queued/running task identities and statuses at acquisition failure.

## Non-goals

- No target-cwd routing, worktree switching, replacement binding, old-generation closure, replacement activation, persistence, module singleton, cache, session-file state, peer authority, or global stop-the-world lock.
- No queueing/holding rejected admissions and no cross-process or restart recovery.

## Normative core contract

1. The manager owns owner-scoped admission and generation state for same-cwd managed work. It must not recover or reconstruct that state from a module singleton, cache, session file, or disk state.
2. `acquire(owner)` linearizes with managed-task admission. With no queued/running same-owner tasks, it creates an active lease bound to that owner’s current generation and closes same-owner admission. With active tasks, it returns only bounded identities/statuses, terminalizes that attempt as failed, and atomically restores admission; it returns no lease.
3. While an active lease exists, same-owner admission is deterministically rejected, is neither queued nor held, and creates no task identity. Other owners are unaffected.
4. The manager records immutable owner/generation/lease state. A terminal operation uses compare-and-set so exactly one terminal disposition wins. `release(lease)` is the only A6a terminal behavior that reopens the unchanged old generation; it is idempotent. Stale, malformed, unknown-owner, generation-mismatched, or losing terminal calls cannot change admission or generations.
5. All state is process-local. Destruction/restart drops it; nothing is rehydrated from disk, a session file, module global, or cache.

## Dependencies

- #379 merged; A3 and A4.

## Acceptance criteria

- [ ] The core does not recover admission or generation state from a module singleton, cache, session file, or persistence fallback.
- [ ] Acquire atomically closes same-owner admission and binds the lease to the current generation only when no same-owner task is queued/running.
- [ ] Failed acquisition returns bounded active-task evidence, releases the barrier atomically, and yields no lease.
- [ ] Same-owner admission during a lease is rejected without a task identity/queue; other owners remain admissible.
- [ ] Release restores only the unchanged old generation and is idempotent.
- [ ] Generation records and terminal CAS prevent stale, malformed, duplicate, opposite, or racing calls from altering the winner.
- [ ] The core is process-local only; restart never recovers state.
- [ ] This child contains no target-cwd, worktree, replacement, activation, or persistence behavior.

## Verification

Run focused state-machine and race tests for acquire versus admission, acquisition with active tasks, same-owner versus other-owner admission, release versus admission, terminal-CAS contention, duplicate/opposite/stale terminal calls, generation mismatch, and process-loss/no-recovery behavior. Run affected task-manager tests. Packed-install proof belongs to A7a1.

## Rollback boundary

Revert this core while preserving the prior same-cwd managed behavior. Do not introduce persistence or reopen an already committed old generation.

## Review workload forecast

One owner-scoped synchronization work unit.

## Pre-publication measured A+D/test-inventory gate

Before the first publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the complete active register. If it exceeds 400 A+D or 60 minutes, stop before publication; split locally, regenerate the register, counts, topology, parent and #376, update tombstones and hash-bound diffs, rerun exact-title searches and full human validation, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
