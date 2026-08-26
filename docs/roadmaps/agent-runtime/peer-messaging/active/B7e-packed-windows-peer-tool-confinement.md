# test(peers): prove packed Windows peer-tool confinement

## Parent and status gate

Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. It must be created, formally linked, reviewed, and accepted before peer-parent re-review.

## Outcome

Prove peer-tool confinement in a clean packed Windows install using Pi 0.84.3 and the completed Windows named-pipe bounded-delivery lane.

## Evidence and scope

This is the Windows counterpart to B7d. It validates B7 confinement with B6d and B5b2 while preserving the version-one single-active-OS-user workstation scope.

## Included scope

- Install and exercise a clean packed tarball with Pi 0.84.3 and the B6d lane.
- Prove the B7d positive and negative confinement cases on Windows.
- Add Windows-specific drive, UNC, ADS, reparse, and real named-pipe-path rejection coverage.

## Non-goals

No source checkout, source import, development fallback, POSIX proof, shared or multi-user support, DACL guarantee or detection claim, production publication, or generic-tool exception.

## Normative contract

The proof uses only a clean packed tarball install with Pi 0.84.3 and the B6d registered lane. It repeats B7d's redacted-list, bounded-root-inspection, single-lane-send, interactive-verbatim-non-local-routing, generic-tool-blocking, protocol-spoofing, no-fallback, text-badge, extension-recursion, slash/template-literal, and no-local-submission proof.

It additionally rejects drive, UNC, ADS, reparse, real named-pipe paths, B7a's explicit denied path segments/patterns and private-key extensions. It does not claim content-based arbitrary-secret detection. Windows v1 is limited to a single-active-OS-user workstation. Shared and multi-user hosts are unsupported. This proof makes no DACL guarantee or DACL detection claim.

## Dependencies

B7a, B7b, B7c, B6d, and B5b2.

## Acceptance criteria

- [ ] A clean packed tarball install with Pi 0.84.3 proves the full B7d confinement matrix through B6d without source or development fallback.
- [ ] Drive, UNC, ADS, reparse, real named-pipe paths, B7a's explicit denied path segments/patterns and private-key extensions are rejected in the packed Windows environment; the proof makes no content-based arbitrary-secret detection claim.
- [ ] The correlated peer principal receives only the three fingerprint-pinned wrappers and generic tools are blocked.
- [ ] Unknown, unaddressable, and no-lane cases have no fallback; protocol/source/lane spoofing and text-badge spoofing produce no verified peer action.
- [ ] Extension input cannot recurse, slash/template content remains plain, and interactive routing is verbatim and non-local.
- [ ] The evidence states the single-active-OS-user workstation scope and makes no shared/multi-user, DACL-guarantee, or DACL-detection claim.

## Verification

Run the clean packed Windows fixture once with captured version and workstation-scope evidence, then run every shared and Windows-specific positive and negative case. Preserve bounded outputs, exact denials, B6d lane identity, and affected package-test results without importing from a checkout.

## Rollback

No production change. Discard failed proof artifacts and retain the existing package path.

## Pre-publication measured A+D/test-inventory gate

Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
