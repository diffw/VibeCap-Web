---
name: interactive-prototype
description: Build exquisite interactive prototypes with animations, transitions, component architecture, and mock data wiring. Use when creating or iterating design prototypes in the design/ directory — focused on HOW things move and respond (interactivity), not HOW things look (visual aesthetics, which is the frontend-design skill).
---

This skill guides building interactive prototypes that feel alive — orchestrated animations, responsive interactions, sound component architecture, and realistic mock data. It complements the `frontend-design` skill: **frontend-design** owns visual aesthetics (typography, color, layout); **interactive-prototype** owns behavior and motion implementation.

**Use this skill for**: Creating/iterating design prototypes, adding animations/transitions, building interactive demos, gesture interactions, wiring mock data flows.

**Not for**: Production `apps/web/` code, visual aesthetics only (use `frontend-design`), Go backend, git operations.

## Tech Stack

| Layer | Tool | Notes |
|-------|------|-------|
| Framework | React 18 | Function components, hooks only |
| Styling | Tailwind CSS 4 | `@theme inline`, CSS custom properties |
| Build | Vite 6 | HMR, fast rebuild |
| Language | TypeScript | Strict mode, `tsc --noEmit` validation |
| Animation | tw-animate-css | Composable entrance/exit utilities |
| Icons | Lucide React | Tree-shakeable, consistent stroke weight |
| Utilities | `cn()` (clsx + twMerge) | Conditional class composition |

## Component Architecture

> Consult [component-patterns reference](.agents/references/families/browser/interactive-prototype/component-patterns.md) for detailed patterns and code.

**Composition patterns**:
- Multi-mode components: one component, multiple layout modes via string union (`'bar' | 'split' | 'full'`)
- Compound components: parent owns shared state, children receive only relevant props
- Custom hooks: extract reusable interaction logic (`useRightPaneResize`, `useVerseAnnotations`)
- Floating UI: position elements near click coordinates with container-relative clamping

**State ownership**:
- String unions over booleans (`ChatMode`, `SubView`, `ActiveSection`)
- Parent owns mode state, passes `mode` + `setMode` to children
- `useCallback` for event handlers passed as props
- `useEffect` for side effects (event listeners, scroll, DOM measurement)

**Props discipline**:
- Named interface per component (`interface CommandBarProps`)
- `on{Event}` for callbacks, `set{State}` for direct state setters
- `null` for "not set", not `undefined`
- Export types that sibling components need

**File organization** (`design/prototype/src/app/components/`):
- One component per file, named same as default export
- Hooks: `use{Name}.ts`
- Data: `{Domain}Data.ts` or `{domain}-{type}.ts`
- Utilities: `component-utils.ts`, `prototype-support.ts`
- Subdirectories for scoped helpers: `figma/ImageWithFallback.tsx`

## Animation System

> Consult [animation-system reference](.agents/references/families/browser/interactive-prototype/animation-system.md) for deep-dive and code recipes.

**CSS-first hierarchy** (choose the simplest that works):
1. `transition` — single-property state changes
2. `@keyframes` — multi-step or looping sequences
3. tw-animate-css — standard entrance/exit (`animate-in fade-in zoom-in-95 duration-150`)
4. Motion library — future upgrade path (not currently installed)

**Duration**: 100/300/500 rule from [motion-design reference](.agents/references/families/browser/frontend-design/motion-design.md):
- 100-150ms: instant feedback (hover, toggle)
- 200-300ms: state changes (menu, tooltip)
- 300-500ms: layout changes (panel, drawer)
- 500-800ms: entrance animations (page load)

**Easing**: exponential curves for natural deceleration:
```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);  /* Default */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);   /* Snappy */
```

**Only animate** `transform` and `opacity`. Use `grid-template-rows: 0fr/1fr` for height.

**Stagger with `--i`**: `animation-delay: calc(var(--i, 0) * 60ms)`, cap total at 500ms.

**Reduced motion** is mandatory:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Interaction Patterns

> Consult [interaction-recipes reference](.agents/references/families/browser/interactive-prototype/interaction-recipes.md) for implementation code.

**Progressive disclosure**: Start minimal, reveal on interaction (CommandBar bar -> split -> full).

**Multi-mode layouts**: One component renders different layouts based on mode enum. Use early returns, not nested conditionals.

**Floating toolbars**: Position at click coordinates, clamp to container, prefer above-click placement.

**Keyboard shortcuts**:
- `Cmd+K`: focus command bar
- `Escape`: de-escalate one level
- `Cmd+Enter`: save/submit in editors
- Show keyboard hint badges near controls

**Gestures**: Drag-to-resize via `useEffect` + window event listeners. Set `cursor` and `userSelect` on body during drag.

**Scroll-triggered**: Intersection Observer, `unobserve` after animating once, threshold 0.1-0.2.

**Eight interactive states**: Default, Hover, Focus, Active, Disabled, Loading, Error, Success. See [interaction-design reference](.agents/references/families/browser/frontend-design/interaction-design.md).

## Data Mocking

> Consult [data-mocking reference](.agents/references/families/browser/interactive-prototype/data-mocking.md) for strategies and examples.

- Centralized typed `.ts` files per domain (never inline mock data in components)
- Type-first: define interfaces before creating data
- Realistic content: real Bible passages, Unsplash images, relative timestamps
- Prototype presets: `PrototypePreset` union + `resolvePrototypePreset()` + guard functions
- State simulation: pre-populated `useState` for "lived-in" feel
- Image handling: `PROTOTYPE_USER_AVATAR` constant, `ImageWithFallback` for graceful degradation
- Align mock data shapes with future API contracts

## Required Workflow

1. **Discover**: Read existing components in `design/prototype/src/app/components/`
2. **Choose**: Select the right animation technique (CSS-first hierarchy)
3. **Load references**: Read relevant reference files before implementing
4. **Implement**: Write code following patterns documented above
5. **Validate**: Run `tsc --noEmit` in `design/prototype/` — must pass clean

## Quality Gates

Before considering work complete, verify:

- [ ] `prefers-reduced-motion` respected (no decorative motion without fallback)
- [ ] Focus states visible on all interactive elements (`:focus-visible`)
- [ ] No animation exceeds 800ms total duration
- [ ] Touch targets >= 44x44px on all interactive elements
- [ ] All mock data typed (no `any`, no untyped inline objects)
- [ ] `tsc --noEmit` passes clean in `design/prototype/`
- [ ] Theme-aware: components work in both light and dark modes

## Resource Map

- Animation deep-dive: `.agents/references/families/browser/interactive-prototype/animation-system.md`
- Component patterns: `.agents/references/families/browser/interactive-prototype/component-patterns.md`
- Interaction recipes: `.agents/references/families/browser/interactive-prototype/interaction-recipes.md`
- Data mocking: `.agents/references/families/browser/interactive-prototype/data-mocking.md`
- Visual aesthetics (cross-ref): `.agents/skills/families/browser/workflows/design/frontend-design/SKILL.md`
- Motion timing principles (cross-ref): `.agents/references/families/browser/frontend-design/motion-design.md`
- Interaction design theory (cross-ref): `.agents/references/families/browser/frontend-design/interaction-design.md`
