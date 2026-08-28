# A2: Agent definition resolution and validation — draft / REVISE

## Outcome and boundary

This **proposal-only** contract defines a default-off managed-definition resolver with deterministic validation, collision-proof tuple identity, external authorities, and a strict internal/public result boundary before task creation. It is not production code, a delivered interface, product validation, approval, or publication-ready evidence. Unmanaged loading remains unchanged.

At readback, parent #419 is OPEN with `status:needs-review`. Any A2 publication must retain `status:needs-review`, link formally to #419, and receive independent review before implementation. Parent approval does not approve A2. The pre-publication A+D/test-inventory gate remains required: measure A+D and enumerate focused/affected tests in the active register; if over 400 A+D or 60 minutes, stop, split, regenerate evidence, and obtain fresh authorization.

## Evidence classification

| Class | Facts used here |
|---|---|
| Verified current implementation | `pi-subagents-j0k3r@1.5.2` uses trim+lowercase names and global agents → global subagents → project agents → project subagents with normalized last-write-wins. It has no structured identity, discovery provenance, override declaration, or public/internal result contract. `package:` frontmatter is wrapper-only model-profile discovery, not execution-loader provenance. |
| Proposed policy | This contract and S01–S29 are a candidate policy only. |
| Observed external authority/state | #62, #327, #354, #379, #381, #382, and #419 are open. #379 is an approved containment gate with #387 open/unmerged and #380 closed/unmerged, not a delivered A2 interface. #354 is ownership/install/drift alignment without a concrete A2 schema/interface. #327/#381/#382 are open authority or defect context, not delivered interfaces. |
| Unresolved feasibility | G01–G08 remain open in `evidence/A2-validation/feasibility-gaps.md`. |

## Proposed contract

### Identity and selectors

A candidate identity is exactly `{ source, owner, normalizedName }`.

- `source` is exactly `project`, `global`, `package`, or `builtin`; `normalizedName` is non-empty `trim + lowercase(name)`.
- `owner` is exactly `null` for project/global and a non-empty string for package/builtin.
- Equality, exact lookup, override targets, and authority matching compare all three members structurally. Delimiter concatenation is never equality. The proposal model may serialize tuple arrays only as an internal collision-proof map/sort key.
- A string is an unqualified alias. A structured selector is exact and alias overrides never redirect it.

### Independently authored discovery/provenance authority

Candidate source and provenance are discovery-owned for **every** source kind. Frontmatter cannot self-select project, global, package, or builtin authority. Resolver input receives an explicit external discovery authority that confirms an exact structural identity tuple.

- An authority allowlist is independently authored literal normalized tuples, never calculated from candidate definitions and never populated while creating candidates.
- Missing authority or a source/owner/name tuple not in that literal authority fails closed as aggregate `authority-unavailable`.
- Package/builtin adapter gaps remain G03/G04. Generic source-provenance admission is G01; this proposal does not claim any implementation.
- S02/S03 test only pure identity shape. Every resolver-success fixture supplies explicit independent discovery authority. S04/S05 prove the literal tuple succeeds and source, owner, or name changes cannot inherit trust.

### Independently authored override-declaration authority

Package and builtin definitions cannot declare overrides. A project/global definition with a non-empty declaration needs independent override authority; source eligibility alone is insufficient.

Each literal override authorization binds all of: the exact declarer tuple, a resolution context identifier/alias, and the exact structural set of parsed target tuples. `mayDeclareOverrides(declarer, context, parsedTargets)` receives each binding. A changed declarer, target set, or context fails `override-conflict`; it cannot inherit authority. Override grammar is a YAML/list of structured `{ source, owner, name }` selectors only. Overrides affect aliases only and never delete, mutate, or redirect exact candidates.

### Deterministic validation and resolution catalog

The normative order is:

1. invalid selector → `invalid-selector`;
2. explicit candidate/resource limit before iteration → `candidate-limit-exceeded`;
3. validate every candidate, including discovery authority; aggregate independent of input order and sort privately by canonical tuple then stable reason → `authority-unavailable` before `invalid-definition`;
4. exact duplicate tuple → `identity-conflict`;
5. exact selector absent → `selector-not-found`;
6. alias absent → `alias-not-found`;
7. non-empty malformed, stale, unauthorized, incomplete, or conflicting override → `override-conflict`;
8. unresolved multi-candidate alias → `alias-ambiguous`.

