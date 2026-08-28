# A2 G01–G08 Closure Program — Corrective Completion Draft

> **Status:** planning evidence only. This draft does not authorize implementation, publication, ledger mutation, issue mutation, or readiness.
>
> **Observed:** 2026-08-28T19:52:59Z. Current upstream `main` was observed as `a3d87c196268774c8989169e45634e9b46066881`; the exact ledger branch `refs/heads/docs/agent-runtime-roadmaps` was verified by direct remote and GitHub API at `e46f45a2da7cb5705f6e827871c003e2a146bcda`. The fork default `main` branch is unrelated to ledger authority.

## Authority pin

Persist or resume this program only when direct remote and GitHub API agree on the exact ledger branch `refs/heads/docs/agent-runtime-roadmaps`. At this readback both resolve to `e46f45a2da7cb5705f6e827871c003e2a146bcda`. A change to the fork default `main` branch is not ledger drift and does not require re-pinning.

## Outcome and non-negotiable boundary

Close A2's eight production-feasibility gaps without changing default unmanaged execution, without treating proposal-model assertions as runtime proof, and without converting external issue text into a delivered interface.

| Boundary | Required interpretation |
|---|---|
| A2 ledger state | A2 remains `draft / REVISE`; D-016 plus selected G07 policy complete milestone 10%, while G01–G08 remain production-open (0/8 closed). The reference model is proposal self-consistency only; executable G07 proof remains pending. [L-A2] [L-GAPS] [L-TRACE] |
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
  ├─ D379/354: Separate semantics recorded
  └─ D1: selected G07 option B is durable; executable proof remains pending

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

**Ordering correction:** #447 is the eventual default-off selection seam, not G02 and not definition validation. #448/#449 are #419 task-result slices, not A2 prerequisites or completion evidence. The recorded Separate semantics decision removes #354 from A2’s technical dependency graph and retains it as delivery/install acceptance alignment after technical closure. #379 remains the formal implementation-start containment gate until delivered; its unmerged PR #387 makes that gate fail closed.

## Milestones: 0% to 100%

Percentages represent completed closure outcomes, not effort spent. A milestone advances only after its objective evidence is durable and read back.

| Progress | Completed outcome | Blocking exit |
|---:|---|---|
| **0%** | Schema-v2 ledger, A2 draft/REVISE, public-contract snapshots, proposal evidence, and this closure program are durable; production gaps closed: 0/8. | Persist this plan against the pinned ledger branch. |
| **10%** | **Complete:** D-016 dependency classification and D-017 selected G07 option B are recorded. | G07 production gap remains open: executable boundary, metric, operational, and rollback evidence is pending; no implementation authorization follows. |
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
| G07 limit policy | **Selected option B:** fixed 16 normalized candidates per source kind and 64 total per managed resolution; no dynamic configuration, deployment override, or unbounded fallback. | Count after passive structural parsing and tuple normalization before definition validation or adapter iteration; malformed ingress is rejected accounting only, duplicates count once; 17/65 fail closed as `candidate-limit-exceeded`; boundary, pre-adapter, safe-metric, operational, and rollback proof remains pending. Roll back only to a previously approved bounded policy. | `<=200`. |
| G08 projection | Gentle Pi diagnostics/privacy owner. | Literal/context-authorized private read plus exhaustive closed public mapper; denied-read, unknown-code, aggregate/order, and leak tests pass. Roll back by making managed resolver unavailable with no diagnostic fallback. | `201-400`. |
| G01 integration | Gentle Pi managed resolver owner, after G02–G08 have delivered their interfaces/policy. | Managed parser/resolver validates provenance, overrides, limits, metadata, model, and tools; focused S04/S05/S11–S29-equivalent tests pass; unmanaged path unchanged. Roll back by removing the managed facade only. | `>400/unknown`; pre-split before code. |

Every external or unowned dependency above is **fail-closed**: absence, stale evidence, unapproved child scope, unmerged delivery, or interface mismatch is a blocker, never a local substitute.

## #379 / #354 dependency classification — recorded

### Selected decision and consequences

**Selected — Separate semantics (formerly option 2, Split their semantics).** #379 remains the formal A2 implementation-start containment gate/dependency until delivered; it is not a G01–G08 interface supplier. #354 is removed from A2’s technical dependency array because it supplies no A2-consumed interface; it remains delivery/install acceptance alignment after technical closure, not an implementation prerequisite. No schema expansion is permitted. A2 remains `draft / REVISE`, G01–G08 remain open, and this record authorizes neither implementation nor publication.

**No re-prompt:** dependency classification is complete and recorded in D-016; G07 option B is selected and recorded in D-017. The next dependency-ready action is H1: verify/deliver #379 containment gate (PR #387 or verified successor). Executable G07 proof remains pending; this does not authorize implementation.

### Historical decision packet (resolved)

