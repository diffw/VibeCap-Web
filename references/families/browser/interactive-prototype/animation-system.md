# Animation System

Deep-dive reference for implementing animations in the design prototype (`design/prototype/`). For visual timing principles and easing theory, see the `frontend-design` [motion-design reference](../frontend-design/motion-design.md) — this document focuses on **implementation recipes**.

## CSS-First Hierarchy

Choose the simplest technique that achieves the effect:

| Level | Technique | When to Use |
|-------|-----------|-------------|
| 1 | `transition` | Single-property state changes (hover, focus, toggle) |
| 2 | `@keyframes` | Multi-step or looping sequences (page entrance, ambient) |
| 3 | tw-animate-css | Standard entrance/exit utilities (`animate-in`, `fade-in`, `slide-in-from-top-2`) |
| 4 | Motion library | Layout animations, gesture-driven, physics-based (future — not currently installed) |

**Rule**: Never jump to a higher level when a lower one suffices. A `transition-colors duration-150` is always better than a `@keyframes` for a hover color change.

## Tailwind CSS 4 Animation Tokens

Define animation tokens inside `@theme inline` in `tailwind.css`:

```css
@theme inline {
  /* Token naming: --animate-{name} */
  --animate-fade-in: fadeIn 1s ease-out forwards;
  --animate-fade-in-up: fadeInUp 0.5s ease-out forwards;
  --animate-aurora: aurora 30s ease infinite alternate;
  --animate-pulse-slow: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```

Usage in JSX: `className="animate-fade-in"` — Tailwind resolves the token automatically.

**tw-animate-css** provides composable entrance utilities:
```tsx
// Compose: animation type + direction + duration
className="animate-in fade-in zoom-in-95 duration-150"
className="animate-in fade-in slide-in-from-top-1 duration-150"
```

## Stagger Patterns

### CSS Variable Stagger (Static Lists)

For lists where item count is known at render:

```tsx
{items.map((item, i) => (
  <div
    key={item.id}
    className="animate-fade-in-up opacity-0"
    style={{ '--i': i } as React.CSSProperties}
  >
    {item.content}
  </div>
))}
```

```css
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
  animation-delay: calc(var(--i, 0) * 60ms);
}
```

**Cap rules**:
- Per-item delay: 40-80ms
- Total stagger time: max 500ms
- For 10+ items, reduce per-item delay or cap staggered count to first 8

### JS-Driven Stagger (Dynamic Lists)

For lists that change length dynamically, use inline styles:

```tsx
{items.map((item, i) => (
  <div
    key={item.id}
    className="animate-fade-in-up opacity-0"
    style={{
      animationDelay: `${Math.min(i * 60, 480)}ms`,
    }}
  >
    {item.content}
  </div>
))}
```

## Page Transition Orchestration

When switching views (e.g., Today -> Reading -> Map), orchestrate entrance in layers:

| Phase | Delay | What Animates | Duration |
|-------|-------|---------------|----------|
| 1. Background | 0ms | Surface color, ambient effects | 300ms |
| 2. Structure | 50ms | Layout containers, panels | 300ms |
| 3. Content | 150ms | Text, images, cards | 400ms |
| 4. Details | 250ms | Icons, badges, secondary text | 300ms |

Example: View component wraps content in `animate-fade-in`:
```tsx
<div className="animate-fade-in">
  {/* View content */}
</div>
```

## Exit Animations

Exit at **75% of entrance duration**. Exit uses `ease-in` (accelerating away), entrance uses `ease-out` (decelerating in).

```css
/* Entrance: 300ms ease-out */
.panel-enter {
  animation: slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Exit: 225ms ease-in */
.panel-exit {
  animation: slideOut 225ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
}
```

For conditional rendering (no exit animation needed), simply unmount — React removes the element instantly. Exit animations are primarily for:
- Panels sliding away (study panel close)
- Toasts/notifications dismissing
- Modal/overlay backgrounds fading

## Ambient Motion

Subtle, continuous animations that bring life without demanding attention:

```css
/* Aurora gradient shift — hero backgrounds */
--animate-aurora: aurora 30s ease infinite alternate;
@keyframes aurora {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Breathe — gradient backgrounds */
@keyframes breathe {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Slow pulse — status indicators */
--animate-pulse-slow: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

**Ambient motion rules**:
- Duration >= 4s (imperceptible speed)
- Must respect `prefers-reduced-motion` (disable entirely)
- Only `background-position`, `opacity`, or `transform` — never layout properties

## Scroll-Linked Animations

Use Intersection Observer, not scroll events:

```tsx
function useFadeOnScroll(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-fade-in-up');
          observer.unobserve(el); // Animate once only
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
```

**Key principles**:
- `unobserve` after first animation (don't re-animate on scroll back)
- `threshold: 0.1-0.2` — trigger when 10-20% visible
- Start elements with `opacity-0` and let animation add them

## Performance

| Do | Don't |
|----|-------|
| Animate `transform` and `opacity` only | Animate `width`, `height`, `padding`, `margin` |
| Use `will-change` only on `:hover` or `.animating` | Set `will-change` on page load |
| Use `grid-template-rows: 0fr/1fr` for height | Animate `height` or `max-height` |
| Unobserve after one-shot animations | Leave observers running indefinitely |
| Keep total animation under 800ms | Create multi-second entrance sequences |
| Cap stagger at 500ms total | Let stagger scale linearly with item count |

**Frame budget**: 16.67ms per frame at 60fps. `transform` and `opacity` are compositor-only and skip layout/paint. Everything else triggers reflow.

## Code Recipes

### 1. Staggered Card Grid

```tsx
<div className="grid grid-cols-2 gap-4">
  {cards.map((card, i) => (
    <div
      key={card.id}
      className="opacity-0 animate-fade-in-up"
      style={{ '--i': i } as React.CSSProperties}
    >
      <CardContent {...card} />
    </div>
  ))}
</div>
```

### 2. Sliding Panel (Study Panel)

```tsx
<div
  className={cn(
    "transition-all duration-300 ease-out",
    isOpen ? "w-[360px] opacity-100" : "w-0 opacity-0 overflow-hidden"
  )}
>
  {/* Panel content */}
</div>
```

### 3. Toolbar Appear (VerseActionToolbar)

```tsx
<div className="animate-in fade-in zoom-in-95 duration-150">
  {/* Toolbar content */}
</div>
```

### 4. Mode Transition (CommandBar bar -> split -> full)

```tsx
// Full mode entrance
<div className="animate-fade-in">
  {/* Full-screen chat */}
</div>

// Split mode uses layout transition on parent
<div
  className="transition-all duration-300"
  style={{ width: chatSplitWidth }}
>
  {/* Split panel */}
</div>
```

### 5. Ambient Glow (Dark Mode)

```tsx
{isDark && (
  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary-dim/30 rounded-2xl opacity-0 group-focus-within:opacity-30 transition duration-300 blur" />
)}
```

### 6. Dropdown / Menu Appear

```tsx
<div className="animate-fade-in">
  {/* Menu content */}
</div>
```
