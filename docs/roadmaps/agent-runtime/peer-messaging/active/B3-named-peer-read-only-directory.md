# feat(peers): publish an independently releasable typed read-only directory

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B1, B2a, B2b1, and B2b2 must be accepted before implementation.

## Outcome
Publish a permission-neutral named-peer projection that can release independently of the task variant.

## Evidence and scope
The peer roadmap needs separate task and peer authoritative stores behind a typed union. Current main has no owned peer directory or discovery tool.

## Non-goals
No registry/trust mutation, send, cancel, registration, configuration, transport, task lifecycle operation, autonomous tool, or claim that membership proves trust.

## Normative contract
The directory is typed, read-only, permission-neutral, and independently releasable by variant. B2a's peer registry alone publishes `named_peer`; the task manager may independently publish `managed_task`; no shared mutable store exists. A peer entry may show opaque identity, normalized display name, entity type, bounded project label, live/busy state, and declared public capabilities. B3 alone computes `addressable`: it is true only while B2a trust is current, B2b1 credentials are current, B2b2 has not revoked them, and a live endpoint is available. Before transport exists it publishes `addressable: false` or `unavailable`, preserving independent release. Membership grants no send, cancel, trust, registration, or configuration authority. It exposes no credential, capability, MAC, private fingerprint, endpoint/socket/pipe path, token, transcript, or private transport material.

## Dependencies
B1, B2a, B2b1, and B2b2. A3 may independently supply a task variant. B4a/B4b1/B4b2 and B5a/B5b1/B5b2 consume no authority from this projection; B7 is a read-only consumer.

## Acceptance criteria
- [ ] Peer entries derive only from the B2a registry, use deterministic normalized-name ambiguity rendering, and B3 alone publishes addressability only when current trust, current non-revoked B2b1 credentials, and a live endpoint all hold.
- [ ] Variant typing supports independent peer/task publication without a shared mutable store.
- [ ] The directory is read-only and permission-neutral; membership cannot authorize send, cancel, trust, registration, or configuration.
- [ ] All private credential/transport material is absent.

## Verification
Focused typed-projection, independent-release, permission-denial, ambiguity, and redaction tests; affected package tests.

## Rollback
Remove the projection consumer only; peer registry and task records remain separate authorities.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
