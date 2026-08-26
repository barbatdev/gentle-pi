# docs(agents): record external-coupling inventory and provenance disposition

## Parent and status gate

Parent #419 requires `status:needs-review` for publication. Remote `status:approved` is stale. Before any future authorized mutation, restore `status:needs-review` and read it back. This planning draft authorizes neither publication nor implementation.

## Outcome

Produce a bounded declared/runtime coupling inventory with maintainer disposition and provenance records for the delivered managed path.

## Included scope

- A bounded inventory schema for declared references and observed runtime coupling evidence.
- Deterministic inventory collection through injected declared/runtime evidence adapters.
- Per-entry retained, candidate, unknown, or rejected disposition with maintainer readback and provenance record.
- Targeted tests for evidence completeness, redaction, unknown disposition, and no-removal behavior.

## Non-goals

No selected coupling removal, release/config rollback, package downgrade, absence-environment proof, production cutover, task migration, per-task failover, automatic licensing conclusion, or absolute non-derivation claim.

## Normative contract

Every inventory entry records its evidence source, bounded declared/runtime observation, disposition, and maintainer readback. Missing, inaccessible, or incomplete evidence yields `unknown` and blocks any removal conclusion. The inventory does not mutate package dependencies, configuration, runtime selection, or routing. Material provenance or licensing findings require a recorded maintainer disposition.

## Dependencies

#379 merged; successful A7b2 cutover; accepted A7a1 evidence; and available declared/runtime inventory evidence. Actual selected coupling removal and absence proof are deferred, unmaterialized, outside this publication transaction, have no issue ID or draft, and cannot be claimed delivered until the inventory and maintainer disposition select a concrete coupling.

## Acceptance criteria

- [ ] Each bounded inventory entry has declared/runtime evidence, provenance, disposition, and maintainer readback.
- [ ] Missing or incomplete evidence remains `unknown` and cannot support removal.
- [ ] The implementation makes no dependency, configuration, routing, or package mutation.
- [ ] Material provenance or licensing findings retain a maintainer disposition.

## Verification

Run focused inventory tests for complete, retained, candidate, unknown, inaccessible, redacted, and maintainer-readback cases, then affected package tests. Commands are planned post-implementation and have not run.

## Rollback

Remove only the inventory records and code. No coupling, package, routing, or runtime selection changes require restoration.

## Forecast split gate

Before review or delivery, record actual `git diff --numstat` additions and deletions and focused plus regression test evidence. Split immediately if actual A+D exceeds 400 or elapsed implementation plus review exceeds 60 minutes.