| Dependency | Keep as-is | Remove | Separate semantics — selected |
|---|---|---|---|
| #379 | Preserve the formal dependency and wait for PR #387’s negative guard. | Not supported while #387 remains open/unmerged. | Keep as the formal implementation-start containment gate/dependency, not an interface supplier. |
| #354 | Keep #354 in its former manifest position despite no A2 runtime API. | Remove without documenting the delivery/install boundary. | Remove from the technical dependency graph; retain only delivery/install acceptance alignment after technical closure. |

The historical packet is retained for evidence only; it is not an active choice. #379 is not removable on the current evidence while PR #387 remains open/unmerged.

### Exact ledger fields updated by the recorded decision

- `docs/roadmaps/agent-runtime/manifest.json` → A2 `dependencies` is exactly `issue:379`, `issue:327`, `issue:381`, `issue:382`, `A1`; A2 and affected evidence/operational hashes are updated without a schema change.
- `docs/roadmaps/agent-runtime/TRACKER.md` → A2 dependency column, closure status, next action, and auxiliary hashes reflect the selected semantics.
- `docs/roadmaps/agent-runtime/managed-execution/active/A2-agent-definition-resolution-validation.md` → observed-authority and dependency truth exclude #354 as a technical prerequisite.
- `docs/roadmaps/agent-runtime/managed-execution/evidence/A2-validation/feasibility-gaps.md` and `traceability.md` → recorded classification replaces the open reclassification question.
- `docs/roadmaps/agent-runtime/DECISIONS.md`, `BACKLOG.md`, and `HANDOFF.md` → D-016 and operational resume state record completion of dependency classification and G07 as next.

## G07 product decision — selected option B (do not re-prompt)

**D-017 selects option B.** The fixed policy is maximum **16 normalized candidates for each source kind** (`project`, `global`, `package`, `builtin`) and maximum **64 normalized candidates total** per managed resolution invocation. Count after passive structural parsing and tuple normalization, before definition validation or external adapter iteration. Malformed ingress counts once as rejected ingress but never becomes a candidate; exact duplicate structural tuples count once for the candidate limit, while identity-conflict behavior remains separate. At 17 for any source kind or 65 total, fail closed before further resolution with public code `candidate-limit-exceeded`.

Public metrics may contain only total count, configured total limit, the source category when a per-source limit triggers, configured per-source limit, and outcome. They contain no names, owners, paths, or contenders. There is no dynamic configuration, deployment override, or unbounded fallback. Rollback is only to a previously approved bounded policy; until executable implementation exists, resolution is fail-closed/unavailable rather than unlimited legacy behavior. Milestone 10% is complete with D-016; production gaps closed remain 0/8 because executable G07 boundary, operational, metric, and rollback evidence is pending.

| Historical option | Status | Retained interpretation |
|---|---|---|
| A | not selected | 64 total only; superseded by the selected per-source plus total bound. |
| **B** | **selected** | 16 per source and 64 total, with the counting, failure, privacy, and rollback boundary above. |
| C | rejected | Dynamic deployment configuration is not authorized. |

## Delivery plan, automation controls, and review forecast

| Work unit | Owner/repository | Objective exit | Rollback | Review load |
|---|---|---|---|---:|
| E0 evidence pin | Maintainer / public GitHub + ledger fork readback | Upstream `main` and exact `refs/heads/docs/agent-runtime-roadmaps` direct/API reads match before and after evidence capture; complete authority table | No mutation | `<=200` |
| H1 containment | #379 owner / Gentle Pi | PR #387 merged and current main confirms negative guard | Revert guard slice only | `201-400` |
| D379/354 and D1 | Maintainer / ledger and product policy | Separate semantics and selected G07 option B are recorded; executable G07 proof remains pending | No implementation mutation | `<=200` each |
| G02, G08 | Gentle Pi owners | Their matrix exits above, focused tests first | Disable/remove managed seam | `<=200`, `201-400` |
| G03–G06 | Named authority owners / respective repositories | Delivered interface and negative proof; unowned supplier absence fails closed | Reject affected managed source/declaration | `201-400` except G05 pre-split |
| G01 | Gentle Pi managed resolver owner | All supplied authority contracts integrate with deterministic diagnostics and default-off proof | Remove managed facade only | `>400/unknown`, mandatory split |
| #419 runtime integration | #419 child owners / Gentle Pi | Only after #447, admission, registry, session, and result authorities are actually delivered | Disable managed mode; no task migration/recreation | `201-400` per slice |
| Terminal review/publication packet | Independent reviewer + maintainer / Gentle Pi | All eight closure artifacts, pinned-main proof, and A2 review pass; publication remains separate | No publication mutation | `<=200` |

