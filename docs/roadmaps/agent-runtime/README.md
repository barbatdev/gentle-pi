# Agent-runtime roadmap ledger

## Decision

This directory is the durable, versioned source of truth for the three agent-runtime roadmaps. GitHub parent issues remain concise review surfaces; detailed work-unit contracts, forecasts, dependencies, tombstones, and hashes live here.

## Quick recovery

1. Read `HANDOFF.md` for the verified resume point and current non-actions.
2. Read `BACKLOG.md` for operational priority.
3. Read `TRACKER.md` and `manifest.json` for canonical inventory and state.
4. For a `ready` unit, read its audited publication draft in `publication-drafts/<ID>/` before any separate publication decision.
5. Read the referenced work-unit contract.
6. Read `DECISIONS.md` only when durable rationale is needed.
7. If a source and canonical hash differ, read and validate both `NORMALIZATION.md` and `normalization.json` before treating the difference as accepted.
8. Verify the ledger with `sha256sum -c SHA256SUMS`.

`HANDOFF.md` and `BACKLOG.md` are operational aids. `manifest.json` and `TRACKER.md` remain canonical for inventory and state.

Historical snapshots at `parents/419/previous-body.md` and `parents/376/previous-body.md` preserve exact remote bytes, including their blank lines at EOF. The local `.gitattributes` exception disables only the `blank-at-eof` whitespace check for those two exact paths; all other Git whitespace checks remain active.

## State machine

Allowed states are finite: `draft`, `ready`, `published-needs-review`, `published-approved`, `in-progress`, `blocked`, `done`, `tombstoned`, and `metadata` (A5a only). Parents are `published-needs-review`; active children are `draft` except audited `ready` publication drafts; tombstones are `tombstoned`; A5a is `metadata`. `ready` requires audit and never authorizes publication or implementation. A split tombstones the old ID and records its successors; it never deletes decision history.

## Manifest registries

`manifest.json` schema v2 keeps public contracts and validation evidence outside `units`. Registry membership records durable ledger inventory; it does not approve publication, implementation, delivery, or a work-unit state change.

### `public_contracts`

Each record requires:

- `issue_number`: positive GitHub issue number;
- `parent`: canonical parent identifier in `#<number>` form;
- `remote_state`: `open` or `closed`, observed during the record's remote readback;
- `status_label`: the exact observed `status:*` label, or `null` when no such label is present;
- `relationship`: stable relationship identifier;
- `native_linkage_evidence`: object containing `status` (`proven` or `unproven`), `linked_unit_ids` (array of canonical unit IDs), and a non-empty `basis`;
- `issue_url`: canonical upstream issue URL;
- `path`: ledger-relative body snapshot path;
- `body_sha256`: lowercase SHA-256 of that exact snapshot.

A public-contract record is not a `units` entry. `unproven` linkage never creates a unit mapping, dependency edge, or native-child claim. Remote state fields are readback observations at the ledger update that records them, not permanent properties of the issue.

### `evidence_records`

Each record requires:

- `unit_id`: existing canonical unit ID;
- `evidence_set`: stable grouping identifier;
- `path`: ledger-relative artifact path;
- `role`: stable artifact-role identifier;
- `claim_scope`: bounded statement of what the evidence evaluates;
- `basis`: non-empty statement of the evidence limits;
- `sha256`: lowercase SHA-256 of the exact artifact;
- `execution`: `null` for passive evidence, or a validation-only object containing `mode`, `production`, `command`, `assertions_passed`, and `assertions_total`.

When `execution` is present, `mode` must be `validation-only`, `production` must be `false`, and assertion counts must be non-negative integers with `assertions_passed` no greater than `assertions_total`. Evidence records have no unit-state or approval field and cannot upgrade the referenced unit.

An empty registry means no records are registered in this ledger yet. It does not prove that no matching public contract or evidence exists elsewhere.

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

## End-of-session protocol

1. Update `HANDOFF.md` and `BACKLOG.md` with the verified stopping point and operational exit conditions.
2. Record only newly evidenced durable decisions in `DECISIONS.md`.
3. Update `TRACKER.md`, `manifest.json`, and audited publication-draft records only if their canonical state changed.
4. Regenerate `SHA256SUMS` last, then perform structural readback and integrity validation.
5. Commit to this same branch only under separate authorization.

## Public vs. internal

Parent snapshots in `parents/` preserve exact published review bodies and titles. Their public bodies should stay concise. The remaining files are internal roadmap records: they preserve the implementation plan and must not be copied wholesale into a public issue body.
