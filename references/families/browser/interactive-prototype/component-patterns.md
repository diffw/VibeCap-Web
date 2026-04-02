# Component Patterns

Architecture patterns extracted from the design prototype (`design/prototype/`). For visual styling principles, see the `frontend-design` skill — this document focuses on **structural patterns and state management**.

## Multi-Mode Component

A single component that renders fundamentally different layouts based on a mode enum. The CommandBar is the canonical example:

```tsx
export type ChatMode = 'bar' | 'split' | 'full';

export default function CommandBar({ chatMode, setChatMode, ...props }: CommandBarProps) {
  // Shared state and handlers defined once
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([...]);

  // Shared render helpers
  const renderMessages = () => (/* ... */);
  const renderInput = (compact = false) => (/* ... */);
  const renderSlashMenu = () => (/* ... */);

  // Mode-specific renders — early return pattern
  if (chatMode === 'bar') {
    return (/* Collapsed bar layout */);
  }

  if (chatMode === 'full') {
    return (/* Full-screen layout */);
  }

  // Default: split mode
  return (/* Side panel layout */);
}
```

**Key principles**:
- Mode type is a string union, not booleans (`'bar' | 'split' | 'full'` not `isExpanded + isFullscreen`)
- Parent owns the mode state, child receives `mode` + `setMode`
- Shared logic (handlers, render helpers) defined once at top
- Mode-specific JSX uses early returns, not conditional rendering within one tree
- Extract render helpers (`renderMessages`, `renderInput`) to avoid duplication across modes

## Compound Component Pattern

Group related components that share implicit context. Used for the App shell:

```tsx
// App.tsx — composition root
export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

function AppInner() {
  // All shared state lives here
  const [activeSection, setActiveSection] = useState<ActiveSection>('today');
  const [isStudyPanelOpen, setIsStudyPanelOpen] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('bar');

  return (
    <div className="flex h-screen">
      <ActivityRail activeSection={activeSection} setActiveSection={handleSetActiveSection} />
      <main className="flex-1">
        {/* Content area renders based on activeSection */}
      </main>
      {isStudyPanelOpen && <StudyPanel />}
      <CommandBar chatMode={chatMode} setChatMode={setChatMode} />
    </div>
  );
}
```

**Key principles**:
- Context providers wrap the composition root (`ThemeProvider`)
- State coordination happens in a single parent (`AppInner`)
- Children receive only the props they need — no prop drilling of unrelated state
- Layout structure (flex, grid) defined at the parent level

## Custom Hook Extraction

Extract reusable interaction logic into custom hooks. The `useRightPaneResize` is the pattern:

```tsx
interface UseRightPaneResizeOptions {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
}

export function useRightPaneResize({
  initialWidth, minWidth, maxWidth,
}: UseRightPaneResizeOptions) {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((event: ReactMouseEvent) => {
    event.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (event: MouseEvent) => {
      const nextWidth = window.innerWidth - event.clientX;
      if (nextWidth >= minWidth && nextWidth <= maxWidth) {
        setWidth(nextWidth);
      }
    };

    const handleUp = () => setIsResizing(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, maxWidth, minWidth]);

  return { width, isResizing, startResizing };
}
```

**When to extract a hook**:
- Interaction logic involves `useEffect` + event listeners (resize, keyboard, scroll)
- Same interaction is used by multiple components
- Logic has clear inputs (options) and outputs (state + handlers)

**Hook conventions**:
- Name: `use{Noun}{Verb}` — `useRightPaneResize`, `useVerseAnnotations`
- Options object parameter (not positional args) for 3+ config values
- Return object with named properties (not array)
- Clean up side effects in `useEffect` return

## Floating UI Pattern

Position UI elements near a click/selection point. The VerseActionToolbar demonstrates:

