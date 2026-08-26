# Agent-runtime handoff

Refresh this operational card at every stopping point. `manifest.json` and `TRACKER.md` remain canonical.

## Verified baseline

- Roadmap branch: `docs/agent-runtime-roadmaps`.
- Fork remote baseline: `860a8eca7c33097ad7bae1f8ddd1c5fe01105993` on that branch. This is the parent baseline, not a claim about the current commit.
- Official base: `425c226252a800dfd011ef2248575ffcb706872a`.
- Last completed integrity result before this update: 70 files and 69 checksums.

## Current state

- #419 is OPEN `status:needs-review`.
- #376 is OPEN `status:needs-review`.
- #442 is OPEN `status:needs-review`.
- #379 is OPEN `status:approved`; #354 is OPEN `status:approved`.
- No child issue is published.

## Now

Prepare and audit the A1 issue draft only. Publication requires separate explicit authorization.

## Open gates

#379 is approved/open but not evidenced as delivered or merged. #354 is approved/open and is an A2 prerequisite. A5b remains one-way after delivered A1-A4 and an updated, re-reviewed, freshly accepted #376. Parent review states do not authorize child publication or implementation.

## Resume path

1. Read `HANDOFF.md`, then `BACKLOG.md`.
2. Read `TRACKER.md` and `manifest.json` for canonical state and inventory.
3. Read `managed-execution/active/A1-managed-execution-compatibility-seam.md` for the current work-unit contract.
4. Read `DECISIONS.md` only when durable rationale is needed.
5. Run `sha256sum -c SHA256SUMS` and `python3 -m json.tool manifest.json >/dev/null` from this directory before relying on the ledger.

## Non-actions

This handoff does not authorize issue publication, implementation, a PR, or upstream mutation.
