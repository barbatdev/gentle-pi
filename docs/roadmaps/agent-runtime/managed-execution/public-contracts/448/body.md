## Outcome

Extend the authoritative managed-task registry delivered by #440 / PR #441 with one atomic terminal settlement operation. A real terminal commit writes the terminal state, terminal timestamp, revision, and exactly one frozen final result into the **same task record**, then sends the registry's one synchronous notification.

This is the missing bounded child required by the proposed #419 rewrite before #446 can be approved or implemented. It creates no executor, producer, persistence, or second result authority.

## Evidence and decision

- #419's current rewrite proposal requires one record to atomically commit terminal state and its immutable final result, then requires #446 to return the exact committed result.
- #440 / PR #441 at `fd2d7f528b67156097f06bb84d26610ce5271ba6` already owns task IDs, lifecycle graph, timestamps, revisions, immutable snapshots, ordering, and synchronous subscriptions. Its current bare `transition(id, terminalState)` can create result-less terminal records; that is the sole authority gap this child closes.
- #446 currently owns foreground execution classification but explicitly excludes result storage. Its success/failure vocabulary provides the only initial executor-compatible result codes; this child must not broaden into cancellation, shutdown, scheduler, or persistence policy.
- Searches across open and closed issues and pull requests for `terminal result`, `task result storage`, `atomic settle`, `atomic finalize`, `immutable result`, `registry result`, and `duplicate lifecycle authority` found no existing issue or PR owning this registry-record settlement extension. Matches outside #419/#440/#446 concern review-terminal artifacts or unrelated registries.

## Exact API and record contract

Keep `createAgentTaskRegistry()` as the only authority. Extend its returned registry with:

```ts
registry.settle(id, resultInput)
```

`resultInput` is one exact plain data record with only these own string-data keys:

```ts
type AgentTaskFinalResultInput = Readonly<{
  state: AgentTaskTerminalState;
  code: AgentTaskFinalResultCode;
}>;
```

The registry mints and stores the result; callers cannot supply a task ID. On a successful settlement, the stored result is exactly:

```ts
type AgentTaskFinalResult = Readonly<{
  task_id: string;
  state: AgentTaskTerminalState;
  code: AgentTaskFinalResultCode;
}>;
```

The task ID is deliberately duplicated inside the nested result. The record's outer `id` establishes registry identity, while the closed result must stand alone for #419/#446 delivery without callers reconstructing or attaching identity. Because the ID is registry-derived rather than caller input, the two values cannot disagree.

Make the record type a closed discriminated union (or an equivalently enforced closed shape):

- each non-terminal record has no own `result` property;
- each terminal record has exactly one own `result` property whose value is the frozen `AgentTaskFinalResult` above;
- no record exposes prompts, output, messages, reasoning, tool data, raw errors, paths, session IDs, model/provider data, timestamps beyond existing lifecycle fields, or arbitrary details.

Successful `settle` returns the existing #440-style frozen success envelope with `task` and `snapshot`, plus `result`. `result` is the exact frozen object held at `task.result`; `task` is the exact record in `snapshot.tasks`; and `snapshot` is the exact current snapshot returned by `getSnapshot()` and delivered to listeners.

Do **not** add `result(id)`, list, history, polling, or delivery APIs. #440's snapshot/record read plus the `settle` success result is the complete bounded read and delivery surface. #446 later obtains the exact object through successful settlement and returns that object; it does not clone, map, infer, or fabricate it.

## Initial closed terminal matrix

The initial vocabulary is closed and intentionally minimal:

| Terminal state | Permitted code | Allowed source states |
|---|---|---|
| `completed` | `completed` | `running`, `stopping` |
| `failed` | `failed` | `queued`, `running`, `waiting-for-input`, `blocked`, `stopping` |
| `failed` | `subscription-failed` | `running` |
| `failed` | `prompt-failed` | `running` |
| `failed` | `cleanup-failed` | `queued`, `running` |
| `interrupted` | `interrupted` | `queued`, `running`, `waiting-for-input`, `blocked`, `stopping` |
| `cancelled` | none in this child | none in this child |

Each row is one exact allowed terminal-state/code/source-state triple set: no Cartesian product or source-state widening across rows is implied. The source-state column is exactly the corresponding terminal edge already allowed by #440's graph. `settle` rejects any state/code pair or source-state combination outside this table.

For #446's eventual foreground path, successful completion settles `completed/completed`; observed abort settles `interrupted/interrupted`; and task-terminal execution failures settle `failed/subscription-failed`, `failed/prompt-failed`, or `failed/cleanup-failed`. The generic `failed/failed` pair is reserved for an already-created task that reaches the existing #440 `failed` edge without one of those executor classifications; it does not expose diagnostics.

