# feat(peers): add deterministic POSIX endpoint lifecycle

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B4a, B2b2, and B6a must be created, formally linked, reviewed, and accepted before implementation.

## Outcome
Add deterministic lifecycle, liveness, identity-bound cleanup, and revocation closure for the POSIX endpoint without owning delivery disposition or packed proof.

## Evidence and scope
B4a creates the authenticated POSIX endpoint and freezes its endpoint identity. This slice gives that endpoint exactly four lifecycle states: `starting`, `live`, `draining`, and `stopped`.

## Included scope
- An atomic private endpoint record containing lifecycle state, the B4a instance tuple `(instance_id, canonical_parent, basename, st_dev, st_ino)` plus Unix-socket file type, generation, heartbeat sequence, and wall-clock `last_heartbeat_at`.
- A heartbeat every 5 seconds. A record is stale only when its non-negative wall-clock age is at least 30 seconds; a negative or rollback age is not stale.
- Serialized compare-and-reclaim only after stale status, failed connect, and the exact recorded tuple/file type all match; reclamation is atomic and never blindly unlinks.
- `session_shutdown` idempotently stops endpoint admission and heartbeat, then performs identity-bound endpoint cleanup only.
- A B2b2 revocation event deterministically closes the matching endpoint generation without making a B2b2 revocation decision.

## Non-goals
No packed proof, endpoint/envelope redesign, canonical-envelope or MAC/signature validation, ACK, dedupe, queue, receiver-turn disposition, trust or credential mutation, B2b2 revocation decision, transport retry, Windows work, durable mailbox/history, automatic re-enrollment, or B6b1 queue/turn disposition ordering.

## Normative contract
The lifecycle transitions only `starting -> live -> draining -> stopped`; repeated shutdown or closure leaves `stopped` unchanged. The atomic private endpoint record contains lifecycle state, the B4a-frozen `(instance_id, canonical_parent, basename, st_dev, st_ino)` and Unix-socket file type, generation, heartbeat sequence, and wall-clock `last_heartbeat_at`. It records a heartbeat every 5 seconds. A record is stale only when `wall_clock_now - last_heartbeat_at >= 30 seconds`; a negative or rollback age is not stale.

Reclaim runs as one serialized compare-and-reclaim operation: it requires the current record to be stale, a failed connect probe, and a fresh `lstat` proving the exact recorded instance tuple and Unix-socket file type before cleanup. Any failed connect probe, stale test, record comparison, or identity/file-type check prevents reclaim and unlink. A wall-clock jump cannot reclaim a connectable endpoint because failed connect is mandatory. `session_shutdown` idempotently stops endpoint admission and heartbeat and performs only identity-bound endpoint cleanup. B6c integrates POSIX shutdown ordering later; B4b1 makes no B6b1 queue/turn disposition ordering claim. On a B2b2 revocation event, it closes exactly the matching endpoint generation deterministically, but does not decide revocation. This adapter owns neither ACK nor dedupe nor queue/turn state.

## Dependencies
B4a platform endpoint/authentication core, B2b2 invalidation event, and B6a bounded delivery core. B4b2 verifies B4a plus this lifecycle slice. B6c later integrates POSIX shutdown ordering; B4b1 does not own B6b1 queue/turn disposition.

## Acceptance criteria
- [ ] Only `starting`, `live`, `draining`, and `stopped` occur, with idempotent shutdown/closure.
- [ ] The atomic private endpoint record contains lifecycle state, B4a's exact tuple and Unix-socket file type, generation, heartbeat sequence, and wall-clock `last_heartbeat_at`.
- [ ] Heartbeats occur every 5 seconds; stale requires non-negative wall-clock age of at least 30 seconds, and negative/rollback age is not stale.
- [ ] Reclaim is one serialized compare-and-reclaim requiring stale record, failed connect, and a fresh exact tuple/file-type `lstat` match; blind unlink is impossible, including after a wall-clock jump.
- [ ] A matching B2b2 revocation closes exactly that endpoint generation without making the revocation decision.
- [ ] `session_shutdown` stops only endpoint admission/heartbeat and identity-bound endpoint cleanup; B4b1 makes no B6b1 queue/turn disposition ordering claim, and B6c integrates POSIX shutdown ordering later.

## Verification
Deterministic wall-clock lifecycle tests for 5-second heartbeats, 30-second stale age, and negative/rollback age; endpoint-record atomicity and exact tuple/file-type `lstat` mismatch tests; failed-connect/stale/identity serialized-reclaim races including connectable clock-jump cases; shutdown idempotency; matching/nonmatching revocation closure; and affected package tests.

## Rollback
Stop endpoint admission and heartbeat and perform identity-bound cleanup for the affected endpoint only. Do not retry, reroute, emit a wire ACK, or alter B6a/B6b1 queue or turn state.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
