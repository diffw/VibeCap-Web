# Interaction Recipes

Implementation-focused patterns for prototype interactions. For interaction design theory (eight states, focus rings, accessibility), see the `frontend-design` [interaction-design reference](../frontend-design/interaction-design.md).

## Drag-to-Resize

Pointer events pattern for resizable panels (study panel, chat split):

```tsx
// Hook: useRightPaneResize
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
```

**Resize handle JSX**:
```tsx
<div
  onMouseDown={startResizing}
  className={cn(
    "w-1 cursor-col-resize hover:bg-primary/30 transition-colors",
    isResizing && "bg-primary/40"
  )}
/>
```

**Key details**:
- Listen on `window` (not the element) so dragging outside the element still works
- Set `cursor` and `userSelect` on `document.body` during drag
- Clean up styles in effect cleanup
- Clamp width between min/max bounds

## Keyboard Navigation

### Global Shortcuts (Cmd+K, Escape)

```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      inputRef.current?.focus();
    }
    if (e.key === 'Escape') {
      if (chatMode === 'full') setChatMode('split');
      else if (chatMode === 'split') setChatMode('bar');
      setShowSlashMenu(false);
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [chatMode, setChatMode]);
```

**Escape key escalation**: Each press de-escalates one level (full -> split -> bar). This is the standard pattern for dismissable UI.

### Keyboard Hint Badges

Show keyboard shortcuts as subtle badges near relevant controls:

```tsx
<span className="text-[10px] font-mono text-text-quaternary border border-border-subtle px-1.5 py-0.5 rounded bg-bg-surface-hover">
  Cmd+K
</span>
```

### Context-Specific Shortcuts

```tsx
// In textarea/note editors
onKeyDown={e => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSaveNote();
  if (e.key === 'Escape') setShowNote(false);
}}
```

## Contextual Actions

### Floating Toolbar (VerseActionToolbar)

Appears at click position when user selects verses. Groups related actions:

```
[Yellow Green Blue Pink] | [Note Copy] | [Play] | [X]
```

**Implementation pattern**:
1. Parent tracks selection state and click position
2. Toolbar receives `clickPos: { x, y }` and `containerEl`
3. Position calculated relative to container with above/below fallback
4. Actions grouped with visual separators (`w-px h-5 bg-white/10`)
5. Event propagation stopped (`onClick={e => e.stopPropagation()}`)

### Slash Commands

Type `/` to open a command palette inline:

```tsx
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  const val = e.target.value;
  setInputValue(val);

  if (val.startsWith('/')) {
    setShowSlashMenu(true);
    setSlashFilter(val.slice(1).toLowerCase());
  } else {
    setShowSlashMenu(false);
  }
};

// Filter commands
const filteredCommands = SLASH_COMMANDS.filter(c =>
  c.cmd.slice(1).includes(slashFilter) || c.desc.toLowerCase().includes(slashFilter)
);
```

**Slash command data structure**:
```tsx
const SLASH_COMMANDS = [
  { cmd: '/go', desc: 'Navigate to passage', example: '/go Psalm 23', icon: 'auto_stories' },
  // ...
];
```

## Mode Transitions (Escalation Pattern)

Progressive disclosure through mode escalation:

```
bar (minimal) -> split (side panel) -> full (takes over)
```

**Trigger rules**:
- Slash commands: stay in current mode (commands are quick actions)
- Natural language input: escalate bar -> split (conversation needs space)
- Explicit expand button: escalate to full
- Escape key: de-escalate one level

```tsx
if (inputValue.startsWith('/')) {
  // Parse and execute — don't change mode
  executeSlashCommand(cmd, args);
} else {
  // Natural language — expand to show conversation
  if (chatMode === 'bar') setChatMode('split');
  handleNaturalLanguage(inputValue);
}
```

## Scroll Behaviors

### Auto-Scroll to New Content

```tsx
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (chatMode === 'split' || chatMode === 'full') {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages, chatMode]);

// In JSX, place sentinel at end of messages list
<div ref={messagesEndRef} />
```

### Scroll Containers

```tsx
// Thin scrollbar styling
<div className="overflow-y-auto scrollbar-thin">
  {/* Scrollable content */}
</div>

// Hide scrollbar entirely
<div className="overflow-y-auto no-scrollbar">
  {/* Scrollable content */}
</div>
```

## Selection Patterns

### Multi-Verse Selection

Parent component tracks selected verses as `number[]`:

```tsx
const [selectedVerses, setSelectedVerses] = useState<number[]>([]);

// Click to select one verse
const handleVerseClick = (verseNum: number) => {
  setSelectedVerses([verseNum]);
};

// Shift-click to extend selection
const handleVerseShiftClick = (verseNum: number) => {
  setSelectedVerses(prev => {
    if (prev.length === 0) return [verseNum];
    const min = Math.min(...prev, verseNum);
    const max = Math.max(...prev, verseNum);
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  });
};

// Click outside to clear
const handleBackgroundClick = () => {
  setSelectedVerses([]);
};
```

### Toggle Pattern (Highlight Colors)

```tsx
onClick={() => onHighlight(currentHighlight === color.id ? null : color.id)}
```

Click the same option to deselect. Pass `null` to clear.

## Loading and Transitions

### Optimistic Copy Feedback

```tsx
const [copied, setCopied] = useState(false);

const handleCopy = useCallback(() => {
  onCopy();
  setCopied(true);
  setTimeout(() => setCopied(false), 1800);
}, [onCopy]);

// In JSX
{copied ? <Check size={13} /> : <Copy size={13} />}
{copied ? 'Done' : 'Copy'}
```

### Progressive Reveal

Combine `animate-fade-in` on view containers with staggered children:

```tsx
<div className="animate-fade-in space-y-4">
  {sections.map((section, i) => (
    <div
      key={section.id}
      className="opacity-0 animate-fade-in-up"
      style={{ '--i': i } as React.CSSProperties}
    >
      {section.content}
    </div>
  ))}
</div>
```

## Touch Target Requirements

All interactive elements must meet minimum touch target sizes:

| Element | Minimum Size | Implementation |
|---------|-------------|----------------|
| Buttons | 44x44px | `p-2.5` or explicit `min-w-[44px] min-h-[44px]` |
| Icons (clickable) | 44x44px | Padding around icon: `p-2` with 16px icon |
| Highlight color dots | 24x24px visual, 44x44px target | `w-6 h-6` with gap between dots |
| Close buttons | 44x44px | `p-1.5` with adequate hit area |

Small visual elements can have large touch targets via padding. The visual element can be 24px but the tappable area should be 44px.
