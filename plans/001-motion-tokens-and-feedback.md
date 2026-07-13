# 001 — Consolidate motion tokens and physical feedback

- **Status**: DONE
- **Commit**: 9adacef
- **Severity**: HIGH
- **Category**: Easing, performance, accessibility
- **Estimated scope**: 1 file, medium

## Problem

`app/globals.css:176-280` repeats weak built-in `ease`, leaves most pressable controls without pointer-down feedback, applies hover motion on touch, and animates the equalizer's `height` at `app/globals.css:299-302`. The current reduced-motion rule at `app/globals.css:366-368` removes nearly every transition rather than preserving useful opacity/color feedback.

## Target

Add shared tokens `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`, `--duration-fast: 140ms`, and `--duration-ui: 200ms`. Give every button `transform: scale(0.97)` press feedback over 140ms. Gate hover transforms behind `@media (hover: hover) and (pointer: fine)`. Animate equalizer bars with `transform: scaleY()` and `transform-origin: bottom`. Reduced motion keeps short opacity/color transitions but removes movement and loops.

## Repo conventions to follow

Motion tokens live in `:root` beside the color and shadow tokens. Keep all implementation in `app/globals.css` and use existing class names.

## Steps

1. Add the four motion tokens to `:root`.
2. Replace bare easing declarations with explicit property transitions and tokens.
3. Add consistent `:active:not(:disabled)` feedback to buttons and cards.
4. Move hover-only movement into a fine-pointer media query.
5. Replace height-based equalizer animation with compositor-friendly transforms.
6. Rewrite reduced-motion rules to retain color/opacity feedback.

## Boundaries

- Do NOT add a motion library or dependency.
- Do NOT change video-canvas animation timing.
- Do NOT animate layout properties.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm test` pass.
- **Feel check**: press every button and confirm immediate, subtle compression; toggle reduced motion and confirm hover travel/ambient loops disappear while state colors remain.
- **Done when**: no ungated hover transform, no `transition: all`, and no animated equalizer height remain.
