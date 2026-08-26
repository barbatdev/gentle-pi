## Problem

A user needs to run a delegated task in an existing linked worktree without moving the current session or copying changes.

## Goal

Let a user select an existing linked worktree made for the project.
Check that it can be used and has the resources the task needs before starting.
Run the work through the task mode in #419 while the current session stays where it is.
An unusable worktree starts no task. A failure after start belongs to that same task.

## What this does not do

- Create or prepare worktrees.
- Move or copy tracked, staged, changed, or untracked content.
- Switch the current session.
- Attach terminals or panes, or send messages to another session.
- Use fallback or dual execution.
- Save tasks for later restart, resume, or recovery.

## Acceptance criteria

- [ ] A user can select an existing linked worktree for a delegated task.
- [ ] The current session stays in its original location while the task runs in the selected worktree.
- [ ] An unusable worktree starts no task.
- [ ] A worktree missing required task resources starts no task.
- [ ] A failure after start is recorded by the same task with one clear final result.

## Dependencies

- #419: provides the task mode used to run the work.
- #379: ensures the selected worktree is checked safely before work starts.
