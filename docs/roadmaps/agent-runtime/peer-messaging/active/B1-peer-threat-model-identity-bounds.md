# feat(peers): freeze peer threat model, identities, principals, and bounds

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B1 must be created, formally linked, reviewed, and accepted before registry, directory, transport, or UX implementation.

## Outcome
Freeze the local same-user threat model, normalized identity, least-privilege peer principal, protocol epoch, and exact v1 delivery limits.

## Evidence and scope
Current main has no owned peer registry or `gentle_list_agents`/`gentle_send_message` implementation. Freeze local-machine/same-OS-user scope; deterministic normalized identities and collisions; authenticated source/target identity; and the mandatory limits.

## Included scope
- v1 Windows support is limited to a single-active-OS-user workstation.
- Shared or multi-user Windows hosts are unsupported in v1.
- B2b1 credential/capability binding and B6a canonical MAC/signature authentication remain mandatory on every transport; random endpoint names are never security authority.

## Non-goals
No transport, credential storage, registration UX, cross-machine messaging, durable mailbox/history, channels, sandbox claim against a same-user malicious process, or privileged peer automation.

## Normative contract
A display name, directory membership, registration, or attribution never grants trust or authority. v1 Windows supports only a single-active-OS-user workstation; shared or multi-user Windows hosts are unsupported. This scope does not weaken protocol authentication: B2b1 credential/capability binding and B6a canonical MAC/signature authentication are mandatory, and random endpoint names are not security authority. A peer principal permits only read-only inspection and peer messaging; it cannot send/cancel by directory membership, change trust/registration/configuration, grant permission, invoke slash commands/templates, publish/install, perform destructive actions, or broaden tools. Messages are UTF-8 plain text. The protocol uses a versioned epoch and limits exactly: 16 KiB message; 32 outstanding accepted-work entries per authenticated peer; 128 outstanding accepted-work entries per receiver; burst 5; 30 accepted/source-target/min; hop 4; trace depth 4; expiry 5m; dedupe 10m. Each accepted entry counts against both outstanding capacity limits through queued, dispatching, enqueued, running, cancellation-pending, and outcome-unknown quarantine states. It releases its capacity exactly once only when Pi can no longer execute it: a pre-handoff revoked/shutdown terminal, exact correlated `host_settled`, exact correlated revoked/shutdown abort that reaches `agent_settled`, normal enqueued-no-start `agent_settled` as `delivery_outcome_unknown`, or session teardown for a throw/ambiguous no-correlation `delivery_outcome_unknown` quarantine. Hop or trace excess is rejected before a receiver turn.

## Dependencies
Parent `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. B2a, B2b1, B2b2, and B3-B7 consume this frozen contract.

## Acceptance criteria
- [ ] Identity normalization and collision diagnostics are deterministic.
- [ ] The local same-user threat boundary, single-active-user Windows precondition, and peer principal are testable.
- [ ] Each stated v1 limit is encoded once and testable, including outstanding accepted-work capacity across all accepted lifecycle states and unknown-outcome quarantine.
- [ ] Name, membership, and attribution grant no authority.

## Verification
Focused normalization, privilege-denial, protocol-constant, outstanding-capacity lifecycle and unknown-quarantine retention, hop/trace pre-turn rejection, and affected package tests.

## Rollback
Revert the contract/test slice; no peer registration or delivery state exists.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
