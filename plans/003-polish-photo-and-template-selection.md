# 003 — Polish photo and template selection

- **Status**: DONE
- **Commit**: 9adacef
- **Severity**: MEDIUM
- **Category**: Agency, wayfinding, interaction
- **Estimated scope**: 2 files, medium

## Problem

Photo actions at `app/globals.css:195-198` are hidden behind hover, which is unavailable on touch, and draggable articles at `app/MiniQuickCutApp.tsx:288-305` lack keyboard position controls. Template cards at `app/globals.css:236-267` use a 3-column grid for five items, leaving an unbalanced final row and relying heavily on shadows for selection.

## Target

Keep photo actions persistently available on coarse pointers, strengthen the drag handle and focus state, and provide keyboard move-left/move-right controls or equivalent accessible buttons. Make the five template cards a balanced responsive grid, with a visible selected outline, a checked status label, and consistent preview aspect ratios. Use 200ms ease-out transforms only on fine pointers.

## Repo conventions to follow

Reuse Lucide icons already installed. Preserve 10–20 photo limits and current reorder semantics.

## Steps

1. Add accessible previous/next reorder callbacks and controls to photo cards.
2. Style actions for fine and coarse pointers separately.
3. Balance the template grid at wide, tablet, and phone widths.
4. Strengthen selected and focus-visible states without relying only on color.

## Boundaries

- Do NOT add drag libraries.
- Do NOT change selection, replacement, or deletion behavior.
- Do NOT hide essential controls behind animation.

## Verification

- **Mechanical**: TypeScript and tests pass.
- **Feel check**: complete photo management with keyboard and with a touch-sized viewport; select all five templates without layout jumps.
- **Done when**: every photo action is discoverable without hover and the five-card layout is visually balanced.
