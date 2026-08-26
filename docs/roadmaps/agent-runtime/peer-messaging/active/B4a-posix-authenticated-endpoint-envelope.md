# feat(peers): admit POSIX authenticated endpoints and envelopes

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B1/B2a/B2b1/B3 and B6a's envelope contract must be created, formally linked, and accepted before implementation.

## Outcome
Implement POSIX local endpoint creation and platform-authentication handoff before B6a canonical-envelope admission.

## Evidence and scope
Create a same-user POSIX endpoint beneath a private 0700 parent. B4a performs endpoint/connection authentication using B2b1 credential/fingerprint challenge material without persisting or owning the secret, then passes immutable platform-authentication evidence/context to B6a. B6a alone validates canonical-envelope fields and MAC/signature and owns rejected ACKs; B2b2 alone owns generation and revocation admission decisions.

## Included scope
- Race-safe endpoint creation and validation: a private 0700 parent, owned regular parent components, `lstat`/no-symlink validation, an exclusively bound random endpoint instance, and a 0600 Unix socket.
- Exact identity-bound cleanup: after successful bind/listen and mode 0600, capture by `lstat` the Unix-socket file type and tuple `(instance_id, canonical_parent, basename, st_dev, st_ino)`; before unlink or reclaim, `lstat` again and require that exact tuple and file type. A mismatch means no unlink.
- Endpoint/connection authentication using B2b1 current credential/fingerprint challenge material without persisting or owning the secret, followed by an immutable platform-authentication evidence/context handoff to B6a.

## Non-goals
No canonical-envelope field or MAC/signature validation, liveness loop, stale cleanup, revocation workflow or B2b2/non-revoked admission decision, shutdown, packed proof, Windows support, trust mutation, durable mailbox, retry, wire ACK, dedupe, queueing, or receiver-turn controls beyond the B6a handoff.

## Normative contract
The adapter validates every parent component with `lstat`: it must be owned, regular where applicable, and never a symlink; its private parent is mode 0700. It exclusively binds a random endpoint instance. Only after successful bind/listen and setting socket mode 0600, it captures by `lstat` the Unix-socket file type and exact `(instance_id, canonical_parent, basename, st_dev, st_ino)` identity. Before any unlink or reclaim, it `lstat`s again and requires the exact captured tuple and Unix-socket file type; any mismatch causes no unlink. Random bind is exclusive; blind unlink is forbidden.

The adapter authenticates the endpoint/connection with B2b1 current credential/fingerprint challenge material without persisting or owning a secret. It passes immutable successful platform-authentication evidence/context and the unvalidated canonical envelope to B6a. B6a alone validates every canonical-envelope field and the MAC/signature binding, and alone emits a rejected ACK. On failed platform authentication, the adapter supplies invalid platform context to B6a or closes the connection according to the B6a adapter contract; it never emits an ACK. It does not decide B2b2 generation or revocation admission. This adapter never owns wire ACKs, dedupe, queue admission, receiver-turn state, trust, or MAC-secret storage.

## Dependencies
B1 protocol, B2a bilateral trust, B2b1 credentials/fingerprint challenge binding, B3 read-only directory contract, and B6a envelope contract. B4b1 consumes this platform core; B6a owns canonical-envelope validation, ACK/dedupe/queue/turn behavior. B4a has no B2b2, B6b1, B6c, or B6d dependency.

## Acceptance criteria
- [ ] Endpoint creation validates a private 0700 parent and owned regular non-symlink components with `lstat`, exclusively binds a random instance, and creates a 0600 Unix socket.
- [ ] After bind/listen, `lstat` captures `(instance_id, canonical_parent, basename, st_dev, st_ino)` and Unix-socket file type; every unlink/reclaim rechecks that exact identity and never blindly unlinks.
- [ ] B4a authenticates the endpoint/connection from B2b1 credential/fingerprint challenge material without secret storage or ownership, then passes only immutable platform-authentication evidence/context and the unvalidated envelope to B6a.
- [ ] B6a alone validates canonical-envelope fields and MAC/signature and owns rejected ACKs; B4a neither requires nor decides B2b2/non-revoked admission.
- [ ] Failed platform authentication produces invalid B6a context or a B6a-contract connection close, never a receiver turn or adapter-owned ACK, dedupe, queue, turn, trust, or MAC-secret state.

## Verification
Focused POSIX permission/ownership/`lstat`/symlink/exclusive-bind tests; post-bind and pre-unlink tuple/file-type mismatch fixtures; B2b1 challenge/immutable-context fixtures; B6a-only canonical-envelope/MAC/signature and rejected-ACK authority regressions; and affected package tests.

## Rollback
Disable endpoint admission and perform identity-bound endpoint cleanup only; do not transfer messages or trust elsewhere.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
