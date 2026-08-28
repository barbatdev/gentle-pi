Create one pure, defensive classifier for the **latest direct Pi 0.74 `agent_end.messages` observation** after the prompt has closed. It returns exactly one frozen #448 settlement-input pair and nothing else:

| Selected final assistant `stopReason` | Returned settlement input |
|---|---|
| `stop`, `length`, `toolUse` | `{ state: "completed", code: "completed" }` |
| `aborted` | `{ state: "interrupted", code: "interrupted" }` |
| `error`, missing, unsupported, malformed, or no valid final assistant event | `{ state: "failed", code: "prompt-failed" }` |

This is the separately reviewable classifier child required by amended #446. It keeps #446 within its 260–320-line executor budget: #446 captures latest-event-wins, awaits prompt settlement, owns subscription/prompt/cleanup behavior, and passes one closed observation here. This child owns no transaction or runtime authority.

## Scope and boundaries

Add only:

- `lib/agent-runtime/pi-foreground-run-outcome.ts`
- `tests/pi-foreground-run-outcome.test.ts`

The module is pure structural parsing/classification. Its sole allowed registry reference is a **type-only** import of #448's merged `AgentTaskFinalResultInput`; it has no registry runtime/value/capability dependency. It must not own or import lifecycle, task IDs, `AgentTaskFinalResult`, session preparation, subscription, event selection, prompt invocation, cleanup, final-result delivery, projection/UI, persistence, logging, clocks, randomness, network access, or a Pi/provider runtime.

In particular, #446 alone:

1. subscribes to `session.agent.subscribe()`;
2. retains only the latest direct `agent_end.messages` reference (or `undefined`);
3. awaits the prompt's resolved/rejected settlement;
4. applies its subscription/cleanup precedence; and
5. sends this helper's one pair to #448 `registry.settle`.

The helper cannot subscribe, observe `agent_end` itself, choose among events, invoke a prompt, dispose a session, or call `settle`.

## Exact API

#448's implementation must merge before this child is implemented. The helper MUST type-only import #448's exported `AgentTaskFinalResultInput`; it must not replace or widen that foundational shape, and the import is its sole registry reference. Its return union narrows the foundation to the three exact correlated pairs below. It imports no registry value and receives no registry object, `settle`, record, snapshot, or capability.

```ts
import type { AgentTaskFinalResultInput } from "./agent-task-registry.js";

type PiForegroundPromptStatus = "resolved" | "rejected";

type PiForegroundRunOutcomeInput = Readonly<{
  messages: unknown;
  prompt_status: PiForegroundPromptStatus;
}>;

type PiForegroundRunOutcome =
  | (AgentTaskFinalResultInput & Readonly<{
      state: "completed";
      code: "completed";
    }>)
  | (AgentTaskFinalResultInput & Readonly<{
      state: "interrupted";
      code: "interrupted";
    }>)
  | (AgentTaskFinalResultInput & Readonly<{
      state: "failed";
      code: "prompt-failed";
    }>);

export function classifyPiForegroundRunOutcome(
  input: unknown,
): PiForegroundRunOutcome;
```

The exact relative module specifier targets #448's merged export in the same `lib/agent-runtime/` directory; the import is type-only and therefore cannot create a runtime dependency.

`input` is a closed observation, not an event and not a live runtime capability. #446 passes the latest received direct `agent_end.messages` reference unchanged as `messages`, or `undefined` when none was captured, and a closed `prompt_status` only after the prompt has settled.

The outer input is accepted only when it is an observationally exact plain/null-prototype record with exactly own string-data keys `messages` and `prompt_status`, no symbols, no inherited/class shape, and `prompt_status` exactly `"resolved"` or `"rejected"`. Validate prototype, own keys, and data descriptors before consuming descriptor values. Contain every reflection/proxy exception and return `failed/prompt-failed`; never invoke a getter. A transparent proxy exposing the same prototype, own keys, and data descriptors may be accepted.

Every path returns a newly created exact own-data object with only `state` and `code`, frozen with `Object.freeze`. It has no `task_id`, is not `AgentTaskFinalResult`, is not authoritative, and cannot be delivered as a final result. Only #448 `settle` mints, commits, and returns an authoritative final result.

## Observable message selection

Treat `messages` as unavailable unless it is an observationally ordinary dense array:

