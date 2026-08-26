# feat(peers): add deterministic Windows named-pipe lifecycle

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B5a, B2b2, and B6a must be created, formally linked, reviewed, and accepted before implementation.

## Outcome
Add deterministic named-pipe endpoint-record lifecycle, liveness, reclaim, revocation closure, and shutdown behavior for the supported single-active-OS-user Windows scope.

## Evidence and scope
B5a owns a non-credential endpoint record under B2b1's current-user private storage root and safety policy, separate from B2b1's exact credential-record schema. Windows v1 supports only a single-active-OS-user workstation; shared or multi-user hosts are unsupported. This scope does not claim runtime detection of all logged-in users or named-pipe DACL isolation.

## Included scope
- Only `starting`, `live`, `draining`, and `stopped` lifecycle states; B5a's exact endpoint-record fields of `state`, 128-bit `instance_id`, 128-bit random `pipe_name` component, credential `protocol_epoch`, `revocation_generation`, heartbeat sequence, and `last_heartbeat_at`.
- A heartbeat every 5 seconds; stale only when non-negative wall-clock age is at least 30 seconds.
- Serialized reclaim requiring a stale record, a failed connect probe, and an unchanged endpoint-record tuple `(instance_id, pipe_name, protocol_epoch, revocation_generation)`.
- B2b2 matching-generation closure and idempotent `session_shutdown` that stop endpoint activity, close the server handle, and remove only the matching private endpoint record.

## Non-goals
No current-user-only named-pipe endpoint or pipe-DACL-isolation claim; no runtime detection of multi-user hosts; no native helper; no filesystem unlink, reparse, or symlink behavior for the named-pipe namespace; no packed proof; no canonical-envelope or MAC/signature validation; no ACK/dedupe/queue/turn disposition; no trust/credential mutation, retry, POSIX work, or durable mailbox/history.

## Normative contract
The lifecycle uses only `starting`, `live`, `draining`, and `stopped`; normal closure transitions `starting -> live -> draining -> stopped`, and repeated closure leaves `stopped` unchanged. B5a's separate non-credential endpoint record contains exactly `state`, 128-bit `instance_id`, 128-bit random `pipe_name` component, credential `protocol_epoch`, `revocation_generation`, heartbeat sequence, and `last_heartbeat_at`. It remains under B2b1's already-owned current-user private storage root and safety policy but is not part of B2b1's exact credential-record schema. The pipe-name component is not a secret or security authority, and the endpoint-record path and pipe name are redacted from public surfaces.

The record receives a heartbeat every 5 seconds. It is stale iff `wall_clock_now - last_heartbeat_at >= 30 seconds`; a negative or rollback age is not stale. Reclaim is one serialized compare-and-reclaim operation. It proceeds only when the current record is stale, a connect probe fails, and the exact current endpoint-record tuple `(instance_id, pipe_name, protocol_epoch, revocation_generation)` still matches the tuple selected for reclaim. Any stale check, connect probe, or tuple-match failure prevents reclaim.

Reclaim removes only that stale private endpoint record. It never removes, unlinks, reparses, or otherwise treats the named-pipe namespace as a filesystem; the pipe's OS lifetime ends only when its server handle closes. On a B2b2 event for the matching `revocation_generation`, B5b1 closes the server handle and then removes the matching endpoint record; it does not decide revocation. `session_shutdown` is idempotent: it stops admission and heartbeat, closes the server handle, and removes the matching endpoint record. B6d later owns Windows shutdown ordering with B6b1 queue/turn disposition; B5b1 makes no such ordering claim. This slice owns neither canonical-envelope/MAC validation nor ACK, dedupe, queue, or turn state.

## Dependencies
B5a platform pipe/authentication core, B2b2 invalidation event, and B6a bounded delivery core. B5b2 verifies B5a plus this lifecycle slice. B6d later integrates Windows shutdown ordering with B6b1 queue/turn disposition.

## Acceptance criteria
- [ ] Only `starting`, `live`, `draining`, and `stopped` occur, with idempotent closure and shutdown.
- [ ] B5a's non-credential endpoint record remains separate from B2b1's exact credential-record schema and contains exactly the frozen fields specified above.
- [ ] Heartbeats occur every 5 seconds; stale iff non-negative wall-clock age is at least 30 seconds, and negative/rollback age is not stale.
- [ ] Reclaim is one serialized operation requiring a stale record, failed connect probe, and an exact matching `(instance_id, pipe_name, protocol_epoch, revocation_generation)` tuple; any failed condition prevents reclaim.
- [ ] Reclaim removes only the stale private endpoint record. The named-pipe namespace is never unlinked or treated as a filesystem, and pipe lifetime ends only when the server handle closes.
- [ ] A matching B2b2 `revocation_generation` closes the server handle before removing the matching endpoint record, without deciding revocation.
- [ ] `session_shutdown` idempotently stops admission/heartbeat, closes the server handle, and removes the matching record; B6d alone later orders that work with B6b1 queue/turn disposition.
- [ ] The explicit single-active-OS-user scope is preserved without a pipe-DACL-isolation or multi-user-detection claim.

## Verification
Deterministic wall-clock lifecycle tests for 5-second heartbeats, 30-second stale age, and negative/rollback age; exact endpoint-record-schema and redaction tests; serialized stale/failed-connect/exact-tuple reclaim races; server-handle-lifetime tests proving no pipe-namespace removal; matching/nonmatching generation-closure tests; shutdown idempotency tests; and supported single-user Windows CI package tests.

## Rollback
Stop endpoint admission and heartbeat, close the affected server handle, and remove only its matching private endpoint record. Do not alter the named-pipe namespace, retry, reroute, emit an ACK, or alter B6a/B6b1 queue or turn state.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
