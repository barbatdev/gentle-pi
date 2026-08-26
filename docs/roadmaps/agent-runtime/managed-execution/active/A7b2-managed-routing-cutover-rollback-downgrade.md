# feat(agents): cut over managed routing with rollback and downgrade gates

## Parent and status gate
Parent: #419 requires `status:needs-review` for publication. Fresh discovery found remote status drift from that required state. Before any publication, restore `status:needs-review` and read it back; stop if unconfirmed. This draft does not inherit remote status and is not approved or implementation-ready. #379 must be merged before implementation. A7b2 may start only after A7b1 is accepted and its transaction evidence is available.

## Outcome and evidence
Use accepted A7b1 to enable the managed-routing production cutover. **Before production cutover may open admission**, prove that both reverse paths are available and tested through that same accepted transaction: (1) a later release/config rollback and (2) a separate operator-initiated package downgrade.

The cutover consumes #379, delivered A1-A6a, accepted A7a1, and accepted A7b1.

## Included scope
- Prove the reverse release/config rollback path uses accepted A7b1 and affects future routing only.
- Prove the distinct operator package-downgrade path uses accepted A7b1 and affects future routing only.
- Keep both paths available and tested before a production cutover can reopen admission.
- Execute or enable production cutover only through A7b1.
- After A7b1 checks succeed, open routing only through the Gentle manager.
- Use A7b1 for any later rollback or downgrade; neither operation may touch live or terminal task state.

## Non-goals
No task transfer, migration, retry, per-task failover, dual authority, dual execution, automatic package downgrade, or coupling removal.

## Normative contract
The production cutover is forbidden from opening admission until tested evidence proves the reverse release/config rollback and separately initiated package-downgrade operator paths both invoke accepted A7b1. Every cutover, rollback, and downgrade supplies exact expected source routing generation/configuration and executes exclusively through A7b1's close → terminalize → zero-live → generation-CAS → bounded verify → open protocol.

After successful cutover, admission opens only through the Gentle manager. A later rollback or downgrade changes future routing only after a fresh quiescent A7b1 transaction and its bounded verification. A stale generation, duplicate transaction, timeout, unknown/inaccessible state, failed check, or failed CAS leaves routing unchanged. No task executes under two authorities or is transferred between them.

## Dependencies
#379 merged; delivered A1-A6a; accepted A7a1; accepted A7b1 with retained transaction evidence.

## Acceptance criteria
- [ ] Cutover cannot reopen admission until evidence proves tested reverse release/config rollback and operator package-downgrade paths both use accepted A7b1.
- [ ] Production cutover executes/enables only through A7b1 and opens admission only to the Gentle manager after its checks succeed.
- [ ] The reverse release/config rollback is available, tested, and changes future routing only through a fresh A7b1 transaction.
- [ ] The separately operator-initiated package downgrade is available, tested, and changes future routing only through a fresh A7b1 transaction.
- [ ] Every failed preflight, stale/duplicate CAS, timeout, unknown/inaccessible state, or verification failure leaves routing unchanged and preserves A7b1 restoration rules.
- [ ] No task ID/result/history/cancellation state is transferred, no task fails over, and no task executes through two authorities.

## Verification
Run focused integration tests that first demonstrate reverse rollback and package-downgrade availability through accepted A7b1, then demonstrate successful managed cutover/open. Exercise a later release/config rollback and a distinct operator downgrade, plus stale-generation, duplicate transaction, timeout, unknown/inaccessible authority, CAS, and bounded-verification failures. Assert future-routing-only effects, unchanged routing on abort, no task transfer/dual execution, and retained A7b1 transaction evidence. Run affected package tests.

## Rollback
Use the already-proven release/config rollback path through a new A7b1 quiescent transaction. For a package compatibility problem, an operator may choose the separately proven downgrade path through A7b1. Neither path reroutes an in-flight task or restores routing outside the closed transaction.

## Measured pre-publication split gate
Before the first publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the complete active register. If it exceeds 400 A+D or 60 minutes, stop before publication; split locally, regenerate the register, counts, topology, parent and #376, update tombstones and hash-bound diffs, rerun exact-title searches and full human validation, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