- `Array.isArray(messages)` succeeds, its prototype is `Array.prototype`, it has no symbol keys, and its own keys are exactly `"length"` plus every canonical index from `"0"` through `String(length - 1)`;
- `length` and every element are own data descriptors; sparse holes, accessors, inherited elements, reflection failures, revoked/throwing proxies, and non-array/class-shaped values fail closed; and
- all inspected message records are passive structural data: ordinary/null-prototype, no symbol keys, no accessor descriptors, and an own data `role` descriptor whose value is a string. The classifier does not consume `content`, reasoning, tool data, raw errors, or any other message value.

Make one complete forward structural validation and selection pass over every dense-array element before returning a completed or interrupted classification. Every message record must be passive ordinary/null-prototype structural data with no symbol keys or accessor descriptors and an own data `role` descriptor whose value is a string. A missing, inherited, accessor, non-string, malformed, or hostile/throwing `role` observation anywhere makes `messages` malformed and fails closed immediately; it must not be silently skipped or permit fallback through that record.

For every exact `"assistant"` record in that same pass, inspect only its own data `stopReason` value and validate it against the exact Pi 0.74 values `stop`, `length`, `toolUse`, `aborted`, and `error`. A missing, inherited, accessor, non-string, malformed, hostile/throwing, or unsupported `stopReason` on any assistant anywhere fails closed; do **not** fall back to an earlier assistant. Retain only the latest validated assistant `stopReason` primitive while continuing the pass. Valid non-assistant string roles are skipped, including trailing tool results. After the entire array validates, map that retained latest-assistant primitive; no assistant maps to `failed/prompt-failed`.

This complete pass deliberately tolerates valid non-assistant trailing messages while rejecting malformed structure before it can return success. It never calls a property getter, retains or copies no message object or private field, makes no second reflection pass, and contains `Object.getPrototypeOf`, `Reflect.ownKeys`, and `Object.getOwnPropertyDescriptor` failures. A transparent proxy is acceptable only when those observations are equivalent and non-throwing.

## Prompt-settlement rule

Retain and validate `prompt_status` even though both statuses return `failed/prompt-failed` when no valid event maps differently. It proves this helper receives a **closed** observation rather than an in-flight prompt state and makes the #446 boundary explicit:

- `resolved` with a valid captured final assistant event uses that event's mapping;
- `rejected` with a valid captured final assistant event also uses that event's mapping; and
- either closed status without a valid captured final assistant event returns `failed/prompt-failed`.

The rejected-prompt case must not erase a real final direct observation: Pi may have emitted a final assistant event before the awaited prompt rejects. Conversely, neither status authorizes guessing a result from exception data, `agent.state.errorMessage`, time, or a missing event.

## Privacy and purity

The implementation must not inspect, copy, retain, log, persist, project, expose, stringify, serialize, or return message content, output, reasoning, tool data, raw error fields, paths, session IDs, provider/model data, prompt text, or `agent.state.errorMessage`.

It may retain only local primitive structural decisions long enough to return its pair. It has no collaborator, clock, random source, network call, Pi/provider import, or runtime dependency. Tests use synthetic opaque sentinels only and prove they do not appear in output or logs.

## Required tests

- all five Pi 0.74 stop reasons and the exact three allowed pairs;
- last-assistant selection rather than last-array-element selection, earlier assistants, and valid trailing/intervening non-assistant messages;
- exact-assistant selection; valid non-assistant string roles skipped; and missing, inherited, accessor, non-string, and hostile/throwing `role` observations before and after the newest assistant failing closed without fallback;
- every assistant `stopReason` validated during the complete pass, including malformed or unsupported assistant records before and after the newest assistant;
- resolved and rejected prompt settlement with a valid final assistant, and each closed status with no valid event;
- absent, non-array, malformed, sparse, and malformed-element `messages`;
- missing, inherited, accessor, non-string, unsupported, and `error` `stopReason` cases;
- outer-input missing/unknown/symbol/accessor/inherited/class/proxy/reflection cases, with no getter invocation;
- array/message symbol, inherited, class, accessor, sparse, throwing/reflection, revoked-proxy, and transparent-proxy cases;
- frozen exact closed output, no `task_id`, no result-authority impersonation, and no retained/private sentinel in returned values or observable module state; and
- static source checks proving no Pi/provider, executor, projection/UI, persistence, logging, clock/randomness, or network dependency; the only permitted registry reference is the type-only import of #448's `AgentTaskFinalResultInput`, with no registry value import, object, `settle`, record, snapshot, or capability.

## Acceptance criteria

