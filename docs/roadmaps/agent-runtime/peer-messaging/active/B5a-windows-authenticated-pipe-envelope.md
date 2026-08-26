# feat(peers): admit Windows authenticated named-pipe envelopes

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B1/B2a/B2b1/B3 and B6a's envelope contract must be created, formally linked, and accepted before implementation.

## Outcome
Implement a local Windows named-pipe endpoint and platform-authentication handoff before B6a canonical-envelope admission, under explicit single-active-OS-user workstation support.

## Evidence and scope
Windows v1 supports only a single-active-OS-user workstation; shared or multi-user hosts are unsupported. This is a support boundary, not runtime detection of other logged-in users. B5a owns a non-credential endpoint record stored under B2b1's already-owned current-user private storage root and safety policy. The endpoint record is not part of B2b1's exact credential-record schema. B5a authenticates the endpoint/connection challenge with B2b1 credential/fingerprint material without storing or owning a secret, then hands an immutable platform-authentication context and the unvalidated canonical envelope to B6a.

## Included scope
- Create and publish B5a's non-credential endpoint record under B2b1's current-user private storage root and its established safety policy. Its fields are exactly `state`, 128-bit `instance_id`, 128-bit random `pipe_name` component, credential `protocol_epoch`, `revocation_generation`, heartbeat sequence, and `last_heartbeat_at`.
- Create a local named pipe using the 128-bit random `pipe_name` component. The component is not secret or security authority; redact the pipe name and endpoint-record path from public surfaces.
- Authenticate the endpoint/connection challenge using B2b1 current credential/fingerprint material without persisting or owning a secret, then pass an immutable successful platform-authentication context and the unvalidated canonical envelope to B6a.

## Non-goals
No current-user-only named-pipe endpoint or pipe-DACL-isolation claim; no runtime detection of multi-user hosts; no native helper; no reparse, symlink, or stale-unlink behavior for the named-pipe namespace; no canonical-envelope field or MAC/signature validation; no B2b2 revocation or generation admission decision; no ACK, dedupe, queue, receiver-turn state, POSIX work, trust mutation, durable mailbox, or automatic retry.

## Normative contract
Windows v1 supports a local Windows named pipe only on a single-active-OS-user workstation; shared or multi-user hosts are unsupported. B5a does not claim that it detects every logged-in user or that a named-pipe DACL provides current-user isolation. The named-pipe namespace is not a filesystem: B5a makes no pipe reparse, symlink, unlink, or stale-unlink claim. B2b1's current-user private storage root and safety policy protect only B5a's private endpoint record.

B5a owns the separate non-credential endpoint record, which is not part of B2b1's exact credential-record schema. The record contains exactly `state`, 128-bit `instance_id`, 128-bit random `pipe_name` component, credential `protocol_epoch`, `revocation_generation`, heartbeat sequence, and `last_heartbeat_at`. Its pipe-name component is published only through that private record, is not a secret or security authority, and the record path and pipe name are redacted from public surfaces.

B5a authenticates the endpoint/connection challenge with B2b1 current credential/fingerprint material without persisting, exposing, or owning a secret. It passes the unvalidated canonical envelope and an immutable successful platform-authentication context to B6a. B6a alone validates every canonical-envelope field and MAC/signature binding, determines the resulting terminal ACK, and owns dedupe, queue admission, and receiver-turn state. B5a does not authenticate the canonical envelope, decide B2b2 revocation or generation admission, or own ACK, dedupe, queue, turn, trust, or MAC-secret state.

## Dependencies
B1 protocol, B2a bilateral trust, B2b1 credentials/fingerprint binding and current-user private storage root/safety policy, B3 directory contract, and B6a envelope contract. B5b1 consumes this platform core; B5a has no B2b2, B6b1, B6c, or B6d dependency.

## Acceptance criteria
- [ ] The explicit single-active-OS-user workstation precondition and unsupported shared/multi-user scope are documented and tested without claiming runtime detection of all logged-in users or pipe-DACL isolation.
- [ ] B5a owns a non-credential endpoint record under B2b1's current-user private storage root/safety policy, separate from B2b1's exact credential-record schema, with exactly the frozen fields specified above.
- [ ] A 128-bit random pipe-name component is published only through the private endpoint record, is not security authority, and the record path and pipe name are redacted from public surfaces.
- [ ] Filesystem safety applies only to the private endpoint record; no pipe-namespace reparse, symlink, unlink, or stale-unlink behavior is claimed.
- [ ] B5a authenticates only the endpoint/connection challenge with B2b1 credential/fingerprint material without secret storage or ownership, then passes the unvalidated canonical envelope and immutable platform-authentication context to B6a.
- [ ] B6a alone validates canonical-envelope fields and MAC/signature binding and owns ACK/dedupe/queue/turn behavior; B5a does not decide B2b2 revocation or generation admission.

## Verification
Focused Windows private-endpoint-record safety and exact-schema tests; random-name publication and public-surface redaction tests; B2b1 endpoint/connection-challenge and immutable-context fixtures; B6a-only canonical-envelope/MAC/signature and ACK-authority regressions; and supported single-user Windows CI tests.

## Rollback
Disable named-pipe admission without transferring trust, messages, or task work. Do not alter the named-pipe namespace, create an ACK, or transfer B6a/B2b2 authority.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