After `create` succeeds, a caller may settle directly from `queued` only as `failed/failed` or `failed/cleanup-failed`, including recovery after a failed attempt to enter `running`. This is one authoritative `settle` mutation under the matrix and source-state checks, not a bare terminal `transition`, compensation, a second store, or a fabricated executor result.

Pre-task failures for which no record was created remain separate closed operation failures: invalid execute input, session preparation failure, and registry creation failure. Failed settlement itself also remains a closed operation failure outside the final-result contract: if `settle` returns an error or throws, #446 may return its separate closed `registry-transition-failed` operation envelope, but no final-result object.

Cancellation and shutdown codes are intentionally absent. A later separately approved child may add a state/code pair only by: (1) extending the exported union and exact validation table in the same registry authority, (2) defining source-state, race, idempotence, and privacy semantics, (3) adding focused tests, and (4) updating every dependent contract before implementation. No free-form strings, caller-defined codes, or implicit compatibility behavior are allowed.

## Transition, atomicity, and idempotence

- Bare `transition(id, terminalState)` no longer commits a terminal state. When `state` is terminal it fails closed as `invalid-transition`, before clock/revision consumption and without mutation or notification. Non-terminal `transition` behavior remains wholly #440-owned and unchanged.
- `settle` validates notification reentrancy, exact primitive ID, observable exact-record `resultInput`, and task existence first. For an already terminal task, it then compares only the requested state/code with the stored result: an identical pair returns the exact existing `result`, `task`, and current `snapshot` with zero clock reads, revision changes, record replacement, or notification; a different pair returns `conflicting-result` with the same zero effects. Only a non-terminal task proceeds to source-state legality, state/code matrix validation, revision availability, clock validation, and one real commit, in that order.
- A real settlement performs one indivisible registry mutation: derive the registry-owned result from the validated pair and task ID; create the updated terminal record with `ended_at_ms`; advance revision once; replace the record; publish one snapshot; notify each listener once synchronously. No observer can see terminal state without its result, or a result before its terminal record.
- A failed validation, clock read, revision guard, or collaborator operation changes no state, timestamp, result, revision, snapshot, ordering, or notification. Clock failure consumes at most its one attempted reading; all earlier failures consume no clock.
- Repeating the identical settlement after a terminal commit is idempotent: return the exact existing frozen `result` object, the current exact task/snapshot references, and perform no clock read, revision increment, record replacement, or notification.
- Any late settlement with a different state or code fails closed as `conflicting-result` and changes nothing. A terminal record cannot be altered, replaced, or given a second result.

Add `invalid-result` and `conflicting-result` to #440's closed registry failure-code union. Exact-record validation must reject arrays, inherited/class shapes, accessors, symbol keys, unknown keys, and non-string values without invoking any property getter or the clock. It must use only observable prototype, own-key, and data-descriptor semantics: a transparent Proxy that faithfully exposes the required prototype, own keys, and data descriptors may be accepted as observationally equivalent, while reflection, getter, trap, revoked-proxy, or throwing-proxy exceptions are contained and fail closed without mutation or clock activity. Invalid state/code pairs also fail closed. Contain provider exceptions and hostile reflection as the existing closed failure categories: ID/input failures as `invalid-input` or `invalid-id` according to the existing boundary; clock exceptions as `invalid-clock`; settlement conflicts as `conflicting-result`.

## Required tests

- terminal/non-terminal record union: exactly one frozen result on terminal records and no own result field before settlement;
- every initial state/code/source matrix row, including the existing `queued -> failed` edge and `stopping -> completed` edge; queued accepts `failed/failed` and `failed/cleanup-failed` only, and rejects `failed/subscription-failed` and `failed/prompt-failed`;
- direct queued settlement after a failed attempt to enter `running`: `failed/failed` after successful cleanup and `failed/cleanup-failed` after failed cleanup, each as one authoritative `settle` commit with the ordinary source-state, identity, atomicity, idempotence, and conflict behavior;
- terminal bare `transition` rejection while non-terminal transition edges remain unchanged;
- `settle` success identity: `result === task.result`, task identity within snapshot, snapshot identity with `getSnapshot()` and listeners, deep freezing, and defensive-copy resistance;
- one atomic revision/timestamp/result/state commit and exactly one notification; no observable partial state;
- duplicate identical settlement after a terminal lookup, including an otherwise-invalid source edge, revision condition, or clock, returns the exact result identity with zero clock/revision/notification/record-replacement effects; a differing terminal state/code returns `conflicting-result` before those checks;
- conflicting late state/code settlement and all invalid IDs, shapes, state/code pairs, and non-terminal source states fail closed without mutation;
- clock throw/invalid/decreasing values, revision exhaustion, unknown task, reentrant notification, and provider exception parity with the specified precedence and no partial commit;
- hostile accessor, inherited/class, symbol, unknown-key, non-string, reflection-throwing, revoked/throwing-proxy result-input cases fail closed without reading a property value or invoking collaborators; a transparent proxy that observably presents the required prototype, own keys, and data descriptors is accepted;
- snapshot order/capacity/subscription behavior remains unchanged; no result-less terminal record can be produced through public registry operations;
- focused suite, package/runtime-module, packed-package, and cross-lane verification; and proof that the module imports no Pi/provider/executor/projection/UI/persistence dependency.

