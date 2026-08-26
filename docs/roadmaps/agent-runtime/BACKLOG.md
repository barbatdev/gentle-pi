# Agent-runtime operational backlog

Operational priority is not canonical inventory or state. `manifest.json` and `TRACKER.md` remain canonical; this backlog only names the next observable work.

## Now

| ID | Parent | Current state | Dependencies or gate | Next observable exit condition |
| --- | --- | --- | --- | --- |
| A1 | #419 | draft | #419 is OPEN `status:needs-review`; #379 is OPEN `status:approved` and not evidenced as delivered or merged. | Prepare and audit the A1 issue draft only. Stop for separate explicit publication authorization. |

## Next

These drafts are ordered by dependency and are not ready for bulk publication.

| ID | Parent | Current state | Dependencies or gate | Next observable exit condition |
| --- | --- | --- | --- | --- |
| A2 | #419 | draft | A1; #379, #354, #327, #381, and #382 gates. | Re-read prerequisites after A1's separate publication decision, then prepare only when its gates are evidenced. |
| A3 | #419 | draft | A1 and A2. | Wait for delivered A1 and A2; then prepare the A3 draft under separate authorization. |
| A4 | #419 | draft | A3. | Wait for delivered A3; then prepare the A4 draft under separate authorization. |

## Later

| IDs | Parent | Current state | Dependencies or gate | Next observable exit condition |
| --- | --- | --- | --- | --- |
| A6a, A7a1, A7b1, A7b2, A7c1 | #419 | draft | Follow the active dependency DAG in `TRACKER.md`; #419 completion is independent of #376 and #442. | Re-enter after the A1 through A4 sequence has delivered the required predecessors. |
| A5b | #376 | draft | #379; delivered A1 through A4; #376 updated in place, re-reviewed, and freshly accepted. | Start only after all one-way A1 through A4 prerequisites and the #376 gate are evidenced. |
| B1, B2a, B2b1, B6a | #442 | draft | Foundation order: B1, then B2a, then B2b1, then B6a. | Prepare only the next dependency-ready peer draft after #442 and its predecessor gates are evidenced. |
| B2b2, B3, B4a, B4b1, B4b2, B5a, B5b1, B5b2, B6b1, B6c, B6d, B7a, B7b, B7c, B7d, B7e | #442 | draft | Remaining peer DAG in `TRACKER.md`. | Re-enter only when the exact row's dependencies are delivered and the parent gate is evidenced. |

## Blocked and external gates

| Gate | Verified state | Operational consequence |
| --- | --- | --- |
| #419 | OPEN `status:needs-review` | Parent review state is not child publication or implementation authorization. |
| #376 | OPEN `status:needs-review` | A5b remains gated until its in-place update, re-review, and fresh acceptance are evidenced. |
| #442 | OPEN `status:needs-review` | Peer drafts remain gated; no peer child is published. |
| #379 | OPEN `status:approved` | Approved/open prerequisite only; do not claim delivery or merge. |
| #354 | OPEN `status:approved` | Approved/open prerequisite for A2 only; do not claim delivery or merge. |

## Operating rule

Use this order to resume work, then read `TRACKER.md`, `manifest.json`, and the referenced work-unit contract for the canonical state and full contract. Refresh this backlog at every stopping point when operational priority or an observable exit condition changes.
