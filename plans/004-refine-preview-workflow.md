# 004 — Refine preview and export workflow

- **Status**: DONE
- **Commit**: 9adacef
- **Severity**: MEDIUM
- **Category**: Mapping, feedback, perceived performance
- **Estimated scope**: 2 files, medium

## Problem

The preview sidebar at `app/MiniQuickCutApp.tsx:568-624` gives metadata, music, three text fields, export state, download, privacy, and navigation nearly equal visual weight. The play control at `app/globals.css:279-280` is hover-hidden, and progress feedback is visually detached from the export action.

## Target

Make playback always discoverable, group editable title fields as the single customization surface, demote static metadata, and anchor export progress directly above the primary download action. Use tabular time values, a custom accessible range track, and clear ready/generating/error states. Keep all UI transitions under 200ms and interruptible.

## Repo conventions to follow

Preserve the two-column desktop layout, current local privacy messaging, and lazy-loaded exporter.

## Steps

1. Reorder sidebar sections into summary → customization → export.
2. Add explicit section headings and stronger grouping.
3. Make play/pause visible without hover and improve the scrubber hit target.
4. Co-locate export progress/error with the download button.
5. Tune responsive behavior so the action panel follows the player naturally on mobile.

## Boundaries

- Do NOT change rendering or export functionality.
- Do NOT add dialogs or an editor timeline.
- Do NOT remove local privacy explanations.

## Verification

- **Mechanical**: TypeScript, build, and tests pass.
- **Feel check**: a first-time user can identify play, edit text, regenerate, and download within five seconds; test at 375px and 1440px widths.
- **Done when**: the primary path is visually dominant and status feedback remains adjacent to the action it describes.
