# Canonical roadmap normalization

## Decision

Canonical roadmap files represent the accepted current scope and published-parent reality. They are not blindly byte-identical copies of temporary-source records. Every permitted difference is finite, attributable, and recorded in `normalization.json`; no unlisted normalization is allowed.

## Review path

1. Read this document and `normalization.json` before accepting any source/canonical hash difference.
2. Verify the source and canonical hashes in every listed entry.
3. Confirm that each entry uses only the rule IDs below and that the aggregate counts match.
4. Reject any difference that is unrecorded or assigned a non-finite rule.

## Allowed normalization rules

| Rule ID | Exact permitted normalization | Expected use |
| --- | --- | --- |
| `peer_parent_url_substitution` | Substitute the verified #442 URL for a peer-parent placeholder token. | 35 substitutions across 30 peer child files. |
| `peer_parent_stale_state` | Remove stale peer-parent state that says the parent or placeholder has not been created; tombstones retain only current historical-state wording. | 30 peer child files. |
| `peer_parent_regeneration_wording` | Replace stale `parent placeholder` regeneration wording with published-parent wording. | 20 active peer child files. |
| `b6b1_host_runtime_capability_contract` | Replace two package-specific coupling references with the supported host-runtime capability contract, preserving the version floor, required capabilities, and fail-closed behavior. | B6b1 only. |
| `a4_reviewer_attribution_removal` | Remove personal reviewer attribution while preserving the #419 evidence claim. | A4 only. |
| `a5a_durable_publication_metadata` | Replace ephemeral absolute paths and completed publication procedure with durable roadmap-relative/current-state metadata. | A5a only. |

The rules are exhaustive. In particular, a normalization must not restore an out-of-scope named dependency or source repository, stale publication instructions, or personal attribution.

## Historical snapshots

The following files are evidence snapshots, not current parent content:

| Parent | Historical path | SHA-256 | Status |
| --- | --- | --- | --- |
| #419 | `parents/419/previous-body.md` | `21b4fb59a2da686ba75af45355ecd8568fa40fcd18c23ea8a5bb990bb32a6931` | historical-not-current |
| #376 | `parents/376/previous-body.md` | `e287efe41692b062973a4db78e4767ab73b323f4838e2f97c3725bc4d1e183e6` | historical-not-current |

The current parent title/body snapshots remain the files identified by each parent entry in `manifest.json`; history never replaces them.

## Machine-readable record

`normalization.json` has schema version 1 and contains one entry for every work-unit file that differs after applying only the verified #442 URL substitution to its temporary-source baseline. Each entry identifies the stable ID, roadmap-relative canonical path, source SHA-256, canonical SHA-256, and exact rule IDs.

Its aggregate expectations are 49 work-unit source files, 32 drift entries, 30 peer drift files, and 35 peer-parent substitutions. The wider temporary staging area is not part of that child-source count.