```tsx
// 1. Receive click coordinates from parent
interface VerseActionToolbarProps {
  clickPos: { x: number; y: number };
  containerEl: HTMLElement | null;
  // ...
}

// 2. Calculate position relative to container
useEffect(() => {
  if (!containerEl || !toolbarRef.current) return;
  const containerRect = containerEl.getBoundingClientRect();
  const toolbarRect = toolbarRef.current.getBoundingClientRect();
  const GAP = 10;

  // Convert viewport click to container-relative
  const clickRelX = clickPos.x - containerRect.left;
  const clickRelY = clickPos.y - containerRect.top + containerEl.scrollTop;

  // Vertical: prefer above click, fallback below
  const viewportSpaceAbove = clickPos.y - containerRect.top;
  let top: number;
  if (viewportSpaceAbove > toolbarRect.height + GAP + 20) {
    top = clickRelY - toolbarRect.height - GAP;
  } else {
    top = clickRelY + GAP + 12; // Below
  }

  // Horizontal: center on click, clamp to container
  let left = clickRelX - toolbarRect.width / 2;
  left = Math.max(8, Math.min(left, containerRect.width - toolbarRect.width - 8));

  setPos({ top, left });
}, [clickPos, containerEl]);

// 3. Apply position
<div ref={toolbarRef} className="absolute z-50" style={{ top: pos.top, left: pos.left }}>
```

**Key decisions**:
- Container-relative positioning (not viewport-relative) — survives scroll
- Prefer above, fallback below (avoids covering content below click)
- Clamp horizontally to container bounds (8px padding)
- Stop event propagation on toolbar clicks (`onClick={e => e.stopPropagation()}`)

## Theme-Aware Components

Access theme context and adapt rendering:

```tsx
import { useTheme } from './ThemeContext';
import { cn } from './component-utils';

function MyComponent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "rounded-xl border",
      isDark
        ? "bg-bg-glass backdrop-blur-xl border-border-subtle"
        : "bg-bg-app border-border-default"
    )}>
      {/* Content */}
    </div>
  );
}
```

**Conventions**:
- Derive `isDark` locally: `const isDark = theme === 'dark'`
- Use `cn()` (clsx + twMerge) for conditional classes
- Prefer semantic color tokens (`bg-bg-elevated`, `text-text-primary`) over raw colors
- Only branch on `isDark` for effects that can't be expressed in tokens (backdrop-blur, gradients)

## State Machine Thinking

Avoid boolean soup. Use discriminated unions:

```tsx
// BAD: boolean soup
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
// Allows impossible states: isLoading && isError && isSuccess

// GOOD: state machine
type Status = 'idle' | 'loading' | 'error' | 'success';
const [status, setStatus] = useState<Status>('idle');

// GOOD: mode enum (CommandBar)
type ChatMode = 'bar' | 'split' | 'full';

// GOOD: view union (App)
type SubView = 'reading' | 'map' | 'interlinear' | 'audio' | 'compare' | 'audio-home';
type ActiveSection = 'today' | 'bible' | 'listen' | 'search' | ...;
```

## Props Interface Conventions

```tsx
// 1. Explicit interface (not inline)
interface CommandBarProps {
  chatMode: ChatMode;
  setChatMode: (m: ChatMode) => void;
  currentBookId: string | null;
  currentChapter: number | null;
  onNavigate: (bookId: string, chapter: number) => void;
  setActiveSection: (s: ActiveSection) => void;
  setIsStudyPanelOpen: (v: boolean) => void;
  setSubView: (v: SubView) => void;
}

// 2. Destructure in function signature
export default function CommandBar({
  chatMode, setChatMode,
  currentBookId, currentChapter, onNavigate,
  setActiveSection, setIsStudyPanelOpen, setSubView,
}: CommandBarProps) {
```

**Conventions**:
- Named interface, not inline type
- `on{Event}` for parent-bound callbacks (`onNavigate`, `onClose`)
- `set{State}` for direct state setters passed through
- Union types for modes/views, not booleans
- `null` for "not set" (not `undefined`)
- Export types that other components need (`export type ChatMode`)
