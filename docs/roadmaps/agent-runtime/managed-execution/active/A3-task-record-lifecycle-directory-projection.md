# feat(agents): add core managed-task records and read-only directory projection

## Parent and gate

Parent: #419 requires `status:needs-review` for publication. Fresh discovery found remote status drift from that required state. Before any publication, restore `status:needs-review` and read it back; stop if unconfirmed. This draft does not inherit remote status and is not approved or implementation-ready. #379 is OPEN with `status:approved`, not delivered or merged; it is an approved/open prerequisite that must merge before implementation. Child creation and formal links are required before tracker re-review.

## Outcome

Create the process-local core managed-task record and publish its task variant through a typed read-only directory contract.

## Evidence and current limitation

#419 review evidence establishes that Gentle currently does not own task IDs, lifecycle, status, result, cancellation, or scheduling. The reviewer specifically requires one task-record linearization point, atomic terminal authority, idempotent operations, and exactly one immutable terminal result. Current-main search found no owned task manager implementation.

## Included scope

- A process-local task record with queued, running, completed, failed, and cancelled states.
- Validation completed before publication: a validation failure creates no task ID.
- Atomic task-record insertion as the single task-ID publication and linearization point.
- An owner-scoped creation idempotency key: repeating the same key and payload returns the same task ID or the same validation outcome, while reusing that key with a different payload is rejected.
- Compare-and-set terminal-state authority: the first valid terminal transition wins and later terminal events are diagnostic only.
- Idempotent status and result reads and one immutable terminal result.
- A typed, read-only task-directory variant with bounded metadata only.

## Non-goals

- No resume, recovery, durable history across restart, execution launch integration, cancellation policy, peer registry, messaging permission, or unified mutable store.
- No directory entry as authority to cancel or message.

## Normative behavioral contract

Validation completes before publication; a validation failure creates no task ID. Atomic insertion of the task record is the sole publication and linearization point, and a task ID is published exactly once. Creation uses an owner-scoped idempotency key: the same key and payload returns the same task ID or the same validation outcome, while the same key with a different payload is rejected. Terminal transitions use compare-and-set authority: the first valid terminal transition wins, later terminal events are diagnostic only, and exactly one immutable terminal result is retained. Duplicate status/result reads are idempotent and stable. Process restart discards managed-task state in v1. The task manager remains an authoritative store separate from the peer registry; it may independently publish its own typed read-only directory variant.

## Dependencies

- A1 and A2.
- A4 extends lifecycle behavior. B3 may consume only the read-only projection shape, never this store's authority.

## Acceptance criteria

- [ ] Validation failure creates no task ID, and records cannot expose a task before atomic insertion at the single publication/linearization point.
- [ ] Repeating an owner-scoped creation idempotency key with the same payload returns the same task ID or validation outcome; reusing it with a different payload is rejected.
- [ ] Publication races preserve one publication result and never expose a partially published task.
- [ ] Terminal transitions use compare-and-set authority: the first valid terminal transition wins and later events are diagnostic only.
- [ ] Each terminal task has exactly one immutable result and terminal disposition.
- [ ] Duplicate status/result reads are idempotent.
- [ ] Restart has no implicit resume or durable recovery claim.
- [ ] The directory projection redacts credentials, endpoint capabilities, and private transport material.
- [ ] Task projection does not grant messaging or cancellation rights.

## Verification

Focused state-machine tests for validation-before-publication, duplicate create, conflicting idempotency payload, publication races, terminal compare-and-set races, duplicate reads, and restart loss; then affected package tests. Packed-install evidence is deferred to A7.

## Rollback boundary

Revert the new in-memory record store and projection as one unit; no persisted state requires migration.

## Review workload forecast

One core-record work unit.

## Pre-publication measured A+D/test-inventory gate

Before the first publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the complete active register. If it exceeds 400 A+D or 60 minutes, stop before publication; split locally, regenerate the register, counts, topology, parent and #376, update tombstones and hash-bound diffs, rerun exact-title searches and full human validation, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
