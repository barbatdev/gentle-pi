# feat(peers): add root-confined peer inspection wrapper

## Parent and status gate

Parent: `https://github.com/Gentleman-Programming/gentle-pi/issues/442`. This draft is not approved or implementation-ready. It must be created, formally linked, reviewed, and accepted before peer-parent re-review.

## Outcome

Provide one read-only, root-confined inspection wrapper for a correlated peer principal without exposing generic filesystem or process tools.

## Evidence and scope

Peer content is untrusted. B6b1 already establishes the correlated peer principal and its authenticated project scope. This child binds inspection to that principal and to the session project root, then proves every operation remains bounded.

## Included scope

- Register only `gentle_inspect_project` with the following closed, discriminated JSON Schema. Each `oneOf` variant closes its own object, so properties belonging to another action and every undeclared property are rejected.

  ```json
  {
    "oneOf": [
      {
        "type": "object",
        "additionalProperties": false,
        "required": ["action", "path"],
        "properties": {
          "action": { "const": "list" },
          "path": { "type": "string" },
          "limit": { "type": "integer", "minimum": 1, "maximum": 100, "default": 100 }
        }
      },
      {
        "type": "object",
        "additionalProperties": false,
        "required": ["action", "path"],
        "properties": {
          "action": { "const": "read" },
          "path": { "type": "string" },
          "offset": { "type": "integer", "minimum": 1, "default": 1 },
          "limit": { "type": "integer", "minimum": 1, "maximum": 200, "default": 200 }
        }
      },
      {
        "type": "object",
        "additionalProperties": false,
        "required": ["action", "path", "query"],
        "properties": {
          "action": { "const": "search" },
          "path": { "type": "string" },
          "query": { "type": "string", "minLength": 1, "maxLength": 256 },
          "limit": { "type": "integer", "minimum": 1, "maximum": 100, "default": 100 }
        }
      }
    ]
  }
  ```

  `path` may be the empty root or a relative path and remains subject to the path validation below. `query` must be a UTF-8 string of 1 through 256 encoded bytes. JSON Schema character length cannot enforce encoded-byte length, so runtime validation of the UTF-8 encoded length is required; the schema's `maxLength` is only a character-count guard.
- Bind once at session start to `realpath(ctx.cwd)` and the exact authenticated `project_scope_binding` carried by the B6b1 peer principal.
- Support bounded list, read, and literal search results under that binding.

## Non-goals

No generic read, grep, find, ls, bash, write, edit, task, configuration, process, network, temporary-file, or full-output tool. No mutation, shell, regex, symlink traversal, or authority transfer.

## Normative contract

Before registration, B7a queries `pi.getAllTools()` and refuses registration when `gentle_inspect_project` already exists; the peer principal remains unavailable. After successful registration, it reads the one current definition and pins exactly `(name, sourceInfo.source, sourceInfo.path, sourceInfo.scope, sourceInfo.origin, sha256(canonical_json(parameters)))`; any missing source field fails closed. Because `getAllTools()` is name-keyed and exposes no overwritten history, this gate detects only a current name collision and must not claim historical duplicate detection.

Every call re-resolves and rechecks both the bound canonical root and exact authenticated `project_scope_binding`; either mismatch is unavailable and fails closed. The closed `oneOf` schema rejects absent action-required keys, action values other than `list`, `read`, or `search`, every undeclared property, and properties from another action. `list` and `read` require `action` and `path`; `search` also requires `query`. `query` is forbidden for `list` and `read`; `offset` is forbidden for `list` and `search`. Omitted `list` and `search` limits default to 100. Omitted `read` offset defaults to 1 and its limit defaults to 200. An action-specific over-limit value is rejected, never clamped.

The tool rejects absolute POSIX paths, UNC paths, drive paths, NUL, any `.` or `..` segment, Windows ADS `:`, a symlink or reparse component, root escape, and a wrong file type. `list` requires a directory, `read` requires a regular file, and `search` requires a regular file or directory. Before consuming content, the tool opens the selected object, performs `fstat`, and rechecks the canonical root. UTF-8 decoding is fatal only: invalid bytes produce no lossy replacement output.

The case-insensitive direct and nested denylist is `.git`, `.pi`, `.env*`, `.npmrc`, `.pypirc`, `.netrc`, `.ssh`, `.aws`, `.gnupg`, `secrets`, and `credentials`. Exact private-key extensions `.pem`, `.key`, `.p12`, and `.pfx` are also denied. Search is literal only, never regex or shell, and it never delegates to generic tools. Recursive directory search visits only non-link directories and regular files in deterministic lexical order, rechecking handles, types, and the canonical root before consumption; it claims no stronger race protection than those open, `fstat`, and recheck steps.

`list` returns deterministic lexical entries and no more than its requested or default limit of 100. `read` returns the 1-based line window beginning at its requested or default offset and no more than its requested or default limit of 200 lines. `search` over a regular file or recursively over a directory returns no more than its requested or default limit of 100 literal matches; directory traversal is deterministic lexical order. Every action renders a whole response of at most 16 KiB and every rendered line at most 512 bytes. When an entry, line, match, or response must be bounded, it uses deterministic truncation markers so an empty complete result is distinguishable from a bounded result.

## Dependencies

B1 and B6b1.

## Acceptance criteria

- [ ] The exact tool ID and closed discriminated `oneOf` schema are registered without a generic-tool fallback; every variant rejects undeclared and action-forbidden properties.
- [ ] Schema fixtures reject missing required keys, cross-variant properties, extra properties, wrong action/type/value cases, character-valid but encoded-byte-over-limit queries, and action-specific out-of-range limits; fixtures verify all omitted defaults.
- [ ] Current-name collision before registration refuses the tool, and a successful registration pins one complete current fingerprint with no historical-duplicate claim.
- [ ] Root and project-scope binding are captured once and revalidated on every call.
- [ ] Traversal, absolute, UNC, drive, ADS, NUL, symlink/reparse, root-escape, denylist, private-key, and wrong-type inputs fail closed.
- [ ] List, read, and literal search enforce their exact output ordering, required type, recursive-search, 1-based line-window, default, limit, 512-byte line, 16 KiB response, and deterministic-truncation rules.
- [ ] Invalid UTF-8 is rejected without lossy output, and no operation mutates state or invokes process or network access.

## Verification

Focused schema-fixture tests cover each variant's missing required keys, undeclared fields, cross-variant `query` and `offset` rejection, wrong action/type/value cases, omitted-default behavior, and UTF-8 encoded-byte boundaries including multi-byte inputs. Focused wrapper tests cover current-name collision and complete fingerprint pinning, root and scope drift, every rejected path class, nested/case-insensitive denied names, key extensions, file-type races, invalid UTF-8, literal-search metacharacters, deterministic lexical list and recursive search, 1-based read windows, line and response caps, deterministic truncation, and the absence of generic peer tools. Run affected package tests.

## Rollback

Unregister only `gentle_inspect_project`; do not add a compatibility tool or broaden a peer principal.

## Pre-publication measured A+D/test-inventory gate

Before the first peer-publication mutation, measure this unit's A+D and enumerate focused and affected tests as part of the peer register. If it exceeds 400 A+D or 60 minutes, stop; split locally, regenerate the peer register, counts, topology, published peer parent, and tombstones, recapture duplicates, and obtain new explicit publication authorization. The current snapshot and authorization are invalid.
