## Problem

Delegated tasks can start in different ways, so their state, cancellation, and final result are not handled consistently in one place.

## Goal

Add an optional managed task mode for work in the current working directory.
A task is one piece of delegated work. It has one task ID, a visible status, and one final result.
The task definition is checked before work starts. Foreground and background work follow the same steps from start through final result.

## What this does not do

- Run work in linked worktrees.
- Send messages to other sessions.
- Save tasks for later restart, resume, or recovery.
- Move work between task runners if one fails.
- Turn the mode on automatically.

## Acceptance criteria

- [ ] The mode is off by default, and current behavior stays unchanged.
- [ ] An invalid task definition starts no task and receives no task ID.
- [ ] A valid task receives one task ID and has a visible status.
- [ ] Foreground and background work follow the same steps from start through final result.
- [ ] Cancellation or shutdown leaves each started task with one clear final result.
- [ ] Turning the mode off restores current behavior without moving or recreating tasks.

## Dependencies

- #379: prevents work from starting when it cannot run safely.
- #354: defines how the task definition behaves.
