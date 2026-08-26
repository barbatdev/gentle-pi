# feat(agents): add quiescent future-routing transaction authority

## Parent and status gate
Parent: #419 requires `status:needs-review` for publication. Fresh discovery found remote status drift from that required state. Before any publication, restore `status:needs-review` and read it back; stop if unconfirmed. This draft does not inherit remote status and is not approved or implementation-ready. #379 is OPEN with `status:approved`, is not delivered or merged, and must merge before implementation.

## Outcome and evidence
Deliver one bounded, reusable transaction core that makes a future-routing mutation safe only after the current routing authority is quiescent. This artifact defines and verifies the authority; it does **not** execute or enable a production routing cutover.

It consumes delivered A1-A6a plus accepted A7a1 readiness evidence.

## Included scope
- Close admission before preflight and keep it closed throughout the transaction.
- Wait for every queued or running task to reach one immutable terminal result.
- Abort on timeout, inaccessible authority, or unknown task state; do not mutate routing.
- Prove zero live tasks and the exact expected routing generation/configuration.
- Stage exactly one future-routing configuration change using generation CAS while admission is closed.
- Run bounded verification and restore the pre-transaction future-routing configuration before reopening if a pre-open check fails.
- On success, advance the generation once and open admission according to the caller's already-validated target.
- Expose bounded modes required by a future managed cutover, later release/config rollback, and operator package downgrade. This core does not perform those product operations itself.

## Non-goals
No production cutover; task transfer; task migration; dual authority; dual execution; per-task failover; or coupling removal.

## Normative contract
A caller supplies an exact expected source generation/configuration and one intended future-routing target. The core may stage that single change only while admission is closed, every known task is immutable-terminal, and zero live tasks are proven. Any timeout, unknown/inaccessible state, stale generation, concurrent/duplicate transaction, CAS failure, or failed bounded verification aborts without routing mutation.

If a staged change fails before admission reopens, the core restores and verifies the prior future-routing configuration while still closed. It does not advance the successful generation or admit work until restoration is proven. A successful transaction advances the generation exactly once and opens admission only through the caller's verified target. The same invariant applies to all supported modes; modes describe a future-routing intent, not task-level behavior.

## Dependencies
#379 merged; delivered A1-A6a; accepted A7a1.

## Acceptance criteria
- [ ] Admission closes before transaction preflight and cannot reopen before the terminal result is resolved.
- [ ] Every queued/running task reaches an immutable terminal state before staging; timeout, unknown, or inaccessible state aborts unchanged.
- [ ] The core proves zero live tasks plus exact expected generation/configuration before its single CAS stage.
- [ ] Stale generation, duplicate/concurrent use, and CAS failure cause no second mutation or generation advance.
- [ ] A failed pre-open verification restores and verifies the prior configuration while still closed.
- [ ] A successful transaction advances generation once and opens through only the verified target.
- [ ] Cutover, release/config rollback, and package-downgrade modes share these invariants without executing a product operation here.
- [ ] No task ID, result, history, cancellation state, or ownership crosses authorities.

## Verification
Focused transition tests cover admission close; queued/running terminalization; timeout; unknown/inaccessible authority; zero-live proof; exact source match; stale generation; duplicate/concurrent transaction; CAS failure; bounded verification failure and pre-open restoration; one successful generation advance/open; and mode parity. Assert that every abort leaves future routing unchanged and no task crosses authorities. Run affected package tests and retain bounded transaction evidence.

## Rollback
Before admission opens, restore and verify the captured prior future-routing configuration through this same closed, quiescent transaction state. Do not reopen until restoration succeeds; never reroute a live or terminal task.

## Measured pre-publication split gate
Before the first publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the complete active register. If it exceeds 400 A+D or 60 minutes, stop before publication; split locally, regenerate the register, counts, topology, parent and #376, update tombstones and hash-bound diffs, rerun exact-title searches and full human validation, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
