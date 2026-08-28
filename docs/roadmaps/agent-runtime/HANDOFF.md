# Agent-runtime handoff

Refresh this operational card at every stopping point. `manifest.json` and `TRACKER.md` remain canonical.

## Verified baseline

- Roadmap branch authority: `refs/heads/docs/agent-runtime-roadmaps` on `barbatdev/gentle-pi`, not the fork default `main`.
- Durable baseline: candidate parent `9c7705263bb076a5548583078f4c2d23cb92b575` until this candidate has a commit; no future commit hash is asserted.
- Upstream implementation evidence pin: `Gentleman-Programming/gentle-pi:main` at `a3d87c196268774c8989169e45634e9b46066881`.
- A2 closure program: `managed-execution/A2-CLOSURE-PROGRAM.md` (`32dcd30ab008297b48d755fb886828eb95591e84e44f7a52b89c6f518214bf36`).
- Last completed integrity result before this candidate: 82 files and 81 checksums.

## Current state

- #419 is OPEN `status:needs-review`.
- #376 is OPEN `status:needs-review`.
- #442 is OPEN `status:needs-review`.
- #379 is OPEN `status:approved`; #354 is OPEN `status:approved`.
- A1 is published as #447 (https://github.com/Gentleman-Programming/gentle-pi/issues/447), OPEN `status:needs-review` and `type:feature`, and appears exactly once as a native sub-issue of #419.

## Now

A2 is `draft / REVISE`: 0/8 production gaps are closed. G01-G08 remain open. The active program is the durable closure plan above; it does not authorize implementation, public issue publication, or upstream mutation.

## Open gates

The next human decision packet is #379/#354 classification first, then G07 A/B/C policy. #379 containment remains a fail-closed delivery gate until its applicable upstream delivery is verified. #354 classification and G07 policy are genuine maintainer decisions. A5b remains one-way after delivered A1-A4 and an updated, re-reviewed, freshly accepted #376. Parent review states do not authorize child publication or implementation.

## Resume path

1. Read `HANDOFF.md`, then `BACKLOG.md`, and read back `managed-execution/A2-CLOSURE-PROGRAM.md` against its pinned hash.
2. Read `TRACKER.md` and `manifest.json` for canonical state and inventory.
3. Collect the #379/#354 classification decision; then collect the G07 A/B/C decision.
4. Wait for and verify #379 containment delivery on the pinned upstream evidence line.
5. Execute only the next dependency-ready work unit with its required runtime evidence, terminal review, and separate authorization where applicable.
6. Stop on ledger-branch or upstream-authority drift affecting evidence, unavailable external owner/interface, destructive or publication mutation, an unresolved product decision, or a second failed verification gate. #469 remains separate and is not an A2 prerequisite.

## Non-actions

This handoff does not authorize implementation, a PR, approval, public issue publication, or upstream mutation.
