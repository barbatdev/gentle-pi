# feat(peers): add private peer credential storage and rotation

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B1 and B2a must be created, formally linked, reviewed, and accepted before implementation.

## Outcome
Persist and rotate private directional peer credentials that are derived only from B2a verified trusted-pair records.

## Evidence and scope
B2a proves a trusted pair but deliberately owns neither secret material nor local persistence. A bounded local record is needed before a platform endpoint can authenticate a current peer credential.

## Included scope
- Exact versioned private credential records derived from B2a verified trusted-pair records.
- Safe POSIX and Windows current-user private storage validation and atomic writes.
- Atomic credential rotation that invalidates old material and emits the exact invalidated-epoch event consumed by B2b2.
- Complete redaction of credential and derived private material.

## Non-goals
No transport, endpoint liveness, trust mutation, revocation delivery/cancellation, queue or turn behavior, wire ACK behavior, task authority, auto enrollment, durable mailbox/history, or secret projection.

## Normative contract
Each record contains exactly `version`, `protocol_epoch`, `trusted_pair_record_id`, `trusted_pair_record_version`, authenticated local peer ID, authenticated remote peer ID, exact `project_scope_binding`, directional 256-bit random secret, authenticated endpoint fingerprint binding, issued metadata, expiry metadata, and `revocation_generation`. It is issued only from a current B2a verified trusted-pair record and is invalid when that record identity/version, either authenticated peer ID, exact scope binding, endpoint fingerprint binding, epoch, expiry, or generation no longer matches its current authority.

POSIX storage uses a `0700` directory and `0600` files. Windows storage uses a current-user-only ACL. Before read or write, storage rejects symlinks, reparse points, unsafe owner, unsafe permissions, or unsafe ACL/isolation. Writes are atomic.

Rotation atomically creates the new credential epoch and generation, immediately invalidates all prior material, and emits exactly one invalidated-epoch event identifying the invalidated epoch and generation transition for B2b2. Retried rotation requests use deterministic CAS/idempotency and must not create duplicate new epochs or events. This slice neither delivers, queues, admits, nor starts turns; B2b2 applies every downstream invalidated-epoch effect.

Credential values and derived private material are redacted from directory and storage projections, autocomplete, prompts, results, logs, diagnostics, errors, telemetry, crash output, fixtures, and snapshots. No secret, MAC, private fingerprint, endpoint capability, or credential serialization appears on those surfaces.

## Dependencies
Parent `https://github.com/Gentleman-Programming/gentle-pi/issues/442`, B1, and B2a verified trusted-pair records. B3 consumes current credential status only; B4a/B5a consume current credentials and authenticated endpoint-fingerprint bindings; B2b2 consumes the exact invalidated-epoch event.

## Acceptance criteria
- [ ] Credential serialization contains exactly the stated versioned fields, authenticated bindings, directional 256-bit random secret, issued/expiry metadata, and generation.
- [ ] Records can be issued only from a current B2a verified trusted-pair record.
- [ ] Unsafe POSIX/Windows paths, ownership, permissions, ACLs, symlinks, and reparse points are rejected; writes are atomic.
- [ ] Rotation atomically creates one new epoch/generation, immediately invalidates old material, and emits one exact invalidated-epoch event for B2b2.
- [ ] Rotation retry/CAS behavior is deterministic and cannot duplicate an epoch or event.
- [ ] All named redaction surfaces exclude credential and derived private material.
- [ ] No transport, trust mutation, revocation delivery, queue/turn behavior, ACK behavior, task authority, or auto enrollment is introduced.

## Verification
Focused record-schema, B2a-record binding, POSIX permission/ownership/symlink, Windows ACL/reparse, atomic-write, rotation CAS/idempotency, one-event invalidation, old-material invalidation, and exhaustive redaction fixture/snapshot tests; affected package tests.

## Rollback
Atomically invalidate newly rotated material under the same storage safety checks. No transport, queue, turn, task authority, or automatic enrollment fallback is introduced.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
