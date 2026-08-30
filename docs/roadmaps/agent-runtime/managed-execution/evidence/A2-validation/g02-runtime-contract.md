# G02 structured-selector runtime contract — draft

> **State:** draft / `BLOCKED_EXTERNAL`
>
> **Owner status:** owner-unconfirmed
>
> **Authority:** non-authorizing. This record documents D-018; it does not authorize implementation, publication, issue activity, or runtime mutation.

## Decision

**D-018:** The external subagent runtime owns the backward-compatible structured-selector transport ABI. Gentle Pi consumes that ABI only through a managed adapter. Legacy string input remains unchanged and unmanaged.

## Fixed decisions

| Topic | Durable decision |
|---|---|
| Transport ownership | The external runtime owns selector input shape, parsing, transport, compatibility, and release delivery. Gentle Pi does not recreate or reinterpret that ABI. |
| Managed consumption | Gentle Pi may consume an owner-delivered structured selector only at its managed adapter boundary. The existing unmanaged path remains unchanged. |
| Exact identity | An exact managed identity is `{source, owner?, normalizedName}`. Equality is structural; neither delimiter concatenation nor a name-only key is identity. |
| Legacy input | A legacy string remains an unmanaged alias input. It retains existing behavior and is not silently promoted to an exact managed selector. |
| Exact-selector safety | An exact selector cannot be redirected by alias resolution or model overrides. |
| Collision safety | Managed resolution has no name-only or last-write-wins fallback. Ambiguous, incomplete, or unsupported exact identity fails closed. |
| Implementation gate | No G02 implementation may begin before H1, the #379 containment gate, is delivered and verified. |
| Closure gate | G02 closes only after external-owner acceptance and versioned external-runtime delivery are verified, followed by managed-adapter integration evidence. |

## Observed boundary

The observed external subagent runtime currently exposes a string/string-array input ABI.

- Current input accepts `agent?: string` and `agents?: string[]`; the tool schema is optional string or string array.
- The current manager resolves a name-keyed definition map.
- Discovery reports `project`, `user`, or `builtin` without `owner` or `normalizedName`; package-name concatenation is lossy and name collisions resolve last-write-wins.
- Current Gentle Pi interception of `subagent_run` supplies edit-surface and review context only. It does not parse, resolve, or rewrite selectors.
- Subsequent drift was review acknowledgement work unrelated to observed G02 boundaries.

These observations identify a missing external contract; they are not a claim that the external runtime has accepted or delivered one.

## Open external-owner questions

1. What exact singular `AgentSelector` ABI represents `{source, owner?, normalizedName}` while preserving `agent?: string | AgentSelector` compatibility?
2. How does the external runtime distinguish a legacy alias string from an exact selector and preserve that distinction across transport without alias or model-override redirection?
3. Which released runtime version first provides the accepted ABI and what compatibility evidence proves unchanged legacy-string behavior?
4. What collision and exact-not-found outcomes are guaranteed instead of name-only or last-write-wins fallback?
5. Does the plural `agents` input accept structured selectors? This decision intentionally does not decide plural behavior. Managed exact fan-out must fail closed until the external owner confirms its contract.

## Required closure evidence

- External-owner acceptance of the singular ABI and its exact structural identity semantics.
- A versioned external-runtime delivery with backward-compatibility evidence for legacy strings.
- External tests for exact lookup, collision rejection, exact-not-found behavior, and no alias/model-override redirection.
- Managed-adapter tests proving the delivered singular selector reaches managed resolution unchanged.
- A current-main readback after H1 delivery; no local compatibility shim substitutes for missing owner evidence.

## Non-goals

This record does not decide plural structured fan-out, define an external release, create issue linkage, claim a capability token, or alter #469. #469 remains separate from A2 and G02.

## Next action

Keep A2 `draft / REVISE`, milestone 10%, and production gaps 0/8. Verify H1 delivery first. In parallel, obtain external-owner acceptance and a versioned singular ABI delivery; until then G02 remains `BLOCKED_EXTERNAL` and managed exact fan-out remains unavailable.
