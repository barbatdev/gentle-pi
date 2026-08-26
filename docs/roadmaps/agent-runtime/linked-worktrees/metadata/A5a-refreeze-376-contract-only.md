# Issue #376 contract-only A5a metadata

## Current state

Issue #376 is published and awaits review. A5a is retained as metadata for the accepted contract boundary; it is not a new issue, implementation authorization, or pending publication procedure.

## Durable review artifacts

All paths in this table are relative to the roadmap root.

| Artifact | Path | Status and purpose |
| --- | --- | --- |
| Historical pre-current body | `parents/376/previous-body.md` | Historical remote snapshot retained for evidence; it is not the current body. |
| Current published body | `parents/376/body.md` | Exact current parent-body snapshot. |
| Current published title | `parents/376/title.txt` | Exact current parent-title snapshot. |

No standalone review-diff artifact is retained. Compare the historical snapshot and current body only when that historical context is needed.

## Contract boundary

The current #376 body is the normative managed target-cwd contract and parent/gate for A5b. It grants no implementation authority by itself.

It establishes one Gentle task manager as the sole managed-task authority; explicit target-cwd validation and normal host lifecycle loading before task publication; no ID on a pre-publication failure; one process-local terminal identity/result while the manager remains alive and no restart recovery claim; an unchanged owner cwd; no dirty-content transfer; #379 as an approved/open prerequisite that must merge before A5b implementation; #371 as diagnostic-only and never provisioning; #347 as the owner-session-switch owner; and no per-task failover.

## Historical publication record

The parent title and body were published and read back before this durable record. Any future change requires fresh discovery, explicit authorization, an in-place update of the existing issue, and readback of the exact changed title/body; it must not create a replacement issue.

## Non-goals

- GitHub mutation without explicit authorization and fresh discovery.
- Any repository or runtime implementation.
- A replacement issue, execution-surface expansion, owner-session switch, configuration provisioning, or task-authority fallback.

## Retention

A5a preserves the contract-only publication context. The historical body remains evidence only; `parents/376/body.md` is the current durable snapshot.
