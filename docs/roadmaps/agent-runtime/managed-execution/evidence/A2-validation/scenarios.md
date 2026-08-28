# A2 proposal scenarios

Each scenario is a validation-only policy example, not implementation evidence. Fixture-shaped values are accepted only by explicit external-authority test doubles; they are not production-validity claims. Every scenario that invokes resolution deliberately uses either `resolveInternal` with independent context-bound read authority or `resolvePublic`; no wrapper derives authority from candidate arrays.

| ID | Input | Expected result / diagnostic | Policy rationale |
|---|---|---|---|
| S01 | Name `  Build  ` | normalized name `build` | Names normalize by trim + lowercase. |
| S02 | Project definition `{source: project, name: Build}` | identity `{project, null, build}` | Project identity prohibits owner; this is pure identity shape, not resolver trust. |
| S03 | Global definition `{source: global, name: Build}` | identity `{global, null, build}` | Global identity prohibits owner; this is pure identity shape, not resolver trust. |
| S04 | Package fixture with one independently authored literal discovery tuple; then missing, forged, and source/owner/name-mutated candidates | trusted tuple; every other case `authority-unavailable` | Discovery, not candidate bytes, owns exact tuple provenance. |
| S05 | Builtin fixture with one independently authored literal discovery tuple; then missing, forged, and source/owner/name-mutated candidates | trusted tuple; every other case `authority-unavailable` | Builtin provenance is discovery-owned and exact. |
| S06 | Exact `{source: package, owner: vendor/pkg, name: Build}`; then absent exact owner | exact candidate; then `selector-not-found` | Structured selector is exact and has no alias diagnostic. |
| S07 | Alias with one candidate; slash-ambiguous package tuples `{package, vendor/pkg, build}` and `{package, vendor, pkg/build}`; true duplicate tuple | alias resolves; slash tuples are distinct/no `identity-conflict`; duplicate is `identity-conflict` | Identity is structural, never slash serialization. |
| S08 | Alias with one discovery-authorized valid candidate and no overrides | resolved | Unique alias resolves. |
| S09 | Discovery-authorized project and global contenders | `alias-ambiguous` | No implicit precedence. |
| S10 | Two discovery-authorized same `{project, null, build}` identities | `identity-conflict` | Exact duplicates fail closed. |
| S11 | Project contender declares every other contender with a literal authorization binding declarer tuple, `S11` context, and exact target set | overriding contender | Complete independent declaration authorization resolves alias. |
| S12 | No authority; changed declarer; changed target declaration; changed context | each `override-conflict` | No declaration component can inherit authorization. |
| S13 | Two independently authorized complete override contenders | `override-conflict` | Conflicting declarations fail closed. |
| S14 | Authorized contender uses scalar rather than selector list | `override-conflict` | Override grammar is structured-only. |
| S15 | Discovery-confirmed package contender declares overrides despite a literal fixture authorization | `override-conflict` | Package/builtin can never declare overrides. |
| S16 | Authorized internal success; rejected internal reads for success and aggregate failure; public success; aggregate failure with injected details; unknown private code | private candidate only with access; denied results; exact public success; fixed aggregate fields/counts; fallback code | Internal and public APIs are separate and public data is closed-schema. |
| S17 | Fixture-shaped model declaration without semantic authority | `authority-unavailable` | A2 invents no model catalog or production grammar claim. |
| S18 | Fixture-shaped model/effort with accepting authority; then rejected effort | resolved; then `authority-unavailable` | Authority enables semantic acceptance only. |
| S19 | Two candidates with limit one | `candidate-limit-exceeded` | Limits are deterministic when supplied. |
| S20 | Managed mode off with legacy result `legacy-picked` | authorized internal read returns `legacy-picked` | Default-off preserves unmanaged behavior. |
| S21 | Managed alias ambiguity with legacy result present | `alias-ambiguous` | Managed mode never falls back. |
| S22 | Empty description | `invalid-definition` | Description is an ordinary candidate requirement. |
| S23 | Missing `tools` plus empty description, then reversed input order | same public aggregate and deterministic private failure order under authorized internal access | Aggregate validation is independent of input order. |
| S24 | `tools: []`, no tool authority | resolved | Empty allowlist needs no authority. |
| S25 | Non-empty tools, no authority | `authority-unavailable` | Non-empty tools require authority. |
| S26 | Accepted non-empty tools with authority | resolved | Every tool must be accepted. |
| S27 | One otherwise-unique candidate plus non-empty stale override | `override-conflict` | Stale override blocks alias fallback. |
| S28 | `tools: []` without authority; then non-empty tools without authority | resolved; then `authority-unavailable` | Empty and non-empty tool lists have distinct rules. |
| S29 | Exact selector plus valid alias override favoring another contender | exact selected candidate | Alias override never redirects exact lookup. |
