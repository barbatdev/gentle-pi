# Agent-runtime decision log

Append new durable decisions only. Historical decision dates were not preserved in the ledger, so the entries below are marked `Recorded 2026-08-26`; that is the record date, not a claimed decision date.

| ID | Record date | Decision | Rationale | Affected units | Supersedes or tombstones |
| --- | --- | --- | --- | --- | --- |
| D-001 | Recorded 2026-08-26 | Keep three separate parents: #419, #376, and #442. | The roadmap has three distinct scopes and review surfaces. | A1-A7c1, A5a-A5b, B1-B7e | None |
| D-002 | Recorded 2026-08-26 | Publish parents first and children just in time. | Parents remain concise review surfaces while the ledger retains detailed contracts; no bulk child publication follows from a parent state. | All active children | None |
| D-003 | Recorded 2026-08-26 | Keep #419 same-cwd managed execution independent of #376 and peer completion. | A5b consumes A1-A4 one way; #419 does not wait for A5b, and neither parent waits for peer work. | A1-A7c1, A5b, B1-B7e | None |
| D-004 | Recorded 2026-08-26 | Tombstone A6b1 under YAGNI. | The speculative process-host authority adapter is outside the same-cwd managed-execution scope and has no replacement contract. | A6b1 | A6b1 is tombstoned; no successor |
| D-005 | Recorded 2026-08-26 | Make #376 one-way after delivered A1-A4. | Target-cwd integration consumes the delivered managed-execution foundation without blocking #419 completion. | A1-A4, A5b | A5 split into A5a and A5b |
| D-006 | Recorded 2026-08-26 | Bound peer v1 to local same-user, process-local operation with no recovery boundary. | The peer roadmap explicitly excludes cross-machine delivery, durable mailbox/history, and same-user malicious-process isolation claims. | B1-B7e | None |
| D-007 | Recorded 2026-08-26 | Split peer authority: B2 owns trust, credentials, and revocation decisions; B6 owns delivery admission, ACKs, dedupe, queue, and turn state. | This prevents platform and credential slices from acquiring delivery authority. | B2a, B2b1, B2b2, B6a, B6b1, B6c, B6d | B2 and B6 tombstones preserve the earlier combined scopes |
| D-008 | Recorded 2026-08-26 | Do not claim selective dequeue for Pi follow-up entries after handoff. | The ledger records no supported selective removal for the exact `deliverAs:'followUp'` entry; cancellation stays correlated and bounded. | B2b2, B6a, B6b1, B6c, B6d | None |
| D-009 | Recorded 2026-08-26 | Limit peer-principal authority to exactly three wrapper fingerprints. | The allowlist is the immutable fingerprints for `gentle_inspect_project`, `gentle_list_agents`, and `gentle_send_message`; name-only authority is forbidden. | B6b1, B7a, B7b | None |
| D-010 | Recorded 2026-08-26 | Preserve tombstones and invalidate forecasts whenever a work unit splits. | Splits retain decision history and require regenerated counts, topology, hashes, and publication evidence before new authorization. | A5, A6, A7, B2, B4, B5, B6, B7 and successors | Existing tombstones retain successor mappings |
| D-011 | Recorded 2026-08-26 | Treat this ledger branch as the source of truth for the internal roadmap. | The manifest, tracker, work-unit contracts, tombstones, and integrity records are the durable internal record; public parents stay concise. | Entire ledger | None |
