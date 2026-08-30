# A2 traceability and evidence boundary

## Evidence classes

| Class | Evidence |
|---|---|
| Verified current implementation | The observed external subagent runtime accepts optional string/string-array agent input and resolves a name-keyed definition map. Discovery reports `project`, `user`, or `builtin` without `owner` or `normalizedName`; package-name concatenation is lossy and normalized collisions are last-write-wins. It has no structured identity, discovery provenance, override declaration, or strict result boundary. Gentle Pi intercepts `subagent_run` only for edit-surface and review context; it does not parse, resolve, or rewrite selectors. |
| Proposed policy | R01–R14 and the reference model are candidate policy, not runtime behavior. |
| Observed external issue authority/state | #62, #327, #354, #379, #381, #382, and #419 are open. #379 approved/#387 open-unmerged/#380 closed-unmerged is the formal implementation-start containment gate, not a delivered A2 interface. #354 is delivery/install acceptance alignment after technical closure, not an A2 technical dependency, implementation prerequisite, or interface supplier. #327/#381/#382 are not delivered authority. |
| Unresolved gaps | G01–G08 are recorded in `feasibility-gaps.md`. |

## Normative rule mapping

| Rule | Normative policy | Scenarios | Gaps |
|---|---|---|---|
| R01 | Managed default-off; no legacy fallback; unmanaged unchanged | S20–S21 | — |
| R02 | No source kind has implicit precedence | S08–S09, S21 | — |
| R03 | Identity is structural over source/owner/normalized-name; owner is null when prohibited; map keys are not equality. D-018 assigns singular transport to the external runtime and managed consumption to Gentle Pi. | S01–S07, S10, S29 | G02, G03, G04 |
| R04 | Alias is unqualified; exact selector is structural and has distinct not-found diagnostic. Exact selectors cannot be redirected by alias or model overrides; legacy strings remain unmanaged. | S06–S07, S29 | G02 |
| R05 | Overrides use structured direct-selector lists and structural targets | S11–S14 | G01, G02 |
| R06 | Discovery-owned literal external provenance confirms every source tuple; candidate bytes cannot self-select source authority | S04–S05, S06–S15, S17–S29 | G01, G03, G04 |
| R07 | Override authority binds exact declarer tuple, context, and target set; package/builtin cannot override | S11–S15, S27 | G01, G03, G04 |
| R08 | Any stale/malformed/unauthorized/incomplete/conflicting declaration fails closed | S12–S15, S27 | G01 |
| R09 | Alias needs one candidate or one complete externally authorized project/global declaration | S08–S13 | G01 |
| R10 | Metadata/tools validation and tool authority aggregate deterministically | S22–S26, S28 | G06 |
| R11 | Fixture-shaped model/effort input needs semantic authority; it is not production-validity evidence | S17–S18 | G05 |
| R12 | `resolveInternal` is literal/context-authorized and private; `resolvePublic` returns only closed safe schemas | S16, S23 | G08 |
| R13 | Public aggregate counts are fixed/allowlisted; unknown internal codes map to a fixed safe fallback | S16, S23 | G08 |
| R14 | Selector, fixed G07 resource accounting, aggregate validation, duplicates, absence, overrides, and alias ambiguity use fixed diagnostic order. G07 counts after passive structural parsing and tuple normalization, before definition validation or adapter iteration: maximum 16 normalized candidates per source kind and 64 total; malformed ingress is rejected accounting only, exact duplicate tuples count once, and 17/65 rejects as `candidate-limit-exceeded` with safe metrics only. | S06, S12, S19, S23 | G07 |

## D-018 external contract boundary

D-018 fixes the G02 ownership boundary without claiming an external delivery. The external runtime must accept and version a backward-compatible singular `agent?: string | AgentSelector` ABI. Gentle Pi may consume the delivered selector only through its managed adapter. Managed resolution has no name-only or last-write-wins identity fallback. Plural `agents` structured fan-out remains an external-owner question and fails closed for managed exact use until confirmed. H1 remains the implementation gate; G02 is additionally `BLOCKED_EXTERNAL`.

## Exact limits of this candidate

The reference model demonstrates **self-consistency of a proposed policy only**. Its 29/29 result does not prove the selected G07 numeric policy, executable 16/17 or 64/65 boundaries, dedupe or malformed accounting, pre-adapter rejection, safe metrics, operations, or rollback. It is not implementation, delivery, product validity, approval, production integration, or evidence that an external authority/interface is delivered. It does not validate current loader behavior beyond the separately stated observations and does not independently authorize publication, ledger mutation, issue disposition, or any dependency reclassification beyond the recorded Separate semantics and D-017 G07 decisions. Executable G07 proof remains pending.
