# React Official Best Practices (Reference)

Self-contained reference summarizing official React guidance for practical coding tasks.

## 1. Source Baseline

Based on official React documentation (react.dev, React 18/19).
Use project constraints over generic defaults when they conflict.

## 2. Core Rules

### 2.1 Keep Components and Hooks Pure

- Render logic must be pure: same inputs → same output, no side effects during render.
- Do not modify external variables, call APIs, or set timers during render.
- Place side effects in event handlers or `useEffect`.

```tsx
// BAD — side effect during render
function Counter() {
  let count = 0;
  count++; // Mutates outside variable during render
  return <p>{count}</p>;
}

// GOOD — side effect in event handler
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 2.2 Hooks Rules (Strict)

- Call hooks **only at the top level** — never inside conditions, loops, or nested functions.
- Call hooks **only from React components or custom hooks** — never from regular functions.
- Custom hooks must start with `use` prefix.

```tsx
// BAD
function Component({ show }) {
  if (show) {
    const [val, setVal] = useState(0); // Conditional hook call
  }
}

// GOOD
function Component({ show }) {
  const [val, setVal] = useState(0); // Always called
  if (!show) return null;
  return <p>{val}</p>;
}
```

### 2.3 Immutable Props and State

- Never mutate props.
- Never mutate state objects/arrays in place.
- Always create new references for updates.

```tsx
// BAD — mutating state in place
function handleClick() {
  items.push(newItem);       // Mutates existing array
  setItems(items);           // Same reference, React won't re-render
}

