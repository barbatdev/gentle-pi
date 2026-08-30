# A2: Agent definition resolution and validation — draft / REVISE

## Outcome and boundary

This **proposal-only** contract defines a default-off managed-definition resolver with deterministic validation, collision-proof tuple identity, external authorities, and a strict internal/public result boundary before task creation. It is not production code, a delivered interface, product validation, approval, or publication-ready evidence. Unmanaged loading remains unchanged.

At readback, parent #419 is OPEN with `status:needs-review`. Any A2 publication must retain `status:needs-review`, link formally to #419, and receive independent review before implementation. Parent approval does not approve A2. The pre-publication A+D/test-inventory gate remains required: measure A+D and enumerate focused/affected tests in the active register; if over 400 A+D or 60 minutes, stop, split, regenerate evidence, and obtain fresh authorization.

## Evidence classification

| Class | Facts used here |
|---|---|
| Verified current implementation | The observed external subagent runtime accepts optional string/string-array agent input and resolves a name-keyed definition map. Discovery reports `project`, `user`, or `builtin` without `owner` or `normalizedName`; package-name concatenation is lossy and normalized collisions are last-write-wins. It has no structured identity, discovery provenance, override declaration, or public/internal result contract. Gentle Pi intercepts `subagent_run` only for edit-surface and review context; it does not parse, resolve, or rewrite selectors. |
| Proposed policy | This contract and S01–S29 are a candidate policy only. |
| Observed external authority/state | #62, #327, #354, #379, #381, #382, and #419 are open. #379 is an approved containment gate with #387 open/unmerged and #380 closed/unmerged, not a delivered A2 interface. #354 is delivery/install acceptance alignment after technical closure, not an A2 technical dependency or interface supplier. #327/#381/#382 are open authority or defect context, not delivered interfaces. |
| Unresolved feasibility | G01–G08 remain open in `evidence/A2-validation/feasibility-gaps.md`; G07 has a selected bounded policy but executable boundary, operational, metric, and rollback proof remains pending. |

## Proposed contract

### Identity and selectors

A candidate identity is exactly `{ source, owner, normalizedName }`.

- `source` is exactly `project`, `global`, `package`, or `builtin`; `normalizedName` is non-empty `trim + lowercase(name)`.
- `owner` is exactly `null` for project/global and a non-empty string for package/builtin.
- Equality, exact lookup, override targets, and authority matching compare all three members structurally. Delimiter concatenation is never equality. The proposal model may serialize tuple arrays only as an internal collision-proof map/sort key.
- A string is an unqualified alias. A structured selector is exact and alias overrides never redirect it. D-018 assigns singular selector transport to the external runtime; Gentle Pi consumes an owner-delivered selector only through its managed adapter. Legacy strings remain unmanaged.

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
2. candidate/resource accounting before further resolution: after passive structural parsing and tuple normalization, count at most 16 normalized candidates for each source kind (`project`, `global`, `package`, `builtin`) and at most 64 total per managed resolution; malformed ingress counts as one rejected ingress item but never becomes a candidate, and exact duplicate structural tuples count once; at 17 for a source or 65 total, fail closed before definition validation or external adapter iteration with `candidate-limit-exceeded`;
3. validate every candidate, including discovery authority; aggregate independent of input order and sort privately by canonical tuple then stable reason → `authority-unavailable` before `invalid-definition`;
4. exact duplicate tuple → `identity-conflict`;
5. exact selector absent → `selector-not-found`;
6. alias absent → `alias-not-found`;
7. non-empty malformed, stale, unauthorized, incomplete, or conflicting override → `override-conflict`;
8. unresolved multi-candidate alias → `alias-ambiguous`.

A stale declaration blocks even a unique alias. There is no source/load-order precedence or managed fallback to legacy last-write-wins.

### G07 selected candidate/resource policy — executable proof pending

The selected normative policy is fixed: a managed resolution invocation permits at most **16 normalized candidates per source kind** (`project`, `global`, `package`, `builtin`) and at most **64 normalized candidates total**. Count after passive structural parsing and structural tuple normalization, before definition validation or external adapter iteration. A malformed ingress item is charged once as rejected ingress but is never a candidate. Exact duplicate structural tuples count once for candidate limits; identity-conflict behavior remains separate. At the 17th normalized candidate for any source kind or the 65th normalized candidate total, reject before further resolution with public code `candidate-limit-exceeded`.

Public metrics may expose only total count, configured total limit, triggering source category for a per-source breach, configured per-source limit, and outcome. They must not expose names, owners, paths, or contenders. There is no dynamic configuration, deployment override, or unbounded fallback. Until implementation exists, managed resolution fails closed/unavailable rather than using unlimited legacy behavior. Rollback may move only to a previously approved bounded policy. This is a selected policy, not executable evidence: boundary tests, pre-adapter stop proof, safe-metric evidence, operational evidence, and rollback proof remain pending; G07 is not production-closed.

### Definition, capability, and model/effort boundaries

Every definition needs a non-empty name, non-empty description, and `tools` array. Omitted tools is ordinary `invalid-definition`; `tools: []` is valid and needs no tool authority. Every non-empty tool list needs external acceptance of every tool or fails `authority-unavailable`.

