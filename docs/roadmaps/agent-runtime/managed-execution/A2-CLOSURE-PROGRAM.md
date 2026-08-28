# A2 G01–G08 Closure Program — Corrective Completion Draft

> **Status:** planning evidence only. This draft does not authorize implementation, publication, ledger mutation, issue mutation, or readiness.
>
> **Observed:** 2026-08-28T19:52:59Z. Current upstream `main` was observed as `a3d87c196268774c8989169e45634e9b46066881`; the exact ledger branch `refs/heads/docs/agent-runtime-roadmaps` was verified by direct remote and GitHub API at `9c7705263bb076a5548583078f4c2d23cb92b575`. The fork default `main` branch is unrelated to ledger authority.

## Authority pin

Persist or resume this program only when direct remote and GitHub API agree on the exact ledger branch `refs/heads/docs/agent-runtime-roadmaps`. At this readback both resolve to `9c7705263bb076a5548583078f4c2d23cb92b575`. A change to the fork default `main` branch is not ledger drift and does not require re-pinning.

## Outcome and non-negotiable boundary

Close A2's eight production-feasibility gaps without changing default unmanaged execution, without treating proposal-model assertions as runtime proof, and without converting external issue text into a delivered interface.

| Boundary | Required interpretation |
|---|---|
| A2 ledger state | A2 remains `draft / REVISE`; G01–G08 remain open. The reference model is proposal self-consistency only. [L-A2] [L-GAPS] [L-TRACE] |
| Parent | #419 is open with `status:needs-review`; parent approval does not authorize a child implementation or publication. [I-419] |
| Managed mode | It remains default-off. Disabled mode preserves current delegated-work behavior; no managed/unmanaged fallback or dual authority is allowed. [I-419] [I-447] |
| Identity and privacy | Admission must use the structural `{source, owner, normalizedName}` tuple; candidate frontmatter cannot grant provenance. Internal reads need explicit context authority and public output is a closed safe schema. [L-A2] [L-TRACE] |
| External ownership | `pi-subagents-j0k3r` behavior may be observed, never claimed as Gentle Pi-owned. External/unowned interfaces fail closed until their owner delivers a verifiable contract. |
| Out of scope | Do not inspect or depend on `earendil-works/pi`. #469 is related authorization-continuity work, not an A2 prerequisite. [I-469] |
| Delivery | No direct upstream mutation. Every future implementation is an approved, reversible, user-owned-fork work unit with tests and review evidence in the same slice. |

## Current authority readback

All required issue bodies, comments, and timelines were read through GraphQL with `first:100`. Each required timeline and comment count was below 100, so this is a complete one-page capture rather than a partial page. Exact-closing-PR searches used `repo:Gentleman-Programming/gentle-pi is:pr "Closes #<issue>"` with `first:100`.

