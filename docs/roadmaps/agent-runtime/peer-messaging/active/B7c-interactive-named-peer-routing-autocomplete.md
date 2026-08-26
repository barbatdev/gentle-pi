# feat(peers): add interactive named-peer routing and autocomplete

## Parent and status gate

Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. It must be created, formally linked, reviewed, and accepted before peer-parent re-review.

## Outcome

Route a precise interactive `@canonical-name` message to one named peer and offer collision-safe peer autocomplete without changing other Pi input behavior.

## Evidence and scope

B1 supplies normalization and B3 supplies named-peer directory data. B7b supplies bounded send behavior. This child handles only interactive routing and wraps the existing autocomplete provider.

## Included scope

- Recognize a single canonical `@name` form in interactive input.
- Resolve exactly one B1-normalized B3 peer and submit the remaining bytes through the B7b send service.
- Add peer entries ahead of delegated autocomplete entries when the token is eligible.

## Non-goals

No `rpc` or `extension` routing, local-agent submission, slash-command handling, template expansion, file-attachment rewriting, generic autocomplete replacement, trust mutation, or claim that #327 owns autocomplete.

## Normative contract

The input handler routes only when `event.source === 'interactive'`; `rpc` and `extension` always return `continue`. It recognizes only `@canonical-name` followed by one or more ASCII spaces or tabs and a non-empty body. It consumes the maximal delimiter run and sends the exact remaining body bytes unchanged through B7b. It does not trim, transform, expand templates, or submit the body to the local agent.

For exactly one B1-normalized B3 peer, it requests the bounded send, handles every B7b ACK, unavailable, and error outcome with a deterministic status, and returns `{action:'handled'}`. `accepted` means B6a admission only, never receiver completion. No valid unique-target outcome locally submits the body. Unknown, ambiguous, and delimiter-with-empty-body inputs produce a deterministic notification, return handled, and perform no delivery. A malformed `@token` without a delimiter returns `continue` unchanged to preserve Pi file attachment behavior.

Autocomplete wraps and delegates the current provider. For a token-bound `@prefix`, it includes only B3 peers whose normalized canonical names are unambiguous. Peer items precede the delegated current items. Selecting a peer applies exactly `@canonical-name ` with one trailing space. No peer match delegates unchanged. Collisions are omitted and diagnosed, never rendered as indistinguishable choices.

## Dependencies

B1, B3, and B7b.

## Acceptance criteria

- [ ] Only interactive input is considered; RPC and extension input continue unchanged and never recurse into peer routing.
- [ ] Valid unique routing consumes the maximal ASCII delimiter run, sends exact non-empty body bytes through B7b, handles every ACK, unavailable, and error outcome with deterministic status, and never locally submits them.
- [ ] `accepted` is admission only, never receiver completion; unknown, ambiguous, and empty-body forms are deterministically notified, handled, and never delivered.
- [ ] Delimiter-free malformed `@token` input continues byte-for-byte unchanged for Pi attachment behavior.
- [ ] Autocomplete delegates the current provider, puts unambiguous peer items first, applies the exact selected text, and omits and diagnoses collisions.

## Verification

Focused interactive-source, RPC, extension, unique/unknown/ambiguous/empty/malformed input, delimiter-run, verbatim-body, B7b ACK/unavailable/error status handling, accepted-admission semantics, no-local-submission, slash/template-literal, attachment-preservation, autocomplete-order, selected-text, no-match delegation, and collision-diagnostic tests. Run affected package tests.

## Rollback

Remove only peer input interception and the autocomplete wrapper. Preserve the delegated provider and do not alter noninteractive input handling.

## Pre-publication measured A+D/test-inventory gate

Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
