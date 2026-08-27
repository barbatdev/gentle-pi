# Agent-runtime handoff

Refresh this operational card at every stopping point. `manifest.json` and `TRACKER.md` remain canonical.

## Verified baseline

- Roadmap branch: `docs/agent-runtime-roadmaps`.
- Parent baseline: `cfbb544e2a0ae8f9f8eaa8b5a28c266f2d407c24` on that branch. This is the parent baseline, not a claim about the current commit.
- Official base: `425c226252a800dfd011ef2248575ffcb706872a`.
- Last completed integrity result before this update: 76 files and 75 checksums.

## Current state

- #419 is OPEN `status:needs-review`.
- #376 is OPEN `status:needs-review`.
- #442 is OPEN `status:needs-review`.
- #379 is OPEN `status:approved`; #354 is OPEN `status:approved`.
- A1 is published as #447 (https://github.com/Gentleman-Programming/gentle-pi/issues/447), OPEN `status:needs-review` and `type:feature`, and appears exactly once as a native sub-issue of #419.

## Now

A1 is published-needs-review. Resume only through #447 and #419 maintainer review/approval gates and delivered prerequisite evidence before implementation.

## Open gates

#379 is approved/open but not evidenced as delivered or merged. #354 is approved/open and is an A2 prerequisite. A5b remains one-way after delivered A1-A4 and an updated, re-reviewed, freshly accepted #376. Parent review states do not authorize child publication or implementation.

## Resume path

1. Read `HANDOFF.md`, then `BACKLOG.md`.
2. Read `TRACKER.md` and `manifest.json` for canonical state and inventory.
3. Read `publication-drafts/A1/` and `metadata.json` before the full A1 contract.
4. Read `managed-execution/active/A1-managed-execution-compatibility-seam.md` for the current work-unit contract.
5. Read `DECISIONS.md` only when durable rationale is needed.
6. Run `sha256sum -c SHA256SUMS` and `python3 -m json.tool manifest.json >/dev/null` from this directory before relying on the ledger.

## Non-actions

This handoff does not authorize implementation, a PR, approval, or upstream mutation.