| Authority | Current state and complete mapped evidence | A2 consequence |
|---|---|---|
| #62 | Open, `status:approved`; 3 comments and 12 timeline items. #289 is merged, but its approval explicitly says it addressed only unavailable declared tools. #429 (`slop`) is open/unmerged and is the named YAML parsing regression-test slice. Upstream parsing is reported fixed in the issue comment, but the repository's regression/packed-install delivery is not merged. [I-62] [PR-289] [PR-429] | G06 remains open: parsing compatibility is not a managed non-empty-tool capability authority, and packed-install proof is still unavailable. |
| #327 | Open, `bug`; no comments, 4 timeline items, no closing PR search match. Current source still probes six package `agents/` directories. [I-327] [S-DISCOVERY] | G04 remains open. There is no builtin provider/adapter, delivery PR, or owner-confirmed tuple interface. |
| #354 | Open, `bug` + `status:approved`; no comments, 8 timeline items, and zero closing-PR search matches. Its body owns subsystem asset installation/drift separation, not task-definition resolution or a runtime schema/API. [I-354] | It supplies no A2-consumed interface. It is a ledger-classification and delivery/install-alignment decision, not a technical G01–G08 supplier. |
| #379 | Open, `status:approved`, `type:bug`, `priority:high`; 2 comments and 20 timeline items. PR #380 is closed/unmerged; PR #387 is open/unmerged. Exact closing-PR search returned only #380 and #387: no newer closing delivery exists at this observation. #387 is a negative execution-surface containment guard and explicitly excludes capability registry, ancestry, persistence, recovery, and comprehensive routing diagnostics. [I-379] [PR-380] [PR-387] | Still a formal ledger gate and an implementation-start containment gate, but not an A2 selector/provenance/override/model/tool/projection interface. |
| #381 / #382 | #381 is open, `enhancement` + `status:approved`; #382 is open, `enhancement` only (its approval was removed on design hold). Merged #398 and #408 are partial saved-routing-authority slices. #381/#382 explicitly require the remaining ordered foundation, two unnumbered approved children, #382 completion, and re-freezing before the process contract/executable may begin. [I-381] [I-382] [PR-398] [PR-408] | G05 remains open. Current `main` has local grammar/persistence helpers, not the delivered versioned semantic authority A2 needs. |
| #419 | Open, `status:needs-review`, `type:feature`; 3 comments and 28 timeline items. It names #447, #448, and #449 as published slices but says the sequence is architectural layering, not delivery proof. [I-419] | Parent remains an outcome tracker, not a completion or publication authorization. |
| #440 / #441 / #446 | #440 and #446 are open, approved feature issues. PR #441 is open/unmerged. #440/#441 own registry lifecycle, while #446 owns foreground execution classification and excludes result storage. [I-440] [PR-441] [I-446] | Runtime-track dependencies, not A2 G01–G08 authority suppliers. Their open state prevents claiming downstream managed-runtime delivery. |
| #447 / #448 / #449 | #447 is open, `status:needs-review`, `type:feature`, and is the native #419 sub-issue; it is only the default-off selection/compatibility seam and explicitly excludes definition validation. #448 and #449 are open, approved feature issues; their #419 references are textual/cross-reference evidence, not a durable A2/A3 mapping. Neither has a delivery PR in the mapped evidence. [I-447] [I-448] [I-449] [L-MANIFEST] | They do not change A2 gap ordering. #447 is an eventual selection seam; #448/#449 are downstream task-result mechanics and must not be treated as delivered A2 interfaces. |
| #469 | Open, `status:needs-review`, `type:bug`; its only mapped relation is cross-reference from #448/#449. It explicitly says “related, without claiming dependency.” [I-469] | Separate and non-prerequisite. No A2 ordering edge is justified. |

### Current source readback at upstream main

| Cited source path and symbol | Result at `a3d87c196268774c8989169e45634e9b46066881` |
|---|---|
| `extensions/gentle-ai.ts`: `parseAgentName`, `parseAgentNameAsync` | Present at lines 1393–1431. They parse `name` and optional `package` from frontmatter and return one string, not a structural selector. [S-DISCOVERY] |
| `extensions/gentle-ai.ts`: `listAgentsFromDir*`, `listDiscoverableAgents*` | Present at lines 1467–1554. Entries are `{name, source, filePath}`; discovery uses a name-keyed `Map`, so duplicate names resolve last-write-wins. [S-DISCOVERY] |
| `extensions/gentle-ai.ts`: `builtinAgentDirs` | Present at lines 1490–1499 and still probes the six `pi-subagents-j0k3r`/`pi-subagents` `agents/` locations described by #327. [S-DISCOVERY] |
| `lib/model-routing-authority.ts`: `THINKING_LEVELS`, `AgentRoutingEntry`, `AgentModelConfig`, `normalizeModelId`, `normalizeModelConfig` | Present. It provides safe-string grammar and a fixed thinking list keyed by string agent name; it is not proof of the versioned machine-readable semantic authority required by G05. [S-MODEL] |
| `extensions/gentle-ai.ts`: `sanitizeForeignNativeReviewDiagnostics` use | Present at lines 99–129 and 2960–2966. This validates existing review-diagnostic sanitization only; it does not prove a resolver-specific internal-read/public-projection interface. [S-REVIEW-DIAG] |

No current-main path or symbol claim in this draft is unresolved. Claims that lack a delivered interface are marked open/unproven rather than inferred from issue prose.

## Corrected dependency order

The earlier draft's parallelism remains valid only after correcting the external gates and separating the #419 runtime track from A2 validation.

```text
E0: verify upstream main + exact ledger branch and preserve ledger state
  ├─ H1: #379 containment must be delivered (PR #387 merged) before A2 implementation
  ├─ D379/354: maintainer dependency-classification decision
  └─ D1: one G07 product policy

G02 structured selector transport
  ├─ G03 package provenance adapter (external owner, fail closed)
  ├─ G04 builtin provenance adapter / #327 disposition (external owner, fail closed)
  ├─ G05 versioned model/effort authority after #381/#382 foundation re-freeze
  ├─ G06 tool capability authority plus #62 packed-install proof
  └─ G08 internal-read/public-projection contract
                 ↓
              G01 managed resolver integration
                 ↓
     #419 integration only after its own selection/admission/runtime authorities are delivered
                 ↓
          independent A2 terminal review, then separate #419 publication decision
```

