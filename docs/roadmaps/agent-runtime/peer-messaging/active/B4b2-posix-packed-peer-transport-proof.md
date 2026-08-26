# test(peers): prove packed POSIX peer transport

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B4a and B4b1 must be created, formally linked, reviewed, and accepted before implementation.

## Outcome
Prove the completed POSIX peer transport from a clean packed install, with no source-checkout or fallback path.

## Evidence and scope
A platform transport is releasable only when its packaged artifact proves real POSIX endpoint, authentication, lifecycle, and adversarial safety behavior.

## Included scope
- Clean-environment `npm pack` then install execution with no source checkout or source fallback.
- POSIX runtime tests for real endpoint/authentication/lifecycle behavior.
- Permission, symlink, stale-record, failed-connect, identity-bound reclaim, redaction, and rollback tests.

## Non-goals
No endpoint implementation, lifecycle redesign, Windows proof, ACK/dedupe/queue/turn ownership, trust/credential mutation, source-tree fallback, durable mailbox/history, or retry behavior.

## Normative contract
The test harness installs only the produced package into a clean environment and fails if source checkout resolution or fallback is available. It exercises B4a authentication and B4b1 lifecycle over a real POSIX endpoint. Adversarial tests prove private-path permission handling, no-symlink checks, and reclaim only after failed connect, stale record, and exact identity. Output redacts credentials, capabilities, MAC material, fingerprints, and endpoint paths. Rollback proves that disabling the packaged transport does not reroute or retry messages.

## Dependencies
B4a and B4b1 only.

## Acceptance criteria
- [ ] Clean `npm pack`/install POSIX execution has no source checkout or fallback.
- [ ] Real endpoint, authentication, lifecycle, shutdown, and reclaim behavior are tested.
- [ ] Permission, symlink, stale, failed-connect, exact-identity, redaction, and rollback adversarial cases pass.
- [ ] Tests do not claim or take ACK, dedupe, queue, or turn ownership.

## Verification
Run the clean packed POSIX suite and affected package tests; capture only redacted output.

## Rollback
Remove the proof harness only; do not introduce a source fallback, transport retry, or alternate delivery authority.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
