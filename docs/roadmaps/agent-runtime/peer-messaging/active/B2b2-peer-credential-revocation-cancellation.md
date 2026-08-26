# feat(peers): enforce peer credential revocation and invalidated-epoch cancellation

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B1, B2a, B2b1, and B6a must be accepted before implementation. B2b2 consumes B6a's bounded invalidated-epoch hooks; it has no B6b1/B6c/B6d or circular/joint-review dependency.

## Outcome
Apply revocation and rotation invalidation to current peer credentials, downstream admission, queued work, and running peer turns without changing B6a's ACK/dedupe authority.

## Evidence and scope
B2b1 produces current credential generations and invalidated-epoch events but deliberately owns no delivery, queue, or turn behavior. After its rotation or revocation decision, B2b2 calls B6a's bounded hooks for deterministic admission and execution-race outcomes.

## Included scope
- Atomic credential/capability invalidation, revocation generation changes, and current-credential status publication.
- Downstream handling of B2b1 rotation invalidated-epoch events under the same rules as revocation.
- Deterministic admission, pre-handoff queue cancellation, post-handoff cancellation-pending handling, authorization recheck, and internal-disposition behavior.
- CAS/idempotency/duplicate-invalidation handling and complete disposition redaction.

## Non-goals
No credential serialization or storage, transport/endpoint implementation, wire ACK redesign, task authority, durable mailbox/history, trust mutation, B3 mutation, or automatic re-enrollment.

## Normative contract
Revocation atomically invalidates the affected credentials and capabilities, increments `revocation_generation`, publishes `current_credential=false`, and never auto re-enrolls. It does not directly mutate B3; B3 computes `addressable: false` from the current trust, credential, revocation, and endpoint inputs. A B2b1 invalidated-epoch event follows the same downstream rules.

After B2b1's rotation or revocation decision, B2b2 atomically invalidates the matching credential and synchronously publishes the new credential-authorization projection to B6a through B6a's existing hook. B2b2 never mutates or calls B6b1 lane state. B6a serializes that projection check in admission step 1; an admission race is accepted before invalidation or rejected after invalidation, with no third or ambiguous result. B6a remains the sole authority for canonical envelopes, ACK values, dedupe, queue admission, delivery state, and terminal CAS.

For a matching invalidated entry, B6a terminalizes `queued` and pre-call `dispatching` as `revoked_before_delivery`, releases its outstanding accepted-work capacity token exactly once, and starts no receiver turn. Once `pi.sendUserMessage` returns, `enqueued` means Pi owns the queued user entry and exposes no selective removal for that exact `deliverAs:'followUp'` entry. B6a marks it cancellation-pending with immutable eventual disposition `revoked_during_turn`; it never claims zero model turn. An exact correlated `before_agent_start` rechecks B6a's credential-authorization and lane-admission projections before provider or tool work. If invalidated, it activates deny-all rather than the normal three-wrapper allowlist, requests one abort for that exact correlated peer run, permits no tool execution, and retains `revoked_during_turn`. An enqueued or running entry retains its outstanding capacity token through the abort request and releases it only when the exact correlated abort reaches `agent_settled`. If an enqueued pending entry never starts, exact correlated `agent_settled` terminalizes it as `revoked_during_turn` and releases the token. Every peer-tool authorization rechecks B6a's current credential projection and denies after invalidation. The existing wire ACK remains `accepted`; invalidation sends no new ACK. Duplicate invalidation cannot alter an existing terminal disposition.

CAS versioning makes repeated revocation, repeated invalidated-epoch delivery, and duplicate notifications idempotent. Competing invalidations have deterministic results and cannot resurrect credentials, capabilities, queue entries, or turn authorization. Credential values, capabilities, epochs, fingerprints, and internal dispositions are completely redacted from logs, diagnostics, errors, telemetry, crash output, prompts, results, fixtures, snapshots, and external projections.

## Dependencies
Parent `https://github.com/Gentleman-Programming/gentle-pi/issues/442`, B1, B2a verified trusted-pair records, B2b1 current credentials and invalidated-epoch events, and B6a credential-authorization projection hook plus admission/ACK contract. B3 consumes published current-credential/revocation status without mutation. B4b1/B5b1 consume these downstream invalidation rules. B6c/B6d consume B2b2 events and separately request matching B6b1 lane closure for endpoint lifecycle; credential safety does not wait for that closure because B6a already rejects through its credential projection. B2b2 has no B6b1 dependency.

## Acceptance criteria
- [ ] Revocation atomically invalidates credentials/capabilities, increments generation, publishes `current_credential=false`, never auto re-enrolls, and does not directly mutate B3.
- [ ] Rotation invalidated-epoch events follow the same downstream rules as revocation.
- [ ] An admission race has only accepted-before-invalidation or rejected-after-invalidation outcomes, linearized through B6a's credential-authorization projection without lane mutation or a B6b1 call.
- [ ] Invalidated `queued` and pre-call `dispatching` entries terminalize as `revoked_before_delivery`, release outstanding capacity exactly once, create no turn, and emit no new wire ACK; invalidated enqueued or running entries retain capacity until exact correlated settlement.
- [ ] An `enqueued` entry is cancellation-pending because Pi owns its returned `sendUserMessage(...,{deliverAs:'followUp'})` entry and exposes no selective dequeue; exact correlated start rechecks generation, activates deny-all, requests one peer-only abort, permits no tool execution, and terminalizes as `revoked_during_turn`, including when pending entry settlement occurs without a start.
- [ ] A running invalidated-epoch turn receives one abort request and terminalizes as `revoked_during_turn`; every peer-tool authorization rechecks generation and denies; the existing ACK remains `accepted`.
- [ ] CAS, retries, and duplicate invalidation are deterministic and idempotent.
- [ ] Credential/private material and internal dispositions are redacted from every named surface.
- [ ] No storage, transport, wire-ACK redesign, task authority, durable mailbox, trust mutation, or B3 mutation is introduced.

## Verification
Focused revocation/rotation CAS and duplicate-event tests, B6a credential-projection admission-linearization races, B6a queued/pre-call-dispatching no-turn/no-new-ACK and exact capacity-release tests, enqueued cancellation-pending/no-selective-dequeue and retained-capacity tests, exact correlated start deny-all and peer-only abort tests, pending-settlement terminalization tests, running-turn one-abort/current-generation-recheck/terminal-CAS tests, human/unrelated and text/no-pending no-abort fixtures, B6b1-independent credential-projection tests, B6a ACK-authority regressions, B3 projection-only tests, and exhaustive redaction fixture/snapshot tests; affected package tests.

## Rollback
Keep credentials/capabilities invalidated and remove only this downstream consumer. No delivery retry, trust mutation, mailbox, task authority, or automatic re-enrollment fallback is introduced.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
