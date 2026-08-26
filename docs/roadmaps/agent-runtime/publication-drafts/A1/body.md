Parent: #419

## Problem

Today, delegated work uses the existing execution behavior.
#419 needs an optional managed mode without changing that behavior by default.
The routing choice must be clear before any delegated work starts.

## Goal

Add one optional, default-off selection point for eligible same-cwd delegated work.
When disabled, it keeps the current foreground and background behavior.
When selected, it records one execution choice for eligible work; this slice does not implement managed execution or switch production behavior.

## What this does not do

- Define or validate task definitions.
- Create task records, lifecycle handling, cancellation, or shutdown behavior.
- Run work in linked worktrees or send messages to peer sessions.
- Run duplicate or fallback work.
- Change production defaults or deliver the managed execution implementation.

## Acceptance criteria

- [ ] The managed mode is off by default, and current delegated-work behavior is unchanged.
- [ ] Eligible same-cwd delegated work has one selection point for the managed mode.
- [ ] Current foreground and background return behavior is preserved when the mode is disabled.
- [ ] An unsupported managed selection fails closed under #379 before alternate work starts.
- [ ] Focused compatibility tests cover disabled behavior and the single execution-choice boundary.

## Dependencies

- #379: prevents unsupported execution from starting alternate work.
