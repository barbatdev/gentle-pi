# Linked worktrees forecast

This is a bounded forecast for the published-needs-review parent, not measured evidence and not implementation authorization. Before review or delivery, record actual `git diff --numstat` additions/deletions/A+D and focused plus regression test evidence. Above 400 A+D or 60 minutes stops, splits, regenerates this roadmap, recaptures duplicates, and requires new authorization. No test has run.

| Unit | Add | Del | A+D | Min | Paths | Focused | Regression | Dependency | No-growth trigger |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| A5b | 260 | 20 | 280 | 50 | `extensions/gentle-ai.ts`; `lib/managed-target-cwd.ts`; `tests/managed-target-cwd.test.ts` | `node --experimental-strip-types --test tests/managed-target-cwd.test.ts` | `pnpm test` | #379 merged; fresh-reviewed #376; delivered A1-A4 | session switch, provisioning, or fallback growth |

Arithmetic is exact. A5b consumes delivered A1-A4 one way. #419 completion does not wait for it. Preserve owner cwd, validation before identity, no content transfer, fallback, persistence, or recovery.