// GOOD — immutable update
function handleClick() {
  setItems([...items, newItem]);            // Array: spread + append
  setUser({ ...user, name: 'New Name' });   // Object: spread + override
  setItems(items.filter(i => i.id !== id)); // Array: filter for removal
  setItems(items.map(i =>
    i.id === id ? { ...i, done: true } : i  // Array: map for update
  ));
}
```

## 3. State Modeling

### 3.1 Choose Minimal Correct State

- **Avoid redundant state** — if computable from existing state/props, compute during render:
  ```tsx
  // BAD
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0); // Redundant

  // GOOD
  const [items, setItems] = useState([]);
  const count = items.length; // Derived during render
  ```
- **Avoid duplicated state** across siblings — lift to nearest common parent.
- **Avoid contradictory states** — use a single state with union values:
  ```tsx
  // BAD — contradictory booleans
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // GOOD — single status
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  ```

### 3.2 Structure State for Change Safety

- Group values that always update together into one state object.
- Keep independent concerns in separate state variables.
- Normalize deeply nested state when deep updates become error-prone:
  ```tsx
  // Flat/normalized structure
  const [items, setItems] = useState<Record<string, Item>>({});
  const [order, setOrder] = useState<string[]>([]);
  ```

### 3.3 Share State Deliberately

- **Lift state up** for sibling coordination — move state to the nearest common parent.
- **Use Context** for cross-tree shared state when prop drilling is excessive.
- Keep context values stable (memoize if necessary) and scoped.
- Split contexts by concern:
  ```tsx
  <AuthContext.Provider value={auth}>
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  </AuthContext.Provider>
  ```

## 4. Effects

### 4.1 Effect Triage (Decision Tree)

Before writing `useEffect`, ask:

1. **Caused by user interaction?** → Put it in the **event handler**.
   ```tsx
   // BAD
   useEffect(() => {
     if (submitted) sendAnalytics();
   }, [submitted]);

   // GOOD
   function handleSubmit() {
     submit(data);
     sendAnalytics();
   }
   ```

2. **Derives UI state from existing data?** → **Compute during render**.
   ```tsx
   // BAD
   const [fullName, setFullName] = useState('');
   useEffect(() => {
     setFullName(firstName + ' ' + lastName);
   }, [firstName, lastName]);

   // GOOD
   const fullName = firstName + ' ' + lastName;
   ```

3. **Synchronizes with an external system?** → Use `useEffect`.
   - Network requests, browser API subscriptions, third-party widgets, WebSockets, timers.

### 4.2 Dependency Discipline

- Respect `eslint-plugin-react-hooks` exhaustive-deps rule — never suppress it.
- If a dependency causes unwanted re-runs, **refactor**:
  - Move stable logic outside the component.
  - Use updater forms: `setCount(c => c + 1)` (no dependency on `count`).
  - Split effects by responsibility.
  - Wrap object/function deps in `useMemo`/`useCallback` if they must be stable.

### 4.3 Cleanup and Race Safety

```tsx
useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    const result = await fetch(`/api/items/${id}`);
    const data = await result.json();
    if (!cancelled) setData(data);
  }

  fetchData();
  return () => { cancelled = true; };
}, [id]);
```

- **Always return cleanup** for subscriptions, timers, and event listeners.
- **Guard async effects** against stale responses with a cancelled flag or AbortController.

## 5. Rendering, Keys, and Reset

### 5.1 Stable Identity with Keys

- Use stable business identifiers as keys (database IDs, unique slugs):
  ```tsx
  {items.map(item => <Item key={item.id} data={item} />)}
  ```
- **Avoid index keys** for reorderable/insertable/filterable lists — they cause state mismatches.
- **Avoid random keys** (`Math.random()`) in render — they force remount every render.
- Index keys are acceptable only for static, never-reordered display lists.

### 5.2 Preserve or Reset State with Key

React preserves state by component position + type. Use `key` to control this:

```tsx
// Reset component state when switching users
<UserProfile key={userId} userId={userId} />
```

When `userId` changes, React unmounts the old instance and mounts a fresh one.

### 5.3 Conditional Rendering

- Prefer early returns over deeply nested ternaries.
- Use `&&` carefully — falsy values like `0` render as text:
  ```tsx
  // BAD — renders "0"
  {count && <Badge count={count} />}

  // GOOD
  {count > 0 && <Badge count={count} />}
  ```

## 6. Tooling and Compiler

### 6.1 Project Setup

- For production apps: use a framework (Next.js, Remix, React Router v7).
- For custom stacks: use Vite with React plugin.
- Treat Create React App as deprecated — do not use for new projects.

### 6.2 React Compiler

- React Compiler auto-memoizes components and hooks when enabled.
- If enabled: **do not add manual `useMemo`/`useCallback`** unless profiling shows the compiler missed a case.
- If not enabled: use manual memoization sparingly, only where profiling proves need.

### 6.3 Performance Optimization Order

1. **Profile first** — use React DevTools Profiler.
2. **Fix the architecture** — lift computation to server, restructure state.
3. **Memoize last** — `React.memo`, `useMemo`, `useCallback` only for verified bottlenecks.

### 6.4 Lint and Dev Safety

- Use `eslint-plugin-react-hooks` — keep `rules-of-hooks` and `exhaustive-deps` enabled.
- Keep `<StrictMode>` enabled in development.
- Resolve warnings through code changes, not suppression.

## 7. Common Patterns

### 7.1 Custom Hooks

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

- Name must start with `use`. Each call gets isolated state. Keep hooks focused.

### 7.2 Controlled vs Uncontrolled Inputs

```tsx
// Controlled — React owns the value
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />

// Uncontrolled — DOM owns the value
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} defaultValue="" />
```

- Prefer controlled for forms needing validation.
- Never mix controlled and uncontrolled on the same input.

### 7.3 Error Boundaries

- Wrap route segments, feature sections, or third-party integrations.
- Error boundaries catch render errors, not event handler errors.
- In Next.js App Router, use `error.tsx` instead of manual error boundaries.

## 8. Validation Checklist

Before finishing a change:

1. Confirm hooks rules and lint pass — no conditional hooks, no missing dependencies.
2. Confirm no in-place mutation of props or state.
3. Confirm effects are only for external synchronization.
4. Confirm keys are stable business identifiers — no index keys on dynamic lists.
5. Confirm state is minimal — no redundant, duplicated, or contradictory state.
6. Run `lint`, `typecheck`, and `test` for changed scope.
7. For bug fixes, document root cause evidence.
