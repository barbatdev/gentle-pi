# Managed execution forecast

This is a bounded forecast for the published-needs-review parent, not measured evidence and not implementation authorization. Before review or delivery, record actual `git diff --numstat` additions/deletions/A+D and focused plus regression test evidence for every row. Any row above 400 A+D or 60 minutes must stop, split, regenerate this roadmap, recapture duplicates, and obtain new authorization. No test has run.

| # | Unit | Add | Del | A+D | Min | Paths | Focused | Regression | No-growth trigger |
| ---: | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | A1 | 150 | 10 | 160 | 30 | `extensions/gentle-ai.ts`; `lib/managed-execution.ts`; `tests/managed-execution.test.ts` | `node --experimental-strip-types --test tests/managed-execution.test.ts` | `pnpm test` | scheduler, task-manager, or routing growth |
| 2 | A2 | 210 | 15 | 225 | 45 | `extensions/gentle-ai.ts`; `lib/agent-definition-resolution.ts`; `tests/agent-definition-resolution.test.ts`; `tests/fixtures/agent-definitions/` | `node --experimental-strip-types --test tests/agent-definition-resolution.test.ts` | `pnpm test` | launch, adapter, or packed-proof growth |
| 3 | A3 | 250 | 10 | 260 | 50 | `lib/managed-task-store.ts`; `lib/managed-task-directory.ts`; `tests/managed-task-store.test.ts` | `node --experimental-strip-types --test tests/managed-task-store.test.ts` | `pnpm test` | cancellation orchestration or public integration growth |
| 4 | A4 | 310 | 25 | 335 | 55 | `lib/managed-task-store.ts`; `lib/managed-task-lifecycle.ts`; `tests/managed-task-lifecycle.test.ts` | `node --experimental-strip-types --test tests/managed-task-lifecycle.test.ts` | `pnpm test` | target-cwd, handoff, or routing growth |
| 5 | A6a | 250 | 5 | 255 | 45 | `lib/owner-admission-lease.ts`; `tests/owner-admission-lease.test.ts` | `node --experimental-strip-types --test tests/owner-admission-lease.test.ts` | `pnpm test` | replacement, persistence, or routing growth |
| 6 | A7a1 | 260 | 5 | 265 | 50 | `tests/packed-managed-execution.test.ts`; `tests/fixtures/packed-managed-execution/`; `scripts/test-packed-managed-execution.mjs` | `node --experimental-strip-types --test tests/packed-managed-execution.test.ts` | `pnpm test && pnpm run test:packed-package` | adapter proof, routing, or absence-proof growth |
| 7 | A7b1 | 270 | 10 | 280 | 50 | `lib/future-routing-transaction.ts`; `tests/future-routing-transaction.test.ts` | `node --experimental-strip-types --test tests/future-routing-transaction.test.ts` | `pnpm test` | product cutover, rollback client, or coupling work |
| 8 | A7b2 | 260 | 15 | 275 | 50 | `lib/managed-routing-cutover.ts`; `tests/managed-routing-cutover.test.ts` | `node --experimental-strip-types --test tests/managed-routing-cutover.test.ts` | `pnpm test` | coupling inventory/removal or handoff growth |
| 9 | A7c1 | 230 | 0 | 230 | 45 | `lib/managed-routing-coupling-inventory.ts`; `docs/provenance/managed-routing-coupling-inventory.md`; `tests/managed-routing-coupling-inventory.test.ts` | `node --experimental-strip-types --test tests/managed-routing-coupling-inventory.test.ts` | `pnpm test` | selected removal, package/config mutation, or absence proof |

Arithmetic is exact for all nine rows. Maximum is 335 A+D and 55 minutes. A5b is not in this forecast and no A7 row depends on it.