A2 may pass fixture-shaped model/effort input to an explicit external test double. It does not call that grammar production-valid. Semantic acceptance needs authority supplied by #381/#382; missing or rejected authority fails `authority-unavailable`.

### Strict internal/public API separation

The private lexical core is never mixed into a public result. The model uses two separate entry points:

1. `resolveInternal(input, internalReadAuthority, context)` returns the full validated value and private diagnostics only when an independently authored, literal, context-bound read authority authorizes that exact context. Missing, rejected, or mismatched access returns only a denied result; it exposes no value, definition, internal failures, tuple key, path, identity, or contenders.
2. `resolvePublic(input)` invokes the private core but returns only a closed safe schema and never returns or spreads the core result.

Public success is exactly `{ok:true,status:"resolved"}`. Public failure is exactly `{ok:false,status:"failed",code}`; only aggregate candidate-validation codes may add the fixed bounded `counts` object `{authority,invalidDefinition}`. It never forwards summary, arbitrary count keys, reasons, sort keys, identities, values, definitions, paths, or contenders. Unknown/non-public core codes map to fixed `resolution-failed`.

S16 proves authorized internal inspection, denied internal access for both success and aggregate failure, exact public success keys, bounded aggregate failure keys/counts, ignored injected details, and no private leak. S23 proves reversed input produces identical public aggregate output and proves private deterministic diagnostic ordering only through authorized internal access.

### D-018 external selector boundary

G02 is `BLOCKED_EXTERNAL`. The external runtime owns the backward-compatible singular transport ABI, expected as `agent?: string | AgentSelector`; Gentle Pi owns managed-adapter consumption only. Exact identity remains `{source, owner?, normalizedName}` and has no name-only or last-write-wins fallback. Exact selectors cannot be redirected by alias or model overrides. External-owner acceptance and versioned delivery are required before G02 can close. Plural `agents` structured fan-out is not decided here and must fail closed for managed exact use until the external owner confirms its contract. H1 remains the implementation gate; this boundary authorizes no implementation.

## Compatibility and non-goals

Managed execution is default-off; unmanaged execution keeps current behavior. This proposal does not implement loaders, task launch, scheduling, peer identity, tool broadening, discovery adapters, model catalogs, capability authority, resource limits, diagnostic storage, or public interfaces. It does not claim delivery for #327, #381, or #382, or closure of any external issue.

## Dependency truth

The durable technical dependency list is `issue:379`, `issue:327`, `issue:381`, `issue:382`, and `A1`. #379 remains a formal implementation-start containment gate before implementation. #354 is not an A2 technical dependency, implementation prerequisite, or interface supplier; it remains delivery/install acceptance alignment after technical closure. G02 is additionally `BLOCKED_EXTERNAL` pending external-owner acceptance and versioned singular ABI delivery; it adds no manifest dependency edge. #327/#381/#382 remain open external context; #62 remains a downstream packed-install acceptance gate; A3 depends on a delivered A2 result.

## Acceptance criteria and evidence

| Criterion | Evidence scenarios |
|---|---|
| Tuple identity, normalization, exact selectors | S01–S07, S29; external-owner singular transport and managed-adapter integration evidence remain required for G02 |
| Independent discovery provenance and override authority | S04–S05, S11–S15 |
| No precedence; alias and override safety | S08–S15, S21, S27 |
| Deterministic private diagnostics and closed public schemas | S06, S16, S23 |
| Model/effort authority boundary | S17–S18 |
| Candidate limit behavior | 16/17 per source kind; 64/65 total; exact-duplicate tuple counting; malformed-ingress accounting; rejection before definition validation or adapter iteration; and safe public metric fields. Executable G07 proof remains pending. |
| Default-off/no managed fallback | S20–S21 |
| Metadata and tool authority | S22–S26, S28 |
| Proposal self-consistency only | `reference-model.mjs` executes S01–S29; traceability and gap register remain required |

## Verification and rollback

Run `node evidence/A2-validation/reference-model.mjs` against frozen candidate bytes and confirm `29/29 proposal self-consistency assertions passed`. Review S01–S29, traceability, and G01–G08. This is only a proposal-model check. Production verification needs focused resolver, discovery/provenance, selector transport, override authority, capability, resource-limit, privacy-projection, and affected package tests once authoritative interfaces exist. G07 specifically needs executable 16/17-per-source and 64/65-total boundary tests, duplicate-tuple and malformed-ingress accounting tests, a pre-adapter rejection test, safe-metric-field evidence, operational evidence, and rollback proof; the existing 29/29 proposal result does not prove the selected numeric policy.

A future rollback removes only the managed path and restores unmanaged loading without changing task or peer authority. Any G07 policy rollback is only to a previously approved bounded policy; until executable implementation and rollback proof exist, managed resolution is fail-closed/unavailable rather than unlimited legacy behavior. No external issue disposition follows.

## Publication status

**draft / REVISE.** Do not publish. This candidate awaits G01–G08 closure, authoritative interfaces, implementation evidence, the A+D/test-inventory gate, and separate authorization.