**Ordering correction:** #447 is the eventual default-off selection seam, not G02 and not definition validation. #448/#449 are #419 task-result slices, not A2 prerequisites or completion evidence. #354 has no concrete A2 interface; its final placement is the maintainer decision below. #379 remains formal until the ledger is changed, and its unmerged PR #387 makes it a fail-closed implementation-start gate.

## Milestones: 0% to 100%

Percentages represent completed closure outcomes, not effort spent. A milestone advances only after its objective evidence is durable and read back.

| Progress | Completed outcome | Blocking exit |
|---:|---|---|
| **0%** | Schema-v2 ledger, A2 draft/REVISE, public-contract snapshots, proposal evidence, and this closure program are durable; production gaps closed: 0/8. | Persist this plan against the pinned ledger branch. |
| **10%** | #379/#354 dependency classification and one G07 limit policy are explicitly selected and recorded. | Two maintainer decisions; no code starts before G07 is selected. |
| **20%** | #379 containment gate is delivered on upstream main and its applicability to A2 is read back. | PR #387 or a verified successor must merge; no local substitute. |
| **35%** | G02 structured selector transport is delivered with exact tuple integration tests. | Typed end-to-end selector transport. |
| **50%** | G08 authorized internal/public projection contract is delivered with leak and denied-access tests. | Closed public schema and context-bound internal read. |
| **65%** | G03/G04 package and builtin provenance interfaces are owner-delivered or fail closed with objective adapter evidence. | Exact source/owner/name tuple authority; #327 disposition reviewed separately. |
| **80%** | G05/G06 model-effort and tool authorities are delivered with accepted/rejected and packed-install evidence. | Versioned semantic interfaces; no issue prose as authority. |
| **90%** | G01 integrates G02–G08 through split resolver work units; managed behavior remains default-off and unmanaged behavior unchanged. | Focused negative tests and rollback proof for every slice. |
| **95%** | #419 runtime integration and packed/integration verification pass on a pinned upstream-main descendant. | All runtime-track authorities actually delivered. |
| **100%** | Independent terminal review passes and a maintainer separately authorizes A2 publication/update under #419. | Durable runtime evidence, review receipt, and publication readback. |

## G01–G08 closure matrix

| Gap | Owner/repository and prerequisite | Objective exit and rollback | Review band |
|---|---|---|---|
| G02 selector transport | Gentle Pi invocation/runtime owner; after E0, H1, and G07 if enumeration is exposed. | Typed alias-or-exact `{source, owner, normalizedName}` passes unchanged from invocation to resolver; collision and exact-not-found tests pass. Roll back by disabling/removing only the managed route. | `<=200` or split. |
| G03 package provenance | External package/discovery owner plus Gentle Pi adapter boundary; fail closed until a verified owner supplies exact tuples. | Adapter independently attests package owner and tuple; accepted/missing/forged/mutated tests pass. Roll back by rejecting managed package candidates. | `201-400`. |
| G04 builtin provenance | External/builtin provider owner; #327 disposition required. | Provider emits independently confirmed builtin tuples; unavailable/forged/mutated results reject. Roll back by marking managed builtin source unavailable. | `201-400`. |
| G05 model/effort | Gentle Pi model-routing owner after the #381/#382 foundation, approved remaining slices, and re-frozen contract. | Versioned authority accepts/rejects model and effort with S17/S18-style proof. Roll back by rejecting managed model/effort declarations as authority unavailable. | `>400/unknown`; must be pre-split. |
| G06 tool capability | Runtime capability owner; #62 regression and packed-install proof where executable loading exists. | Non-empty requested lists are accepted/rejected by an authority; `[]` needs none; packed proof passes. Roll back by rejecting every non-empty managed list. | `201-400`. |
| G07 limit policy | Human product/runtime owner; no code starts before one option below is selected. | Deterministic ingress count, boundary tests, closed public error code, and privacy-safe metric defined. Roll back only to a previous approved bounded policy. | `<=200`. |
| G08 projection | Gentle Pi diagnostics/privacy owner. | Literal/context-authorized private read plus exhaustive closed public mapper; denied-read, unknown-code, aggregate/order, and leak tests pass. Roll back by making managed resolver unavailable with no diagnostic fallback. | `201-400`. |
| G01 integration | Gentle Pi managed resolver owner, after G02–G08 have delivered their interfaces/policy. | Managed parser/resolver validates provenance, overrides, limits, metadata, model, and tools; focused S04/S05/S11–S29-equivalent tests pass; unmanaged path unchanged. Roll back by removing the managed facade only. | `>400/unknown`; pre-split before code. |

