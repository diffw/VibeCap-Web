# Data Mocking

Strategies for creating realistic mock data in the design prototype (`design/prototype/`).

## Centralized Mock Files

Each domain has its own `.ts` file with typed data:

| File | Domain | Contents |
|------|--------|----------|
| `BibleData.ts` | Scripture | `BibleBook[]`, verse arrays, reading history |
| `bible-versions.ts` | Translations | Version metadata, sample text per version |
| `prototype-support.ts` | Navigation | `ScriptureReference`, `PrototypePreset`, `SubView` |
| `theme-system.ts` | Theming | `Theme`, `StyleTheme`, color tokens |
| `useVerseAnnotations.ts` | User data | Highlights, notes (localStorage-backed) |

**Rule**: No inline mock data in component files. Import from centralized files.

## Type-First Approach

Define interfaces before creating mock data:

```tsx
// 1. Define the interface
export interface BibleBook {
  id: string;
  name: string;
  abbr: string;
  chapters: number;
  testament: 'OT' | 'NT';
  category: string;
}

// 2. Create typed data
export const BIBLE_BOOKS: BibleBook[] = [
  { id: 'GEN', name: 'Genesis', abbr: 'Gen', chapters: 50, testament: 'OT', category: 'Pentateuch' },
  // ...
];

// 3. Provide accessor helpers
export function getBook(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find(b => b.id === id);
}
```

**Why type-first**:
- Catches shape mismatches at compile time
- Documents the data contract for future API alignment
- Enables IDE autocomplete in components

## Realistic Content

Use real content, not lorem ipsum:

| Content Type | Source | Example |
|-------------|--------|---------|
| Bible text | Real Scripture passages | Psalm 23, Lamentations 3, John 1 |
| User avatars | Unsplash portrait URLs | `PROTOTYPE_USER_AVATAR` constant |
| Timestamps | Relative to `Date.now()` | `Date.now() - 86400000` (1 day ago) |
| Greek/Hebrew | Real transliterations | `logos`, `hesed` |
| Place names | Historical geography | Jerusalem, Second Temple Period |

```tsx
// Good: real, recognizable content
export const PROTOTYPE_USER_AVATAR = 'https://images.unsplash.com/photo-...';

// Good: relative timestamps that always feel fresh
const [readingHistory] = useState<ReadingHistoryItem[]>([
  { bookId: 'PSA', chapter: 23, timestamp: Date.now() - 86400000, label: 'Psalm 23' },
  { bookId: 'LAM', chapter: 3, timestamp: Date.now() - 172800000, label: 'Lamentations 3' },
]);
```

## Prototype Preset System

Not every passage has full data. Use a preset system to map supported passages:

```tsx
export type PrototypePreset = 'psalm23' | 'lamentations3' | 'john1';

export function resolvePrototypePreset(
  bookId: string | null | undefined,
  chapter: number | null | undefined,
): PrototypePreset | null {
  if (!bookId || !chapter) return null;
  if (bookId === 'PSA' && chapter === 23) return 'psalm23';
  if (bookId === 'LAM' && chapter === 3) return 'lamentations3';
  if (bookId === 'JHN' && chapter === 1) return 'john1';
  return null;
}
```

**Guard functions** check if a preset supports a specific feature:

```tsx
export function supportsStudyPreset(preset: PrototypePreset | null): preset is 'psalm23' | 'lamentations3' {
  return preset === 'psalm23' || preset === 'lamentations3';
}

export function supportsComparePreset(preset: PrototypePreset | null): preset is 'psalm23' {
  return preset === 'psalm23';
}
```

**Usage in components**:
```tsx
const preset = resolvePrototypePreset(currentBookId, currentChapter);

if (supportsStudyPreset(preset)) {
  // Render study panel with full data
} else {
  // Render fallback / "coming soon" state
}
```

## State Simulation

Pre-populate state to show the prototype in a realistic "lived-in" condition:

```tsx
// Pre-populated messages (CommandBar)
const [messages, setMessages] = useState<Message[]>([
  {
    id: 1,
    role: 'ai',
    text: "Welcome to Bible Space. Ask me anything, or type / for quick commands.",
    time: "Just now",
  }
]);

// Pre-populated reading history (App)
const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>([
  { bookId: 'PSA', chapter: 23, timestamp: Date.now() - 86400000, label: 'Psalm 23' },
  { bookId: 'LAM', chapter: 3, timestamp: Date.now() - 172800000, label: 'Lamentations 3' },
  { bookId: 'JHN', chapter: 1, timestamp: Date.now() - 259200000, label: 'John 1' },
]);

// Pre-populated annotations (localStorage)
// useVerseAnnotations hook loads/saves from localStorage automatically
```

**Relative timestamps**: Always derive from `Date.now()` so they feel current:
```tsx
Date.now() - 86400000   // 1 day ago
Date.now() - 172800000  // 2 days ago
Date.now() - 259200000  // 3 days ago
```

## Image Handling

### Avatar Constant

Define a single source of truth for prototype user avatar:

```tsx
export const PROTOTYPE_USER_AVATAR = 'https://images.unsplash.com/photo-...';
```

Use `referrerPolicy="no-referrer"` on Unsplash images:
```tsx
<img src={PROTOTYPE_USER_AVATAR} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
```

### ImageWithFallback

Graceful degradation for external images:

```tsx
export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false);

  return didError ? (
    <div className="inline-block bg-gray-100 text-center align-middle">
      <img src={ERROR_IMG_SRC} alt="Error loading image" />
    </div>
  ) : (
    <img {...props} onError={() => setDidError(true)} />
  );
}
```

## Data Shape Alignment

Structure mock data to mirror future API contracts:

| Mock Pattern | Future API Pattern |
|-------------|-------------------|
| `BibleBook.id` string (`'PSA'`) | API resource identifier |
| `ScriptureReference { bookId, chapter }` | API query parameters |
| `VerseAnnotation { highlight, note }` | User data model |
| `ReadingHistoryItem { bookId, chapter, timestamp }` | Activity log entry |
| `PrototypePreset` union type | API feature flags |

When adding new mock data:
1. Define the TypeScript interface first
2. Consider what the real API response would look like
3. Use the same field names and shapes
4. Add accessor functions (`getBook()`) rather than raw array access
