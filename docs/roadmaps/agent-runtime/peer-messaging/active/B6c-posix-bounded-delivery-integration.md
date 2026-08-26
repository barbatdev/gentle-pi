# feat(peers): integrate bounded delivery over POSIX

## Parent and status gate

Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B6b1, B6a, B2b2, B4a, B4b1, and B4b2 must be created, formally linked, reviewed, and accepted before implementation.

## Outcome

Wire the completed POSIX authenticated transport lane through B6a and B6b1 and register one immutable POSIX sender lane without creating a second delivery authority.

## Evidence and scope

B4a supplies only immutable POSIX platform-authentication context and the unvalidated canonical envelope. B6c acquires a B6b1 lane lease and combines its exact immutable identifiers with that context before B6a. B6a remains canonical admission, ACK, dedupe, queue, and turn authority; its accepted queued work reaches B6b1 for guarded Pi dispatch. B4b1 owns endpoint lifecycle and B4b2 supplies packed proof.

## Included scope

- Wire immutable B4a POSIX context and envelope into B6a, then B6b1 guarded dispatch.
- Register exactly one immutable POSIX lane tuple through the B6b1 SPI.
- Preserve ordered, idempotent POSIX shutdown and shared bounded-delivery conformance.

## Non-goals

No Windows work, platform fallback, transport substitution, endpoint/envelope redesign, wire-ACK/dedupe/queue/turn/principal/credential/trust/MAC authority change, retry, durable mailbox/history, UX/tool work, or dependency on B7 children.

## Normative contract

B4a owns only immutable POSIX platform-authentication context and the unvalidated canonical envelope. Before every authenticated B6a handoff, B6c acquires exactly one B6b1 lease for its registered POSIX lane and combines B4a context with the exact immutable `lane_id`, `lane_admission_generation`, and `handoff_lease_id`. This is the exact eight-field B6a source context: authenticated source peer ID, authenticated target peer ID, credential protocol epoch, credential revocation generation, `lane_id`, `lane_admission_generation`, `handoff_lease_id`, and opaque successful platform-authentication binding. Model or envelope input cannot supply or override these fields. In a finally-equivalent path, B6c releases that exact lease exactly once after B6a returns any ACK or rejection, throws, or the connection outcome is unknown. A lease is not accepted-work capacity and never transfers queue or delivery authority. Duplicate, unknown, or mismatched release fails closed and cannot affect another lease. B6a retains sole ACK, dedupe, queue, and receiver-turn authority. Only B6a-authorized queued work reaches B6b1. B6c registers exactly one immutable `(lane_id, platform, project_scope_binding, sender_handle)` POSIX tuple through B6b1's process-local SPI. Registration carries no credential, trust, or delivery authority. A duplicate platform/scope registration fails closed. B6c consumes B2b2 endpoint-lifecycle events and then requests matching B6b1 lane closure; credential safety never waits for that request because B2b2 has already updated B6a's credential-authorization projection. No fallback or cross-platform substitution is permitted.

POSIX shutdown is idempotent and ordered. First request B6b1 closure of the matching lane. B6b1 first atomically closes and increments B6a's version-bound lane-admission projection, rejecting stale accepted commits, then marks its lane `closing(generation)` and rejects new handoff leases while draining only unreleased old-generation leases; publication failure is fail-closed. Second wait at most 5 seconds only for unreleased old-generation handoff leases; a timeout records internal `shutdown_handoff_outcome_unknown`, does not retry or emit a new ACK, and any late B6a commit is rejected by B6a's closed projection even if its lease remains until the finally release. Third invoke only idempotent `B6b1.shutdownPeerDispatchOnce`: B6a terminalizes `queued` and pre-call `dispatching` entries as `shutdown_before_delivery` and releases their outstanding capacity tokens exactly once, while `enqueued` and `running` entries remain cancellation-pending with `shutdown_during_turn` and retain tokens until exact correlated settlement. Pi owns an enqueued returned `sendUserMessage(...,{deliverAs:'followUp'})` entry and exposes no selective purge; exact correlated start uses deny-all and one peer-only abort before provider or tool work. Fourth close only the exact POSIX identity-bound endpoint, unregister the matching lane, and mark it `closed(generation)`. Repetition converges without reopening admission, emitting an ACK, repeating cancellation, unregistering a mismatched lane, or closing a mismatched endpoint.

## Dependencies

B6b1, B6a, B2b2, B4a, B4b1, and B4b2. B6c has no dependency on B7 children.

## Acceptance criteria

- [ ] B4a supplies only platform-authentication context; B6c acquires exactly one B6b1 lease, combines its exact immutable identifiers into the eight-field B6a source context, releases that exact lease once on every return, throw, or unknown connection outcome, and only B6a-authorized work enters B6b1.
- [ ] Exactly one immutable POSIX lane tuple registers through B6b1; duplicate platform/scope fails closed and registration grants no trust, credential, or delivery authority.
- [ ] B2b2 endpoint-lifecycle events request, but never perform, matching B6b1 lane closure; B6a credential rejection does not wait for closure.
- [ ] Shutdown closes/increments B6a's projection before B6b1 marks the lane closing, waits at most 5 seconds only for unreleased old-generation handoff leases, rejects late commits after projection close even before finally release, invokes the one idempotent dispatch shutdown with pre-handoff `shutdown_before_delivery` exact capacity release and post-handoff cancellation-pending `shutdown_during_turn` settlement-bound capacity behavior without a selective Pi queue purge claim, then closes the exact endpoint, unregisters its lane, and marks it closed.
- [ ] Timeout records only `shutdown_handoff_outcome_unknown`; late handoff, unknown outcome, and unavailable POSIX have no retry, new ACK, Windows, or transport fallback.
- [ ] POSIX runs the shared bounded-delivery conformance behavior.

## Verification

Run B4a platform-context-only handoff, B6c exact eight-field combined-context construction, B6a authority, B6b1 guarded dispatch, immutable POSIX lane registration, no-lease and wrong lane/generation/lease rejection, exact release on every ACK/rejection/throw/unknown-outcome path, duplicate/unknown/mismatched release failure, B2b2-event-to-B6b1-closure-request with no B2b2 lane call, duplicate/mismatch unregister, projection-close-before-lane-close generation and lease tests, closure race, 5-second wait over only unreleased old-generation leases, and late-commit rejection after projection close, shutdown ordering/idempotency with pre-handoff before-delivery exact capacity release and post-handoff cancellation-pending settlement-bound during-turn dispositions, no-selective-dequeue and exact correlated deny-all/peer-only-abort fixtures, unavailable/no-fallback, shared conformance, B4b2 packed proof, and affected package tests.

## Rollback

Disable only POSIX integration. Stop admission and heartbeat, invoke only `B6b1.shutdownPeerDispatchOnce`, unregister only the matching lane, and close only the matching endpoint. Do not retry, reroute, emit a new ACK, independently invoke B6a, or alter B6a/B6b1 authority.

## Pre-publication measured A+D/test-inventory gate

Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