Every external or unowned dependency above is **fail-closed**: absence, stale evidence, unapproved child scope, unmerged delivery, or interface mismatch is a blocker, never a local substitute.

## #379 / #354 maintainer decision packet

### Evidence and consequences

| Dependency | Keep as-is | Remove | Reclassify |
|---|---|---|---|
| #379 | Preserves the pinned formal dependency and blocks implementation until PR #387's negative guard is merged. Cost: A2 waits on a non-interface containment issue. | Not supported by current evidence: A2 would lose the explicit containment gate while #387 remains open/unmerged. | Supported only as **implementation-start containment gate, not interface supplier**. It stays blocking until delivered; G01–G08 do not claim to consume its API. |
| #354 | Preserves ledger consistency, but serializes A2 behind asset-install/drift work that exposes no A2 runtime API. | Supported by #354 and #419 current bodies only if a maintainer explicitly changes the ledger: #354 owns asset-install boundaries, and #419's proposed replacement explicitly removes it as a task-definition dependency. | Supported as **delivery/install acceptance alignment**, not a G01–G08 interface or implementation-start gate. It can gate packaging/release hygiene after resolver proof rather than technical interface work. |

### One mutually exclusive ledger decision

1. **Keep both unchanged.** Keep `issue:379` and `issue:354` in the A2 dependency list as formal implementation prerequisites.
2. **Split their semantics.** Retain `issue:379` as a delivered containment gate before A2 implementation; retain `issue:354` only as a delivery/install acceptance gate after technical A2 closure.
3. **Remove #354 only.** Retain `issue:379` as the formal containment gate and remove `issue:354` because it has no A2-consumed interface.

This is intentionally not a choice to remove #379. Current evidence cannot support that outcome while PR #387 is open/unmerged.

### Exact ledger fields affected after an authorized decision

No field is changed by this draft. A maintainer-authorized record must update all affected facts atomically:

- `docs/roadmaps/agent-runtime/manifest.json` → `work_units[id="A2"].dependencies` and its `content_sha256` after the A2 document changes;
- `docs/roadmaps/agent-runtime/TRACKER.md` → the `A2` row dependency column and the A2 validation-boundary statement;
- `docs/roadmaps/agent-runtime/managed-execution/active/A2-agent-definition-resolution-validation.md` → observed-external-authority row and durable dependency-list paragraph;
- `docs/roadmaps/agent-runtime/managed-execution/evidence/A2-validation/feasibility-gaps.md` → “Separate dependency reclassification question”; and
- `docs/roadmaps/agent-runtime/managed-execution/evidence/A2-validation/traceability.md` → observed external issue authority/state row.

**Recommendation, not a decision:** option 2 best preserves #379's safety consequence while recognizing #354's actual asset-boundary scope. A maintainer must choose and mutate the ledger separately.

## G07 product decision — choose exactly one

The options are bounded, mutually exclusive, and use the same counting rule: count each candidate once after passive structural parsing and tuple normalization, before definition validation or external adapter iteration; malformed input counts as one rejected ingress item but never becomes a candidate; duplicate structural tuples count once; the public failure is `candidate-limit-exceeded`; metrics contain only total count, configured limit, source category, and outcome.

| Option | Exact policy | Consequence |
|---|---|---|
| **A** | Maximum **64 total normalized candidates per managed resolution invocation**. | Simplest deterministic policy; one large source may use the whole budget. |
| **B** | Maximum **16 normalized candidates per source** and **64 total per invocation**. | Prevents one source from exhausting capacity; adds source-boundary test cases. |
| **C** | A trusted deployment setting selects an integer **1–64 total candidates per invocation**; default is **32** and no configuration may exceed 64. | Adds configuration provenance and operational support; still has a compiled hard bound. |

No option authorizes an unbounded fallback. The selected policy must define its trusted configuration source (C only), exact metric retention, boundary tests at `limit` and `limit + 1`, and rollback to a previously approved bounded setting.

