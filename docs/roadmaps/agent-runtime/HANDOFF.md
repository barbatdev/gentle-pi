# Agent-runtime handoff

Refresh this operational card at every stopping point. `manifest.json` and `TRACKER.md` remain canonical.

## Verified baseline

- Roadmap branch authority: `refs/heads/docs/agent-runtime-roadmaps` on `barbatdev/gentle-pi`, not the fork default `main`.
- Durable baseline: pinned remote HEAD `e46f45a2da7cb5705f6e827871c003e2a146bcda`; this candidate is uncommitted and no future commit hash is asserted.
- Upstream implementation evidence pin: `Gentleman-Programming/gentle-pi:main` at `1288fa36cdfd289b7335c3d566c0bf098dedc342`. Subsequent drift was review acknowledgement work unrelated to observed G02 boundaries.
- A2 closure program: `managed-execution/A2-CLOSURE-PROGRAM.md` (`a9d313446bc20c13002be4202c1e2a30ec10b6cc6732c22c2909afc3fe353053`).
- Last completed integrity result before this candidate: 82 files and 81 checksums.

## Current state

- #419 is OPEN `status:needs-review`.
- #376 is OPEN `status:needs-review`.
- #442 is OPEN `status:needs-review`.
- #379 is OPEN `status:approved` as the formal implementation-start containment gate; #354 is OPEN `status:approved` as delivery/install acceptance alignment after technical closure.
- A1 is published as #447 (https://github.com/Gentleman-Programming/gentle-pi/issues/447), OPEN `status:needs-review` and `type:feature`, and appears exactly once as a native sub-issue of #419.

## Now

A2 is `draft / REVISE`: D-016, D-017, and D-018 leave milestone 10% unchanged, while 0/8 production gaps are closed and G01-G08 remain open. G07 executable boundary, metric, operational, and rollback proof remains pending. D-018 assigns G02 singular structured-selector transport to the external runtime and managed-adapter consumption to Gentle Pi; G02 is `BLOCKED_EXTERNAL`. The active program is the durable closure plan above; it does not authorize implementation, public issue publication, or upstream mutation.

## Open gates

The #379/#354 dependency classification is complete: Separate semantics keeps #379 as the fail-closed implementation-start containment gate and removes #354 from the A2 technical dependency graph. D-017 selects G07 option B: maximum 16 normalized candidates per source kind and 64 total; executable G07 proof remains pending and no implementation is authorized. D-018 requires an external-owner accepted, versioned, backward-compatible singular selector ABI; legacy strings remain unchanged, exact identity is structural, and plural managed exact fan-out fails closed until confirmed. #354 remains delivery/install acceptance alignment after technical closure. A5b remains one-way after delivered A1-A4 and an updated, re-reviewed, freshly accepted #376. Parent review states do not authorize child publication or implementation.

## Resume path

1. Read `HANDOFF.md`, then `BACKLOG.md`, and read back `managed-execution/A2-CLOSURE-PROGRAM.md` against its pinned hash.
2. Read `TRACKER.md` and `manifest.json` for canonical state and inventory.
3. Do not re-prompt D-016, D-017, or D-018: selected G07 option B is 16 normalized candidates per source kind and 64 total; G02 transport ownership is external and managed-adapter consumption is Gentle Pi-only.
4. H1: verify/deliver #379 containment gate (PR #387 or verified successor) on the pinned upstream evidence line.
5. Obtain external-owner acceptance and versioned singular ABI delivery for G02; until then G02 is `BLOCKED_EXTERNAL` and managed exact fan-out is unavailable.
6. Execute only the next dependency-ready work unit with its required runtime evidence, terminal review, and separate authorization where applicable; these decisions do not authorize implementation.
7. Stop on ledger-branch or upstream-authority drift affecting evidence, unavailable external owner/interface, destructive or publication mutation, an unresolved product decision, or a second failed verification gate. #469 remains separate and is not an A2 prerequisite.

## Non-actions

This handoff does not authorize implementation, a PR, approval, public issue publication, or upstream mutation.
