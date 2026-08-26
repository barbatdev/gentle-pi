# feat(agents): resolve and validate owned agent definitions

## Parent and status gate

Parent #419 requires `status:needs-review` for publication. Fresh discovery found remote status drift from that required state. Before any publication, restore `status:needs-review` and read it back; stop if unconfirmed. This draft does not inherit remote status and is not approved or implementation-ready. All child issues must be created and formally linked before #419 is re-reviewed. #379 is OPEN with `status:approved`, not delivered or merged; it must merge before implementation.

## Outcome

Provide deterministic, validated resolution of agent definitions for the future Gentle-owned runtime while consuming #327's open builtin-discovery defect as evidence, not as a delivered prerequisite.

## Evidence and scope

#327 is currently OPEN and reports broken builtin agent discovery: `builtinAgentDirs` probes `agents/` directories the subagent packages do not ship. #354 is open and approved because non-SDD and SDD assets are co-installed and refreshed by an SDD command. #62 remains open pending packed-install proof that strict tool allowlists, including YAML-list compatibility, are effective.

## Included scope

- Define package, global, project, and builtin definition sources; deterministic precedence; normalized-name collisions; builtin discovery; and actionable diagnostics.
- Validate required metadata, model and effort declarations, and strict tool declarations before task creation.
- Consume only concrete shared model-routing interfaces delivered by #381 and #382 at implementation time.
- Consume #354 through its explicit ownership classification.

## Non-goals

No task launch, scheduling, peer identity, tool broadening, asset-installer redesign beyond #354, or resolution of #62. No claim that #327, #381, or #382 is currently delivered.

## Normative contract

Resolution returns one validated definition or a deterministic diagnostic; ambiguity and malformed declarations fail before task creation. Source precedence, builtin discovery, and normalized collision handling are deterministic and actionable. #327 is an open defect consumed within this work; it is not a delivered prerequisite. Close or supersede #327 only after A2's precedence, normalized collisions, builtin discovery, and diagnostics ship with evidence.

Tool declarations are deny-by-default and never silently broaden. Directory membership, source presence, or model-routing data does not grant execution or messaging permission. Model-routing integration consumes only concrete shared interfaces delivered by #381 and #382 at implementation time and does not duplicate their authority.

## Dependencies

- #379 is OPEN with `status:approved` and must merge before implementation; A1 must be completed.
- #354 is an explicit consumed prerequisite.
- #327 remains OPEN and is handled by A2's delivered resolver behavior, not as a prerequisite.
- #381 and #382 are OPEN incomplete foundations: consume only concrete interfaces delivered at implementation time.
- A3 depends on this result. #62 remains an open downstream acceptance gate.

## Acceptance criteria

- [ ] Source ownership, deterministic precedence, and builtin discovery are explicit and testable.
- [ ] Normalized collisions report all contenders and apply deterministic handling without load-order selection.
- [ ] Validation failures provide actionable diagnostics and prevent task creation.
- [ ] #327 remains OPEN until precedence, normalized-collision, builtin-discovery, and diagnostics behavior ships with evidence supporting its disposition.
- [ ] Invalid model, effort, or tool declarations fail before task creation.
- [ ] Validated definitions preserve strict allowlists without silent broadening.
- [ ] Every #381/#382 use is tied only to a concrete interface delivered at implementation time, without claiming either is currently delivered or duplicating authority.
- [ ] The contract names the #62 packed-install proof still required before closure claims.

## Verification

Run focused resolver, builtin-discovery, validation, and collision fixtures plus affected package tests. Run packed-install black-box allowlist checks only when executable definition loading is added. Record evidence before any #327 close or supersede decision.

## Rollback

Revert the owned resolver and restore the prior definition path without changing task or peer authorities. Do not disposition #327 without the required evidence.

## Pre-publication measured A+D/test-inventory gate

Before the first publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the complete active register. If it exceeds 400 A+D or 60 minutes, stop before publication; split locally, regenerate the register, counts, topology, parent and #376, update tombstones and hash-bound diffs, rerun exact-title searches and full human validation, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