Automatic mode may run dependency-ready, non-mutating work without interruption. It must stop for an unresolved product/authority decision, unavailable or drifting external authority, destructive/publication mutation, or a second failed verification gate. Each authorization binds to immutable candidate identity; unchanged read-only retry or actor replacement does not re-prompt. No automation may select G07; D-017 selected option B and D-016 Separate semantics must not be re-prompted. Executable G07 proof remains pending and no implementation is authorized by either decision.

## Definition of 100% done

A2 is 100% only when all of the following are true:

1. G01–G08 each have a delivered, owner-confirmed interface or approved G07 policy, with their objective exits and focused negative tests recorded.
2. #379’s containment gate is delivered; the Separate semantics classification is durably recorded, and #354 delivery/install acceptance alignment is assessed after technical closure.
3. All managed behavior remains default-off and unmanaged behavior is unchanged.
4. External package/builtin/model/tool authorities either prove their exact contract or fail closed; no proposal/issue text fills a missing interface.
5. Resolver public projection leaks no values, identities, paths, contenders, private diagnostics, or unbounded summaries.
6. Integration and packed-install proofs pass on a pinned public-main descendant, including G06 and G07 boundary/metric proof where executable loading exists.
7. Independent terminal review validates A2 R01–R14 and S01–S29 intent. The 29/29 reference-model result remains background self-consistency evidence only.
8. A maintainer separately authorizes any #419-linked publication/update. This draft never grants that authorization.

## Resume card

| Field | Resume value |
|---|---|
| Durable baseline | Fork ledger commit `e46f45a2da7cb5705f6e827871c003e2a146bcda`; A2 remains `draft / REVISE`; milestone 10% is complete, G01–G08 remain production-open, and executable G07 proof is pending. |
| Exact ledger authority | `barbatdev/gentle-pi` → `refs/heads/docs/agent-runtime-roadmaps`; verify direct remote and GitHub API agree before every ledger mutation. |
| Upstream evidence pin | `Gentleman-Programming/gentle-pi:main` at `a3d87c196268774c8989169e45634e9b46066881`; refresh only when a work unit depends on newer upstream evidence. |
| Next dependency-ready action | H1: verify/deliver #379 containment gate (PR #387 or verified successor) before technical A2 implementation. |
| Automatic continuation | Do not re-prompt G07; after H1 delivery is verified, proceed only to the next dependency-ready work unit. Executable G07 proof remains pending. |
| Stop conditions | Exact ledger-branch drift, upstream authority drift affecting current evidence, unavailable external owner/interface, destructive or publication mutation, unresolved product decision, or second failed verification gate. |
| Unrelated work | #469 remains separate and is not an A2 prerequisite. |

## Evidence coverage and readback

- **Observation window:** 2026-08-28T19:42:54Z–2026-08-28T19:52:59Z.
- **Upstream main:** direct/API read `a3d87c196268774c8989169e45634e9b46066881`.
- **Ledger fork:** exact `refs/heads/docs/agent-runtime-roadmaps` direct/API read `e46f45a2da7cb5705f6e827871c003e2a146bcda` before and after reconciliation. Fork default `main` is not ledger authority.
- **GraphQL coverage:** full bodies/current labels and state for #62, #327, #354, #379, #381, #382, #419, #440, #446, #447, #448, #449, and #469; all comments and timelines for the required issues, each within the 100-item page; linked/closing PR metadata for #380, #387, #429, and #441.
- **Closing-PR search coverage:** #62, #327, #354, #379, #381, and #382, with `first:100`; #379 returned exactly #380 and #387, and #354/#327 returned none.
- **Source coverage:** raw upstream-main readback of `extensions/gentle-ai.ts` and `lib/model-routing-authority.ts` against the pinned main SHA.
- **Privacy/readability checks:** no credentials, private paths, tokens, or local-repository content are recorded; headings, citation links, bounded decisions, and owner/rollback/exit fields are present.

## Citations

- **[L-A2]** Pinned A2 draft: https://raw.githubusercontent.com/barbatdev/gentle-pi/e46f45a2da7cb5705f6e827871c003e2a146bcda/docs/roadmaps/agent-runtime/managed-execution/active/A2-agent-definition-resolution-validation.md
- **[L-GAPS]** Pinned gap register: https://raw.githubusercontent.com/barbatdev/gentle-pi/e46f45a2da7cb5705f6e827871c003e2a146bcda/docs/roadmaps/agent-runtime/managed-execution/evidence/A2-validation/feasibility-gaps.md
- **[L-TRACE]** Pinned traceability: https://raw.githubusercontent.com/barbatdev/gentle-pi/e46f45a2da7cb5705f6e827871c003e2a146bcda/docs/roadmaps/agent-runtime/managed-execution/evidence/A2-validation/traceability.md
- **[L-MANIFEST]** Pinned manifest: https://raw.githubusercontent.com/barbatdev/gentle-pi/e46f45a2da7cb5705f6e827871c003e2a146bcda/docs/roadmaps/agent-runtime/manifest.json
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