## Acceptance criteria

- [ ] One #440 registry record atomically owns terminal state, end timestamp, revision, and exactly one immutable final result.
- [ ] No public registry operation can create a result-less terminal record.
- [ ] `settle` and record/result shapes, observable exact-record validation, the initial closed matrix with exact per-row source-state rules (including queued rejection of `failed/subscription-failed` and `failed/prompt-failed`), terminal-first idempotence/conflict precedence, and non-terminal commit precedence are implemented and tested exactly as specified.
- [ ] After successful `create`, direct settlement from `queued` is authoritative only for `failed/failed` or `failed/cleanup-failed`, including recovery after a failed attempt to enter `running`; it remains one `settle` mutation and preserves the same identity, atomicity, source-state, exactly-once, idempotent, and conflicting-retry rules.
- [ ] Duplicate identical settlement returns the exact frozen result without clock, revision, or notification activity; a conflict is closed and non-mutating.
- [ ] #440 ordering, capacity, snapshot identity/immutability, subscription order, and reentrancy semantics remain intact.
- [ ] Results are closed and privacy-safe: only task ID, terminal state, and exact code.
- [ ] #446 can later consume and return the exact successful-settlement result object, while failed settlement cannot fabricate one.
- [ ] Future cancellation/shutdown result pairs require an additive, explicitly approved registry-contract child; no open code strings are accepted.
- [ ] The implementation is independently authored from the discarded external-provider implementation, using #419, the merged #440/#441 contract, #446 requirements, existing repository contracts, and public Pi documentation only; it contains no discarded-provider source, imports, fixtures, comments, or derived material.
- [ ] One reversible PR stays below 400 changed lines without compressed control flow or `size:exception`.

## Non-goals

- Session creation, prompt execution, #446 changes, admission wiring, production cutover, projection producer, UI, public command/tool, or task executor.
- Cancellation, abort, races, shutdown, background scheduling, concurrency, polling, task-result history, listing, eviction, persistence, replay, recovery, or another result/lifecycle store.
- Prompts, output, messages, raw errors, diagnostics, tool data, paths, session/model/provider data, logs, or arbitrary result metadata.

## Dependencies, delivery, provenance, and rollback

- **Parent:** #419.
- **Required foundation:** PR #441 must merge into current `main`; this child then targets that current `main` only. Do not open a stacked or polluted PR.
- **Dependent:** #446 must be amended and separately approved to consume and return the exact successful-settlement result before #446 implementation. This issue neither modifies nor approves #446.

Implementation is independently authored from the discarded external-provider implementation, using only the merged Gentle-owned registry contract, linked issue requirements, existing repository contracts, and public Pi documentation.

It is one reversible work unit: extend the existing registry module and its focused tests only. Rollback is one commit reverting that extension; no production path, persisted data, configuration, or migration needs cleanup.

## Duplicate decision

Not a duplicate. #419 names this required child but does not own its bounded registry API; #440/#441 intentionally omit results; #446 classifies execution but intentionally excludes result storage. No other searched issue or pull request owns atomic terminal-result storage on the #440 record.

## Review workload forecast

One `type:feature` PR after PR #441 merges:

| Area | Forecast |
|---|---:|
| Registry types, validation, settle mutation, and terminal guard | 70–95 |
| Focused atomicity, matrix, identity, hostile-input, and regression tests | 190–245 |
| Verification/supporting changes | 0–10 |
| **Expected total** | **260–350** |

This estimate is credible only if the change remains the existing registry plus focused tests. If exact implementation/test evidence would exceed 400 changed lines, stop before implementation and split the matrix or defensive-boundary work into a separately approved child; do not compress control flow, omit coverage, or request `size:exception`.
