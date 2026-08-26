# feat(peers): add directory and bounded-message peer tools

## Parent and status gate

Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. It must be created, formally linked, reviewed, and accepted before peer-parent re-review.

## Outcome

Expose a redacted peer directory and one bounded peer-send request while preserving B3, B6a, B6b1, and platform-lane authority boundaries.

## Evidence and scope

B3 owns addressability and its read-only projection. B6a owns delivery admission. B6b1 owns the correlated peer principal and platform-lane registration SPI. This child supplies narrow peer-facing wrappers only.

## Included scope

- Register `gentle_list_agents` with this closed JSON Schema. It has no required keys and rejects every undeclared field.

  ```json
  {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "entity_type": {
        "type": "string",
        "enum": ["named_peer", "managed_task"]
      },
      "query": {
        "type": "string",
        "minLength": 1,
        "maxLength": 128
      },
      "limit": {
        "type": "integer",
        "minimum": 1,
        "maximum": 50,
        "default": 50
      }
    }
  }
  ```

  When `entity_type` is omitted, its runtime default is all currently available variants; this dynamic omission default has no enum value to encode as a JSON Schema `default`. When `query` is omitted, it applies no filter. When `limit` is omitted, it defaults to 50.
- Register `gentle_send_message` with this closed JSON Schema. The required keys are exactly `target_peer_id` and `text`; it accepts no optional properties.

  ```json
  {
    "type": "object",
    "additionalProperties": false,
    "required": ["target_peer_id", "text"],
    "properties": {
      "target_peer_id": {
        "type": "string",
        "minLength": 1,
        "maxLength": 256
      },
      "text": {
        "type": "string",
        "minLength": 1,
        "maxLength": 16384
      }
    }
  }
  ```

  `query` is a UTF-8 string of 1 through 128 encoded bytes. `target_peer_id` is an opaque UTF-8 string of 1 through 256 encoded bytes. `text` is a UTF-8 string of 1 through 16384 encoded bytes. JSON Schema character length cannot enforce encoded-byte length, so both wrappers must validate UTF-8 encoded length at runtime; the schema `minLength` and `maxLength` values are character-count guards only.
- Publish immutable wrapper fingerprint tuples to B6b1 and invoke B3, B6b1, and B6a only through their stated contracts.

## Non-goals

No tool input for lane ID, source, credential, message ID, timestamp, retry, trace, hop, delivery mode, authority, trust, registry mutation, generic filesystem tools, configuration, process, network, or receiver completion receipt.

## Normative contract

Before each B7b registration, B7b queries `pi.getAllTools()` and refuses registration when that exact name already exists; that peer wrapper remains unavailable. After each successful registration, it reads the one current definition and pins exactly `(name, sourceInfo.source, sourceInfo.path, sourceInfo.scope, sourceInfo.origin, sha256(canonical_json(parameters)))`; any missing source field fails closed. Because `getAllTools()` is name-keyed and exposes no overwritten history, this is a current name-collision gate, not historical duplicate detection.

`gentle_list_agents` consumes only B3's redacted, read-only typed projection. Its `query` is deterministic case-insensitive literal matching over normalized display name and exact opaque ID. An omitted query applies no filter. An omitted `entity_type` selects all currently available typed variants; an unavailable A3 task variant contributes no entries and grants neither an error nor authority. Entries are deterministic in this order: `entity_type`, normalized canonical name, then opaque ID. The wrapper returns no more than the requested or default limit of 50 entries, only redacted B3 fields, and a whole response of at most 16 KiB with deterministic truncation when needed.

`gentle_send_message` rejects every undeclared routing or protocol property through its closed schema, including `lane_id`, `source`, `credential`, `message_id`, `timestamp`, `retry`, `trace`, `hop`, and `delivery_mode`. It validates the encoded-byte bounds for `target_peer_id` and `text` before admission, preserves `text` exactly with no trim, template expansion, or command expansion, and then invokes B6a so B6a retains its byte, bounds, hop, and trace authority. It re-resolves the current target as an addressable B3 `named_peer` and rejects self. The runtime derives authenticated source and canonical protocol metadata. No caller input can spoof metadata. Its rendered response is at most 16 KiB and represents exactly one B6a ACK or a bounded deterministic unavailable, configuration, or error status. An accepted ACK remains admission only, never receiver completion.

