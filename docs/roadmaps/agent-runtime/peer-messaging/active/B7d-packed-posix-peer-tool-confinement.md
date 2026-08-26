# test(peers): prove packed POSIX peer-tool confinement

## Parent and status gate

Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. It must be created, formally linked, reviewed, and accepted before peer-parent re-review.

## Outcome

Prove peer-tool confinement in a clean packed POSIX install using Pi 0.84.3 and the completed POSIX bounded-delivery lane.

## Evidence and scope

Source-tree tests do not prove packed behavior. This child validates the B7 wrappers, B6c lane registration, and B6b1 peer-principal enforcement in an install with no source checkout, import, or development fallback.

## Included scope

- Install and exercise a clean packed tarball with Pi 0.84.3.
- Prove redacted directory listing, bounded root inspection, one B6c registered-lane send, and interactive verbatim non-local `@` routing.
- Prove the peer-principal generic-tool and protocol-spoof denial matrix.

## Non-goals

No source checkout, source import, development fallback, Windows proof, production publication, generic-tool exception, new transport behavior, or receiver-completion claim from a send ACK.

## Normative contract

The proof uses only a clean packed tarball install with Pi 0.84.3. Positive evidence covers a redacted list, bounded root inspection, exactly one B6c registered-lane send, and interactive verbatim non-local `@` routing.

Negative evidence proves every generic tool is blocked for a correlated peer turn; traversal, absolute, symlink, B7a's explicit denied path segments/patterns and private-key extensions are rejected; it does not claim content-based arbitrary-secret detection. Source, lane, and protocol metadata cannot be spoofed; unknown, unaddressable, and no-lane targets have no fallback; a text badge spoof produces no verified projection; extension input cannot recurse; slash and template content remain plain; and no routed message is locally submitted.

## Dependencies

B7a, B7b, B7c, B6c, and B4b2.

## Acceptance criteria

- [ ] A clean packed tarball install with Pi 0.84.3 proves the positive behavior without any source or development fallback.
- [ ] The correlated peer principal receives only the three fingerprint-pinned wrappers and every generic tool is blocked.
- [ ] Root confinement rejects traversal, absolute, symlink, B7a's explicit denied path segments/patterns and private-key extensions in the packed environment; it does not claim content-based arbitrary-secret detection.
- [ ] Send cannot spoof source, lane, trace, hop, or protocol metadata and selects the single B6c lane only.
- [ ] Unknown, unaddressable, and no-lane cases fail without fallback; text-badge and extension-input spoofing create no verified peer action.
- [ ] Slash/template text remains plain and interactive routing is verbatim and non-local.

## Verification

Run the clean packed POSIX fixture once with captured environment and version evidence, then run the positive and negative cases named above. Record bounded outputs, exact denial behavior, lane identity, and affected package-test results without importing from a checkout.

## Rollback

No production change. Discard failed proof artifacts and retain the existing package path.

## Pre-publication measured A+D/test-inventory gate

Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