## Delivery plan, automation controls, and review forecast

| Work unit | Owner/repository | Objective exit | Rollback | Review load |
|---|---|---|---|---:|
| E0 evidence pin | Maintainer / public GitHub + ledger fork readback | Upstream `main` and exact `refs/heads/docs/agent-runtime-roadmaps` direct/API reads match before and after evidence capture; complete authority table | No mutation | `<=200` |
| H1 containment | #379 owner / Gentle Pi | PR #387 merged and current main confirms negative guard | Revert guard slice only | `201-400` |
| D379/354 and D1 | Maintainer / ledger and product policy | One recorded dependency option and one G07 option | No implementation mutation | `<=200` each |
| G02, G08 | Gentle Pi owners | Their matrix exits above, focused tests first | Disable/remove managed seam | `<=200`, `201-400` |
| G03–G06 | Named authority owners / respective repositories | Delivered interface and negative proof; unowned supplier absence fails closed | Reject affected managed source/declaration | `201-400` except G05 pre-split |
| G01 | Gentle Pi managed resolver owner | All supplied authority contracts integrate with deterministic diagnostics and default-off proof | Remove managed facade only | `>400/unknown`, mandatory split |
| #419 runtime integration | #419 child owners / Gentle Pi | Only after #447, admission, registry, session, and result authorities are actually delivered | Disable managed mode; no task migration/recreation | `201-400` per slice |
| Terminal review/publication packet | Independent reviewer + maintainer / Gentle Pi | All eight closure artifacts, pinned-main proof, and A2 review pass; publication remains separate | No publication mutation | `<=200` |

Automatic mode may run dependency-ready, non-mutating work without interruption. It must stop for a product/authority decision, unavailable or drifting external authority, destructive/publication mutation, or a second failed verification gate. Each authorization binds to immutable candidate identity; unchanged read-only retry or actor replacement does not re-prompt. No automation may select the #379/#354 or G07 decision.

## Definition of 100% done

A2 is 100% only when all of the following are true:

1. G01–G08 each have a delivered, owner-confirmed interface or approved G07 policy, with their objective exits and focused negative tests recorded.
2. #379/#354 have an explicit, durably recorded dependency classification; #379's applicable containment gate is delivered.
3. All managed behavior remains default-off and unmanaged behavior is unchanged.
4. External package/builtin/model/tool authorities either prove their exact contract or fail closed; no proposal/issue text fills a missing interface.
5. Resolver public projection leaks no values, identities, paths, contenders, private diagnostics, or unbounded summaries.
6. Integration and packed-install proofs pass on a pinned public-main descendant, including G06 and G07 boundary/metric proof where executable loading exists.
7. Independent terminal review validates A2 R01–R14 and S01–S29 intent. The 29/29 reference-model result remains background self-consistency evidence only.
8. A maintainer separately authorizes any #419-linked publication/update. This draft never grants that authorization.

## Resume card

| Field | Resume value |
|---|---|
| Durable baseline | Fork ledger commit `9c7705263bb076a5548583078f4c2d23cb92b575`; A2 remains `draft / REVISE`; G01–G08 remain open. |
| Exact ledger authority | `barbatdev/gentle-pi` → `refs/heads/docs/agent-runtime-roadmaps`; verify direct remote and GitHub API agree before every ledger mutation. |
| Upstream evidence pin | `Gentleman-Programming/gentle-pi:main` at `a3d87c196268774c8989169e45634e9b46066881`; refresh only when a work unit depends on newer upstream evidence. |
| Next dependency-ready action | Persist this closure program, then collect one combined maintainer decision for #379/#354 classification and G07 option A/B/C. |
| Automatic continuation | After both decisions are durable, verify #379 containment delivery; proceed only to the next dependency-ready work unit. |
| Stop conditions | Exact ledger-branch drift, upstream authority drift affecting current evidence, unavailable external owner/interface, destructive or publication mutation, unresolved product decision, or second failed verification gate. |
| Unrelated work | #469 remains separate and is not an A2 prerequisite. |

## Evidence coverage and readback