A stale declaration blocks even a unique alias. There is no source/load-order precedence or managed fallback to legacy last-write-wins.

### Definition, capability, and model/effort boundaries

Every definition needs a non-empty name, non-empty description, and `tools` array. Omitted tools is ordinary `invalid-definition`; `tools: []` is valid and needs no tool authority. Every non-empty tool list needs external acceptance of every tool or fails `authority-unavailable`.

A2 may pass fixture-shaped model/effort input to an explicit external test double. It does not call that grammar production-valid. Semantic acceptance needs authority supplied by #381/#382; missing or rejected authority fails `authority-unavailable`.

### Strict internal/public API separation

The private lexical core is never mixed into a public result. The model uses two separate entry points:

1. `resolveInternal(input, internalReadAuthority, context)` returns the full validated value and private diagnostics only when an independently authored, literal, context-bound read authority authorizes that exact context. Missing, rejected, or mismatched access returns only a denied result; it exposes no value, definition, internal failures, tuple key, path, identity, or contenders.
2. `resolvePublic(input)` invokes the private core but returns only a closed safe schema and never returns or spreads the core result.

Public success is exactly `{ok:true,status:"resolved"}`. Public failure is exactly `{ok:false,status:"failed",code}`; only aggregate candidate-validation codes may add the fixed bounded `counts` object `{authority,invalidDefinition}`. It never forwards summary, arbitrary count keys, reasons, sort keys, identities, values, definitions, paths, or contenders. Unknown/non-public core codes map to fixed `resolution-failed`.

S16 proves authorized internal inspection, denied internal access for both success and aggregate failure, exact public success keys, bounded aggregate failure keys/counts, ignored injected details, and no private leak. S23 proves reversed input produces identical public aggregate output and proves private deterministic diagnostic ordering only through authorized internal access.

## Compatibility and non-goals

Managed execution is default-off; unmanaged execution keeps current behavior. This proposal does not implement loaders, task launch, scheduling, peer identity, tool broadening, discovery adapters, model catalogs, capability authority, resource limits, diagnostic storage, or public interfaces. It does not claim delivery for #327, #381, or #382, or closure of any external issue.

## Dependency truth

The durable dependency list remains `issue:379`, `issue:354`, `issue:327`, `issue:381`, `issue:382`, and `A1`. #379 remains a formal gate before implementation. Evidence supports only a separate reclassification question: #379/#354 appear conditional alignment, not demonstrated A2 interfaces. No evidence here waives, removes, or reinterprets either dependency. #327/#381/#382 remain open external context; #62 remains a downstream packed-install acceptance gate; A3 depends on a delivered A2 result.

## Acceptance criteria and evidence

| Criterion | Evidence scenarios |
|---|---|
| Tuple identity, normalization, exact selectors | S01–S07, S29 |
| Independent discovery provenance and override authority | S04–S05, S11–S15 |
| No precedence; alias and override safety | S08–S15, S21, S27 |
| Deterministic private diagnostics and closed public schemas | S06, S16, S23 |
| Model/effort authority boundary | S17–S18 |
| Candidate limit behavior | S19; policy remains open in G07 |
| Default-off/no managed fallback | S20–S21 |
| Metadata and tool authority | S22–S26, S28 |
| Proposal self-consistency only | `reference-model.mjs` executes S01–S29; traceability and gap register remain required |

## Verification and rollback

Run `node evidence/A2-validation/reference-model.mjs` against frozen candidate bytes and confirm `29/29 proposal self-consistency assertions passed`. Review S01–S29, traceability, and G01–G08. This is only a proposal-model check. Production verification needs focused resolver, discovery/provenance, selector transport, override authority, capability, resource-limit, privacy-projection, and affected package tests once authoritative interfaces exist.

A future rollback removes only the managed path and restores unmanaged loading without changing task or peer authority. No external issue disposition follows.

## Publication status

**draft / REVISE.** Do not publish. This candidate awaits G01–G08 closure, authoritative interfaces, implementation evidence, the A+D/test-inventory gate, and separate authorization.
