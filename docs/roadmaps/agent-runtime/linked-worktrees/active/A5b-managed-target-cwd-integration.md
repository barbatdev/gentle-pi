# feat(agents): integrate managed target-cwd execution

## Parent and status gate
Parent: #376. Before publication, restore and read back #376 `status:needs-review`, update its contract in place, and obtain fresh review. This draft is not approved or implementation-ready. #379 must merge before implementation. A5b consumes delivered A1-A4 from #419 one way; #419 completion does not wait for A5b.

## Outcome
Implement validated managed target-cwd execution through the already selected Gentle task authority without changing the owner session cwd.

## Evidence and scope
Consume only the in-place updated, re-reviewed, and freshly frozen #376 contract. Validate cwd and capability before task-record publication, load target resources through the normal host lifecycle, and preserve distinct pre-creation and post-publication failures.

## Non-goals
No owner-session switching, dirty-content movement, prompt-simulated cwd, linked-worktree provisioning, external-pane fallback, dual execution, or per-task failover.

## Normative contract
One selected execution authority owns each task. Unsupported or invalid target-cwd input stops before creation under #379. A post-publication failure terminalizes the existing task. No visible peer, pane, terminal, or external surface substitutes for the manager.

## Dependencies
#379 merged; A1-A4 delivered; #376 updated in place, re-reviewed, and freshly frozen/accepted. #371 is diagnostic-only when delivered. No #419 completion or A7 slice depends on this integration.

## Acceptance criteria
- [ ] Invalid cwd and missing capability create no task ID.
- [ ] Valid target resources use the normal host lifecycle while owner cwd is unchanged.
- [ ] Post-publication failures preserve one failed task identity.
- [ ] No fallback or dual authority is observable.

## Verification
Focused target-cwd, invalid-cwd, resource-lifecycle, owner-cwd, and pre/post-creation failure tests; affected package tests.

## Rollback
Quiescent release/config rollback changes only future routing; no task fails over. Package downgrade is separately operated.

## Pre-publication measured A+D/test-inventory gate
Before the first publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the complete active register. If it exceeds 400 A+D or 60 minutes, stop before publication; split locally, regenerate the register, counts, topology, parent, #376, and upstream links as applicable, update tombstones and hash-bound diffs, rerun exact-title searches and full human validation, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
