# feat(agents): freeze managed-execution compatibility contract and execution seam

## Parent and gate

Parent: #419 requires `status:needs-review` for publication. Fresh discovery found remote status drift from that required state. Before any publication, restore `status:needs-review` and read it back; stop if unconfirmed. This draft does not inherit remote status and is not approved or implementation-ready. #379 is OPEN with `status:approved`, not delivered or merged; it is an approved/open prerequisite that must merge before implementation. All bounded children must be created and formally linked before #419 is re-reviewed.

## Outcome

Freeze the existing background-subagent product behavior as compatibility tests and introduce a Gentle-owned execution seam without changing the selected execution authority or production routing.

## Evidence and current limitation

At verified `origin/main` `6451f33cb362dbd001f3d0facc29c7ece6b6905e`, matching the GitHub API SHA for `main`, #419's review evidence says the max-two, foreground/background, writer, and completion-notification rules are prompt policy executed by an external runtime, not a locally enforced scheduler. Current-main code search found no `createAgentSession`, `agent_settled`, `gentle_list_agents`, or `gentle_send_message` implementation. #379 is OPEN with `status:approved`, not delivered or merged; it is the approved/open negative guard and must merge before implementation.

## Included scope

- Capture the current user-owned policy cascade, default-off behavior, command UX, workload eligibility, max-two parent limit, foreground routing, and completion notification as compatibility evidence.
- Define a versioned internal execution seam with explicit authority, capability, and pre-creation-failure boundaries.
- Keep #379's no-external-execution-surface invariant in the seam contract.

## Non-goals

- No task manager, scheduler, AgentSession creation, target-cwd execution, peer transport, policy default change, dual execution, or fallback.
- No claim that an external runtime is compatible after the cutover.

## Normative behavioral contract

The existing background policy remains explicit, user-owned, and default-off. The seam must select one execution authority per task; missing capability stops before task creation and cannot select a pane, terminal, peer, or other external surface. A future Gentle-owned authority must preserve the frozen product behavior until a separately approved contract changes it.

## Dependencies

- #379 must be delivered first.
- This child is the prerequisite for A2, A3, A5b, and A7.

## Acceptance criteria

- [ ] Compatibility tests state the retained policy and routing behavior without treating prompt text as scheduler enforcement.
- [ ] The seam distinguishes authority selection, declared capabilities, pre-creation failure, and runtime-owned task identity.
- [ ] Missing target-cwd or background capability stops before task creation and preserves #379 containment.
- [ ] No existing policy is enabled or broadened automatically.

## Verification

Run focused compatibility and seam tests, then the affected package test command. No packed-install proof applies to this contract-only slice.

## Rollback boundary

Revert only the new seam and its tests; production routing remains on the pre-existing authority.

## Review workload forecast

One contract-and-test work unit.

## Pre-publication measured A+D/test-inventory gate

Before the first publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the complete active register. If it exceeds 400 A+D or 60 minutes, stop before publication; split locally, regenerate the register, counts, topology, parent and #376, update tombstones and hash-bound diffs, rerun exact-title searches and full human validation, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
