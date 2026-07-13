# 002 — Clarify hierarchy with restrained materials and typography

- **Status**: DONE
- **Commit**: 9adacef
- **Severity**: MEDIUM
- **Category**: Cohesion, typography, materials
- **Estimated scope**: 1 file, medium

## Problem

The interface uses several near-identical translucent surfaces (`app/globals.css:42-55`, `167-177`, `216-240`) without a clear material hierarchy. Display tracking at `app/globals.css:158` is overly tight for mixed Chinese/Latin text, while supporting text is frequently 8–10px, reducing legibility.

## Target

Use one light floating-chrome material for the top bar, one solid elevated workspace surface, and one dark production surface for preview controls. Raise important helper text to 11–12px, use `font-optical-sizing: auto`, set display tracking near `-0.045em`, and preserve positive tracking only for small uppercase eyebrows. Add `prefers-reduced-transparency` and `prefers-contrast` fallbacks.

## Repo conventions to follow

Preserve the existing warm gray paper, ink, and acid-lime accent. Continue using Geist/system fonts and current semantic class names.

## Steps

1. Refine surface/color/shadow tokens in `:root`.
2. Tune top bar, workspace, ratio panel, template cards, canvas shell, and result panel into distinct material weights.
3. Normalize typography sizes, leading, and tracking.
4. Add reduced-transparency and increased-contrast media queries.

## Boundaries

- Do NOT introduce gradients as decoration beyond existing functional depth/shading.
- Do NOT add custom font files.
- Do NOT alter application logic.

## Verification

- **Mechanical**: build and tests pass.
- **Feel check**: scan each screen at 100% and 125% browser zoom; hierarchy remains obvious and no helper label requires squinting.
- **Done when**: each surface has a distinct role and all interactive/support text remains legible.
