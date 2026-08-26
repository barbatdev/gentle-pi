## Problem

A peer is another Gentle Pi session on the same machine and OS user.
Sessions cannot safely find each other, inspect an explicitly trusted project, or send a message without exposing broad tools.

## Goal

Require explicit bilateral trust and local authentication for peer communication.
Support POSIX and supported single-active-user Windows.
Provide exactly these tools:
- `gentle_list_agents`: list available named peers and agents with redacted metadata.
- `gentle_inspect_project`: inspect information only inside an authenticated project root.
- `gentle_send_message`: send a short text message to one named trusted peer and receive whether it was accepted for delivery.

## What this does not do

- Send messages over a network or between distributed systems.
- Support multiple users or shared Windows use.
- Provide generic tools, slash commands, or template execution.
- Change permissions, trust, or configuration.
- Save messages for restart, resume, or recovery.
- Use another delivery method when local delivery is unavailable.

## Acceptance criteria

- [ ] Peer communication requires explicit trust from both peers.
- [ ] The peer list shows only redacted details needed to identify available named peers and agents.
- [ ] Project inspection stays inside the authenticated project root.
- [ ] A short message reports whether it was accepted, rejected, already sent, too late, or the queue is full.
- [ ] An invalid, expired, or already sent message causes no extra delivery.
- [ ] Disabling peer communication leaves no peer tools or listening service, and an unrelated human task is unaffected.