- **Observation window:** 2026-08-28T19:42:54Z–2026-08-28T19:52:59Z.
- **Upstream main:** direct/API read `a3d87c196268774c8989169e45634e9b46066881`.
- **Ledger fork:** exact `refs/heads/docs/agent-runtime-roadmaps` direct/API read `9c7705263bb076a5548583078f4c2d23cb92b575` before and after reconciliation. Fork default `main` is not ledger authority.
- **GraphQL coverage:** full bodies/current labels and state for #62, #327, #354, #379, #381, #382, #419, #440, #446, #447, #448, #449, and #469; all comments and timelines for the required issues, each within the 100-item page; linked/closing PR metadata for #380, #387, #429, and #441.
- **Closing-PR search coverage:** #62, #327, #354, #379, #381, and #382, with `first:100`; #379 returned exactly #380 and #387, and #354/#327 returned none.
- **Source coverage:** raw upstream-main readback of `extensions/gentle-ai.ts` and `lib/model-routing-authority.ts` against the pinned main SHA.
- **Privacy/readability checks:** no credentials, private paths, tokens, or local-repository content are recorded; headings, citation links, bounded decisions, and owner/rollback/exit fields are present.

## Citations

- **[L-A2]** Pinned A2 draft: https://raw.githubusercontent.com/barbatdev/gentle-pi/9c7705263bb076a5548583078f4c2d23cb92b575/docs/roadmaps/agent-runtime/managed-execution/active/A2-agent-definition-resolution-validation.md
- **[L-GAPS]** Pinned gap register: https://raw.githubusercontent.com/barbatdev/gentle-pi/9c7705263bb076a5548583078f4c2d23cb92b575/docs/roadmaps/agent-runtime/managed-execution/evidence/A2-validation/feasibility-gaps.md
- **[L-TRACE]** Pinned traceability: https://raw.githubusercontent.com/barbatdev/gentle-pi/9c7705263bb076a5548583078f4c2d23cb92b575/docs/roadmaps/agent-runtime/managed-execution/evidence/A2-validation/traceability.md
- **[L-MANIFEST]** Pinned manifest: https://raw.githubusercontent.com/barbatdev/gentle-pi/9c7705263bb076a5548583078f4c2d23cb92b575/docs/roadmaps/agent-runtime/manifest.json
- **[S-DISCOVERY]** https://github.com/Gentleman-Programming/gentle-pi/blob/a3d87c196268774c8989169e45634e9b46066881/extensions/gentle-ai.ts#L1393-L1554
- **[S-MODEL]** https://github.com/Gentleman-Programming/gentle-pi/blob/a3d87c196268774c8989169e45634e9b46066881/lib/model-routing-authority.ts
- **[S-REVIEW-DIAG]** https://github.com/Gentleman-Programming/gentle-pi/blob/a3d87c196268774c8989169e45634e9b46066881/extensions/gentle-ai.ts#L99-L129
- **[I-62]** https://github.com/Gentleman-Programming/gentle-pi/issues/62
- **[I-327]** https://github.com/Gentleman-Programming/gentle-pi/issues/327
- **[I-354]** https://github.com/Gentleman-Programming/gentle-pi/issues/354
- **[I-379]** https://github.com/Gentleman-Programming/gentle-pi/issues/379
- **[I-381]** https://github.com/Gentleman-Programming/gentle-pi/issues/381
- **[I-382]** https://github.com/Gentleman-Programming/gentle-pi/issues/382
- **[I-419]** https://github.com/Gentleman-Programming/gentle-pi/issues/419
- **[I-440]** https://github.com/Gentleman-Programming/gentle-pi/issues/440
- **[I-446]** https://github.com/Gentleman-Programming/gentle-pi/issues/446
- **[I-447]** https://github.com/Gentleman-Programming/gentle-pi/issues/447
- **[I-448]** https://github.com/Gentleman-Programming/gentle-pi/issues/448
- **[I-449]** https://github.com/Gentleman-Programming/gentle-pi/issues/449
- **[I-469]** https://github.com/Gentleman-Programming/gentle-pi/issues/469
- **[PR-289]** https://github.com/Gentleman-Programming/gentle-pi/pull/289
- **[PR-380]** https://github.com/Gentleman-Programming/gentle-pi/pull/380
- **[PR-387]** https://github.com/Gentleman-Programming/gentle-pi/pull/387
- **[PR-398]** https://github.com/Gentleman-Programming/gentle-pi/pull/398
- **[PR-408]** https://github.com/Gentleman-Programming/gentle-pi/pull/408
- **[PR-429]** https://github.com/Gentleman-Programming/gentle-pi/pull/429
- **[PR-441]** https://github.com/Gentleman-Programming/gentle-pi/pull/441
