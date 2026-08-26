# test(peers): prove packed Windows peer transport

## Parent and status gate
Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. B5a and B5b1 must be created, formally linked, reviewed, and accepted before implementation.

## Outcome
Prove the supported Windows single-active-OS-user peer transport through a clean Windows CI package installation, with no source fallback.

## Evidence and scope
The Windows lane is releasable only when the packed artifact proves a real named pipe, B5a endpoint/connection authentication handoff, B6a canonical-envelope/MAC authority, lifecycle, shutdown, endpoint-record reclaim, and redaction in the declared single-user environment. Shared or multi-user Windows use is unsupported; the proof documents that boundary but does not claim to detect every logged-in user or prove named-pipe DACL isolation.

## Included scope
- Clean Windows CI `npm pack`/install in the declared single-active-OS-user environment, with no source checkout or source fallback.
- Real named-pipe endpoint, B5a endpoint/connection authentication, immutable platform-authentication context handoff, B6a canonical-envelope/MAC/signature validation, lifecycle, shutdown, endpoint-record/connect-probe reclaim, and redaction tests.
- Explicit proof that the packed lane neither treats a named pipe as a filesystem nor publishes endpoint-record paths or pipe names on public surfaces.

## Non-goals
No endpoint implementation or lifecycle redesign; no current-user-only named-pipe endpoint or DACL-isolation claim; no attempt to detect all logged-in users; no filesystem-pipe cleanup; no POSIX proof; no adapter-owned canonical-envelope/MAC validation, ACK/dedupe/queue/turn ownership, trust/credential mutation, durable mailbox/history, or retry.

## Normative contract
The Windows CI harness installs only the packed package in a clean declared single-active-OS-user environment and fails if source checkout resolution or source fallback is possible. It exercises a real named pipe; B5a endpoint/connection challenge authentication with B2b1 credential/fingerprint material; immutable platform-authentication-context handoff; B6a-only canonical-envelope field and MAC/signature validation; B5b1 heartbeat, stale, failed-connect/exact-tuple endpoint-record reclaim, matching-generation closure, and `session_shutdown`; and public-surface redaction of credential material, endpoint-record paths, and pipe names.

The proof documents that shared or multi-user hosts are unsupported. It does not claim that the tests detect every logged-in user, that the runtime detects multi-user hosts, or that a named-pipe DACL isolates the current user. It proves no pipe-namespace unlink, reparse, symlink, or filesystem-cleanup behavior, and confirms that record reclaim removes only the stale private endpoint record while pipe lifetime ends when the server handle closes. It also proves that B5a does not validate the canonical envelope or MAC/signature, decide B2b2 revocation, or own ACK/dedupe/queue/turn behavior; B6a is the sole canonical-envelope, MAC/signature, ACK, dedupe, queue, and turn authority. Rollback proof confirms disabling the packaged transport does not retry, reroute, or create another delivery authority.

## Dependencies
B5a and B5b1 only.

## Acceptance criteria
- [ ] Clean Windows CI `npm pack`/install runs in the declared single-active-OS-user environment and has no source checkout or fallback.
- [ ] The packed artifact proves a real named pipe, B5a endpoint/connection authentication and immutable context handoff, B6a-only canonical-envelope/MAC/signature validation, lifecycle, shutdown, endpoint-record reclaim, and redaction.
- [ ] The unsupported shared/multi-user scope is explicit without a claim to detect all logged-in users or prove DACL isolation.
- [ ] Tests prove no pipe-namespace unlink, reparse, symlink, or filesystem-cleanup behavior; reclaim removes only the stale private endpoint record and server-handle closure ends pipe lifetime.
- [ ] Public output redacts credential material, endpoint-record paths, and pipe names.
- [ ] The packed proof confirms B5a has no canonical-envelope/MAC, B2b2 revocation, ACK, dedupe, queue, or turn authority, and B6a remains sole delivery authority.
- [ ] Rollback introduces no retry, reroute, source fallback, or alternate ACK/dedupe/queue/turn authority.

## Verification
Run clean packed Windows CI and affected package tests in the declared single-user environment; capture only redacted output and assert no source fallback, no pipe-namespace filesystem operation, and B6a-only delivery authority.

## Rollback
Remove the proof harness only; do not add a source fallback, pipe-namespace filesystem operation, or alternate delivery path.

## Pre-publication measured A+D/test-inventory gate
Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
