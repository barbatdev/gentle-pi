# feat(peers): integrate bounded delivery over Windows

## Parent and status gate

Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B6b1, B6a, B2b2, B5a, B5b1, and B5b2 must be created, formally linked, reviewed, and accepted before implementation.

## Outcome

Wire the completed Windows authenticated named-pipe lane through B6a and B6b1 and register one immutable Windows sender lane without creating a second delivery authority.

## Evidence and scope

Windows v1 remains limited to a single-active-OS-user workstation; shared or multi-user hosts are unsupported. B5a supplies only immutable Windows platform-authentication context and the unvalidated canonical envelope. B6d acquires a B6b1 lane lease and combines its exact immutable identifiers with that context before B6a. B6a retains canonical admission, ACK, dedupe, queue, and turn authority; B5b1 owns endpoint lifecycle and B5b2 supplies packed proof.

## Included scope

- Wire immutable B5a Windows context and envelope into B6a, then B6b1 guarded dispatch.
- Register exactly one immutable Windows lane tuple through the B6b1 SPI.
- Preserve ordered, idempotent Windows shutdown and shared bounded-delivery conformance.

## Non-goals

No POSIX work, platform fallback, transport substitution, endpoint/envelope redesign, wire-ACK/dedupe/queue/turn/principal/credential/trust/MAC authority change, retry, durable mailbox/history, UX/tool work, B7 child dependency, multi-user support claim, or DACL guarantee/detection claim.

## Normative contract

B5a owns only immutable Windows platform-authentication context and the unvalidated canonical envelope. Before every authenticated B6a handoff, B6d acquires exactly one B6b1 lease for its registered Windows lane and combines B5a context with the exact immutable `lane_id`, `lane_admission_generation`, and `handoff_lease_id`. This is the exact eight-field B6a source context: authenticated source peer ID, authenticated target peer ID, credential protocol epoch, credential revocation generation, `lane_id`, `lane_admission_generation`, `handoff_lease_id`, and opaque successful platform-authentication binding. Model or envelope input cannot supply or override these fields. In a finally-equivalent path, B6d releases that exact lease exactly once after B6a returns any ACK or rejection, throws, or the connection outcome is unknown. A lease is not accepted-work capacity and never transfers queue or delivery authority. Duplicate, unknown, or mismatched release fails closed and cannot affect another lease. B6a retains sole ACK, dedupe, queue, and receiver-turn authority. Only B6a-authorized queued work reaches B6b1. B6d registers exactly one immutable `(lane_id, platform, project_scope_binding, sender_handle)` Windows tuple through B6b1's process-local SPI. Registration carries no credential, trust, or delivery authority. A duplicate platform/scope registration fails closed. B6d consumes B2b2 endpoint-lifecycle events and then requests matching B6b1 lane closure; credential safety never waits for that request because B2b2 has already updated B6a's credential-authorization projection. No fallback or cross-platform substitution is permitted.

Windows shutdown is idempotent and ordered. First request B6b1 closure of the matching lane. B6b1 first atomically closes and increments B6a's version-bound lane-admission projection, rejecting stale accepted commits, then marks its lane `closing(generation)` and rejects new handoff leases while draining only unreleased old-generation leases; publication failure is fail-closed. Second wait at most 5 seconds only for unreleased old-generation handoff leases; a timeout records internal `shutdown_handoff_outcome_unknown`, does not retry or emit a new ACK, and any late B6a commit is rejected by B6a's closed projection even if its lease remains until the finally release. Third invoke only idempotent `B6b1.shutdownPeerDispatchOnce`: B6a terminalizes `queued` and pre-call `dispatching` entries as `shutdown_before_delivery` and releases their outstanding capacity tokens exactly once, while `enqueued` and `running` entries remain cancellation-pending with `shutdown_during_turn` and retain tokens until exact correlated settlement. Pi owns an enqueued returned `sendUserMessage(...,{deliverAs:'followUp'})` entry and exposes no selective purge; exact correlated start uses deny-all and one peer-only abort before provider or tool work. Fourth close the exact matching server handle and endpoint record, unregister the matching lane, and mark it `closed(generation)`. Repetition converges without reopening admission, emitting an ACK, repeating cancellation, unregistering a mismatched lane, closing a mismatched handle, or removing a mismatched record. The single-active-OS-user workstation precondition remains explicit, with no multi-user, DACL guarantee, or DACL detection claim.

## Dependencies

B6b1, B6a, B2b2, B5a, B5b1, and B5b2. B6d has no dependency on B7 children.

## Acceptance criteria

- [ ] B5a supplies only platform-authentication context; B6d acquires exactly one B6b1 lease, combines its exact immutable identifiers into the eight-field B6a source context, releases that exact lease once on every return, throw, or unknown connection outcome, and only B6a-authorized work enters B6b1.
- [ ] Exactly one immutable Windows lane tuple registers through B6b1; duplicate platform/scope fails closed and registration grants no trust, credential, or delivery authority.
- [ ] B2b2 endpoint-lifecycle events request, but never perform, matching B6b1 lane closure; B6a credential rejection does not wait for closure.
- [ ] Shutdown closes/increments B6a's projection before B6b1 marks the lane closing, waits at most 5 seconds only for unreleased old-generation handoff leases, rejects late commits after projection close even before finally release, invokes the one idempotent dispatch shutdown with pre-handoff `shutdown_before_delivery` exact capacity release and post-handoff cancellation-pending `shutdown_during_turn` settlement-bound capacity behavior without a selective Pi queue purge claim, then closes exact endpoint resources, unregisters its lane, and marks it closed.
- [ ] Timeout records only `shutdown_handoff_outcome_unknown`; late handoff, unknown outcome, and unavailable Windows have no retry, new ACK, POSIX, or transport fallback.
- [ ] Windows runs the shared bounded-delivery conformance behavior under explicit single-active-OS-user scope without shared/multi-user, DACL-guarantee, or DACL-detection claims.

## Verification

Run B5a platform-context-only handoff, B6d exact eight-field combined-context construction, B6a authority, B6b1 guarded dispatch, immutable Windows lane registration, no-lease and wrong lane/generation/lease rejection, exact release on every ACK/rejection/throw/unknown-outcome path, duplicate/unknown/mismatched release failure, B2b2-event-to-B6b1-closure-request with no B2b2 lane call, duplicate/mismatch unregister, projection-close-before-lane-close generation and lease tests, closure race, 5-second wait over only unreleased old-generation leases, and late-commit rejection after projection close, shutdown ordering/idempotency with pre-handoff before-delivery exact capacity release and post-handoff cancellation-pending settlement-bound during-turn dispositions, no-selective-dequeue and exact correlated deny-all/peer-only-abort fixtures, unavailable/no-fallback, supported single-user Windows conformance, B5b2 packed proof, and affected package tests.

## Rollback

Disable only Windows integration. Stop admission and heartbeat, invoke only `B6b1.shutdownPeerDispatchOnce`, unregister only the matching lane, close only the matching server handle, and remove only its matching endpoint record. Do not retry, reroute, emit a new ACK, independently invoke B6a, or alter B6a/B6b1 authority.

## Pre-publication measured A+D/test-inventory gate

Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