- [ ] The helper accepts only the stated closed observation and returns only one frozen exact #448-compatible `{ state, code }` pair.
- [ ] The direct Pi 0.74 final-assistant selection and stop-reason mapping are implemented exactly as above.
- [ ] Missing, malformed, unsupported, inaccessible, or hostile input always fails closed as `failed/prompt-failed` without invoking a getter or leaking reflection errors.
- [ ] Valid trailing non-assistant messages are ignored; last-assistant selection (not last-array-element selection) is preserved only after every dense-array record and every assistant `stopReason` validates, so malformed records before or after the newest assistant and any malformed/unsupported assistant cannot cause fallback or a completed/interrupted result.
- [ ] Prompt rejection preserves a valid captured final assistant classification; either closed prompt status with no valid mapping is `failed/prompt-failed`.
- [ ] The helper has no lifecycle, event-capture, prompt, cleanup, final-result, projection, UI, persistence, provider-runtime, or privacy-boundary ownership; its sole registry reference is #448's type-only `AgentTaskFinalResultInput` import, with no runtime/value/capability dependency.
- [ ] It type-only imports #448's merged settlement-input type and narrows it to the three exact correlated outcome pairs without replacing or widening the foundation.
- [ ] Focused tests prove the exact mapping, hostile structural boundaries, frozen output, no private-data escape, and forbidden-dependency boundary.

## Non-goals

No production wiring; Pi session construction; prompt or subscription invocation; latest-event tracking; `agent_end` event filtering; cancellation, abort, retries, shutdown, cleanup; task identity/state/final results; registry settlement; activity publishing; UI; logging; persistence/history; diagnostics; model/provider selection; external-provider inspection; or changes to #446/#448/#440.

## Pi 0.74 evidence

Repository-local public package evidence is pinned to Pi 0.74.0:

- `@earendil-works/pi-agent-core` `AgentEvent` declares `agent_end` as its last event with `messages: AgentMessage[]`; `AgentMessage = Message | CustomAgentMessages[...]`. `AgentState.errorMessage` exists but is explicitly forbidden to this helper.
- `@earendil-works/pi-agent-core` `Agent.subscribe()` awaits listener promises, and `agent_end` is final: listeners participate in run settlement. #446 must therefore await prompt settlement and pass this helper one already-closed observation.
- `@earendil-works/pi-ai` `AssistantMessage` declares `role === "assistant"` and exactly `StopReason = "stop" | "length" | "toolUse" | "error" | "aborted"`.
- The Pi 0.74 agent loop appends each assistant message to `newMessages`, then appends tool results. An early `shouldStopAfterTurn` can emit `agent_end` with trailing tool-result messages; otherwise the final event contains all `newMessages`. Selecting the latest validated assistant rather than the last array element is therefore required, while the complete structural pass validates every record before a successful classification.
- Pi's `handleRunFailure` emits `agent_end` with one assistant whose stop reason is `error` or `aborted`, which this classifier maps through the table above.

These are public package/version/symbol references only; no external provider code is inspected.

## Dependencies, provenance, and rollback

- **Parent:** #419.
- **Consumer:** amended #446; it may implement only after this child is approved and its implementation merges with the other listed foundations.
- **Required type foundation:** #448's implementation must merge before this helper imports its settlement-input type. Issue approval may happen now.
- **Related unmerged foundation:** PR #441 remains unmerged; this child neither depends on its implementation nor changes its authority boundary.

Implement from #419, amended #446, approved #448, existing Gentle Pi contracts, and the repository-local Pi 0.74 public declarations/source behavior only. Do not inspect, copy, translate, or derive from the discarded external provider.

Rollback removes only this unconnected pure helper and its focused tests. No producer, wiring, data, configuration, migration, or external cleanup exists.

## Duplicate decision and labels

Not a duplicate. #419 is the umbrella; #446 owns foreground transaction/event capture and explicitly delegates pure direct-event parsing to a new child; #448 owns settlement-input authority and final-result storage. Searches across open and closed issues for `agent_end`, `stopReason`, `foreground outcome classifier`, `prompt-failed`, `direct Pi`, `foreground run`, `classifier`, `prompt settlement`, `agent end`, and `final assistant` found no issue owning this isolated classifier.

Use the repository's existing `type:feature` label when the issue is published. Keep it in the repository's review state until maintainers approve the bounded contract; no merge authorization is implied.

## Review workload forecast

One `type:feature` PR, hard maximum 400 changed lines:

| Area | Forecast |
|---|---:|
| Pure classifier, closed types, defensive descriptor parsing | 70–95 |
| Focused mapping, structural-hostility, privacy, and dependency-boundary tests | 125–170 |
| Verification/supporting changes | 0–10 |
| **Expected total** | **195–275** |

If the exact implementation/test split exceeds 400 lines, stop and split a separately approved bounded concern. Do not compress control flow, omit hostile-input/privacy tests, or request `size:exception`.