For every send, B6b1 resolves exactly one current registered lane matching the runtime platform and project scope. Zero matches is unavailable, more than one match is a configuration conflict, and neither outcome permits fallback or retry. The wrapper invokes B6a authority. Its returned ACK is B6a admission only, never receiver completion.

B7a and B7b publish immutable fingerprint tuples `(name, sourceInfo.source, sourceInfo.path, sourceInfo.scope, sourceInfo.origin, sha256(canonical_json(parameters)))` to B6b1. At every peer-principal `tool_call`, B6b1 re-reads the one current `pi.getAllTools()` definition and compares the full fingerprint. A missing or changed definition, override, or schema drift blocks the call. The final peer allowlist is exactly the three fingerprints for `gentle_inspect_project`, `gentle_list_agents`, and `gentle_send_message`; a name-only allowlist is forbidden. No generic read, grep, find, ls, bash, write, edit, task, or configuration tool is available to the peer principal.

## Dependencies

B1, B3, B6a, B6b1, and B7a.

## Acceptance criteria

- [ ] Both exact tool IDs use closed schemas. Listing accepts no required keys and rejects undeclared fields; sending requires exactly `target_peer_id` and `text` and accepts no optional or undeclared fields.
- [ ] Schema fixtures reject missing send keys, extra properties, wrong field types and `entity_type` values, empty queries, omitted-default mistakes, and character-valid but encoded-byte-over-limit query, target, and text values.
- [ ] Listing exposes only B3's redacted typed projection, applies no filter when query is omitted, uses deterministic case-insensitive literal matching, orders entries by entity type, normalized canonical name, then opaque ID, enforces the 50-entry and 16 KiB caps, and handles an unavailable task variant without error or authority.
- [ ] Send validates opaque target and exact-text byte bounds, preserves text exactly, accepts only a current, addressable, non-self B3 named peer, and leaves B6a byte, bounds, hop, and trace enforcement authoritative.
- [ ] Exactly one current matching lane is required; absent, duplicate, stale, or cross-platform lanes fail closed without fallback or retry.
- [ ] The bounded send response represents one exact B6a admission ACK or deterministic unavailable, configuration, or error status. The ACK is never receiver completion.
- [ ] Current-name collision before each registration refuses that wrapper; full fingerprint pinning blocks missing or changed definitions, overrides, and schema drift without claiming historical-duplicate detection, and the final peer allowlist contains only the three stated fingerprints.

## Verification

Focused schema-fixture tests cover `gentle_list_agents` empty-object defaults, no-query filtering, 1-through-50 limits, invalid `entity_type`, empty query, undeclared fields, wrong field types, and UTF-8 encoded-byte boundaries including multi-byte inputs. Send fixtures cover each missing required key, extra or routing/protocol properties, wrong field types, empty and encoded-byte-over-limit opaque targets and text, and exact-boundary acceptance. Focused wrapper tests cover literal-query matching, unavailable-task-variant behavior, B3 redaction, deterministic order and response truncation, exact text, self-target, unaddressable target, metadata spoofing, B6a byte/bounds/hop/trace delegation, no lane, duplicate lane, cross-platform lane, bounded deterministic status output, ACK semantics, and immutable fingerprints. Test current-name collision before registration plus current `pi.getAllTools()` missing, override, and metadata-drift cases; do not claim overwritten-history duplicate detection. Include the generic-tool denial matrix and affected package tests.

## Rollback

Unregister these wrappers and their fingerprints. Do not substitute generic tools, select a fallback lane, retry delivery, or alter B3/B6a/B6b1 authority.

## Pre-publication measured A+D/test-inventory gate

Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
