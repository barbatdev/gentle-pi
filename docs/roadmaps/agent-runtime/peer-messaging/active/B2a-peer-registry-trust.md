# feat(peers): add bilateral peer trust and project-scope registry

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B1 must be created, formally linked, reviewed, and accepted before this registry is implemented.

## Outcome
Create the bounded authoritative peer registry and bilateral trust state that emits verified trusted-pair records for B2b1.

## Evidence and scope
B1 freezes identity and authority bounds, but no existing peer registry can distinguish an opaque peer identity from a display name or prove bilateral same-scope trust. This slice owns only registry state, human-grant verification, and deterministic trust transitions.

## Included scope
- Stable opaque peer identities separate from normalized display names and deterministic collision diagnostics.
- Registry states exactly: `unregistered`, `registered-untrusted`, `pending bilateral confirmation`, `trusted`, and `revoked`.
- Explicit bilateral human grants from each peer's own registered live-session control context, bound by the registry to the grantor's stable peer ID.
- CAS/idempotent transitions and verified trusted-pair records for B2b1.

## Non-goals
No secret issuance or storage, transport, endpoint construction, addressability calculation, task authority, directory/UX implementation, durable mailbox/history, automatic registration, or automatic re-enrollment. A malicious process running as the same OS user remains outside B1's sandbox boundary; this registry makes no stronger isolation claim.

## Normative contract
A display name, normalized-name uniqueness, directory membership, peer-originated turn/message/tool, one-sided grant, or registration never creates or confirms trust. Each grant is an explicit human action performed from that peer's own registered live-session control context; the registry binds the action to that grantor's stable peer ID. It must not infer human approval from peer-originated content, display names, directory entries, or control contexts belonging to another peer.

A pair progresses only through the stated registry states. Matching verified bilateral grants for the exact authenticated local and remote stable peer IDs, public verification fingerprints, protocol epoch, and exact project-scope binding yield a verified trusted-pair record and state `trusted`. Same-project scope is required by default. A cross-project scope is valid only when both explicit human grants name the same approved exact scope. Any missing or mismatched ID, fingerprint, epoch, or scope leaves the pair untrusted or pending; revocation moves it to `revoked` and registration or stale/replayed grants cannot undo it.

Transitions use compare-and-swap on expected state/version. Retrying the same completed request with the same immutable grant tuple is idempotent; competing or incompatible tuples return one deterministic conflict and cannot overwrite a verified grant. A verified trusted-pair record contains only the matched trust tuple and record identity/version. It makes no endpoint, credential, delivery, or addressability claim. B2b1 is the only downstream consumer of this record; B3 alone computes addressability.

## Dependencies
Parent `https://github.com/Gentleman-Programming/gentle-pi/issues/442` and B1. B2b1 consumes verified trusted-pair records. B3, B4a, B5a, B6a, B6b1, B6c, B6d, and B7 consume this registry only through their stated contracts.

## Acceptance criteria
- [ ] Stable opaque identities remain distinct from display names, and normalized-name collisions are deterministic.
- [ ] Each registry state and permitted transition is testable, including deterministic CAS/idempotency/conflict behavior.
- [ ] Only matching explicit human grants from both peers' registered live-session control contexts can yield `trusted` for exact IDs, fingerprints, epoch, and project scope.
- [ ] Peer-originated content/tools, display names, directory entries, registration, and one-sided grants never create or confirm trust.
- [ ] A matching tuple emits a verified trusted-pair record only; it implies no credential, endpoint, delivery, or addressability state.
- [ ] B2b1 receives only verified trusted-pair records, and no stronger same-OS-user isolation claim is made.

## Verification
Focused identity/collision, state-transition CAS/idempotency/conflict, bilateral human-grant control-context binding, one-sided/content-origin denial, tuple mismatch, scope mismatch, fingerprint/epoch change, revocation non-re-enrollment, and trusted-pair-record boundary tests; affected package tests.

## Rollback
Remove this registry slice or revoke affected records. No credential material, endpoint, task authority, transport, automatic enrollment fallback, or same-user sandbox guarantee is introduced.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
