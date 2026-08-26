# Agent-runtime roadmap ledger

## Decision

This directory is the durable, versioned source of truth for the three agent-runtime roadmaps. GitHub parent issues remain concise review surfaces; detailed work-unit contracts, forecasts, dependencies, tombstones, and hashes live here.

## Quick recovery

1. Read `manifest.json` for the canonical inventory and expected counts.
2. Read `TRACKER.md` to find a parent or stable work-unit ID.
3. If a source and canonical hash differ, read and validate both `NORMALIZATION.md` and `normalization.json` before treating the difference as accepted.
4. Read the linked local artifact, then verify it with `sha256sum -c SHA256SUMS`.
5. Before changing state, update the artifact, manifest hashes, tracker hash, normalization record when applicable, and `SHA256SUMS` together.

Historical snapshots at `parents/419/previous-body.md` and `parents/376/previous-body.md` preserve exact remote bytes, including their blank lines at EOF. The local `.gitattributes` exception disables only the `blank-at-eof` whitespace check for those two exact paths; all other Git whitespace checks remain active.

## State machine

Allowed states are finite: `draft`, `ready`, `published-needs-review`, `published-approved`, `in-progress`, `blocked`, `done`, `tombstoned`, and `metadata` (A5a only). Parents are `published-needs-review`; all active children are `draft`; tombstones are `tombstoned`; A5a is `metadata`. A split tombstones the old ID and records its successors; it never deletes decision history.

## Update rules

- Keep all detailed internal contracts, budgets, forecasts, dependency edges, and tombstones here.
- When a source/canonical hash differs, validate `NORMALIZATION.md` and `normalization.json`; record any new difference with finite rule IDs, source/canonical hashes, and aggregate counts before accepting it.
- Do not invent issue URLs, branches, PRs, test results, measured numstat, or delivery evidence: use `null`/`TBD` in JSON and `-` in Markdown.
- Record child publication only after its remote readback; keep parent body/title snapshots separate for byte-level comparison.
- Resolve every dependency to a parent, active unit, tombstone successor mapping, or known public issue; keep the active graph acyclic.
- Keep #419 completion independent of #376 and peer work; A5b depends one-way on delivered A1-A4.

## Verification

```bash
cd docs/roadmaps/agent-runtime
sha256sum -c SHA256SUMS
python3 -m json.tool manifest.json >/dev/null
python3 -m json.tool normalization.json >/dev/null
git check-attr whitespace -- parents/419/previous-body.md parents/376/previous-body.md
# Required whenever source and canonical hashes differ:
# read NORMALIZATION.md and validate every normalization.json entry.
find . -type f -name '*.md' | sort
# Regenerate after an intentional update (run from this directory):
find . -type f ! -name SHA256SUMS -print0 | sort -z | xargs -0 sha256sum > SHA256SUMS
```

## Public vs. internal

Parent snapshots in `parents/` preserve exact published review bodies and titles. Their public bodies should stay concise. The remaining files are internal roadmap records: they preserve the implementation plan and must not be copied wholesale into a public issue body.
