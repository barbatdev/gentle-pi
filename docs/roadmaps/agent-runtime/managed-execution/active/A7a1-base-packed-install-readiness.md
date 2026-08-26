# test(agents): prove base packed-install readiness

## Parent and status gate

Parent #419 requires `status:needs-review` for publication. Remote `status:approved` is stale. Before any future authorized mutation, restore `status:needs-review` and read it back. This planning draft authorizes neither publication nor implementation.

## Outcome

Prove the base Gentle-managed packed-install readiness and compatibility behavior while released routing remains unchanged.

## Included scope

- A clean packed-install fixture for the delivered Gentle-owned managed path.
- Candidate-path selection and invocation observation with retained coupling permitted but not inferred absent.
- #62 strict allowlist and YAML-list compatibility evidence.
- Delivered A2 precedence, normalized-collision, builtin-discovery, and diagnostic behavior.

## Non-goals

No production routing change, coupling removal, release/config rollback, package downgrade, #381 or #382 adapter integration, dependency-absence proof, or closure of #62 or #327.

## Normative contract

Proof failure leaves released routing unchanged. A retained coupling may remain installed and unselected; that observation is not an absence claim. A7a1 consumes delivered A2 behavior and preserves #327 until evidence supports a maintainer disposition. It neither substitutes nor reimplements #381 or #382 interfaces.

## Dependencies

#379 merged; delivered A1 through A6a; delivered A2 behavior; and the #62/YAML proof environment. #381 and #382 adapter proofs are deferred, unmaterialized, outside this publication transaction, have no issue IDs or drafts, and cannot be claimed delivered until concrete public interfaces exist. A7b1 requires accepted A7a1 evidence.

## Acceptance criteria

- [ ] A clean packed install exercises the Gentle-managed path without changing released routing.
- [ ] Candidate-path observation does not make a coupling-absence claim.
- [ ] Packed checks prove #62 allowlist and YAML-list behavior.
- [ ] Packed checks prove delivered A2 precedence, collision, builtin-discovery, and diagnostic behavior.
- [ ] No #381 or #382 adapter proof or interface claim is included.

## Verification

Run the focused packed readiness test, candidate-path observation, strict-allowlist/YAML fixtures, A2 behavior fixtures, and affected package tests. Commands are planned post-implementation and have not run.

## Rollback

Discard the failed release candidate and retain the current release/configuration. No routing change occurs.

## Forecast split gate

Before review or delivery, record actual `git diff --numstat` additions and deletions and focused plus regression test evidence. Split immediately if actual A+D exceeds 400 or elapsed implementation plus review exceeds 60 minutes.
