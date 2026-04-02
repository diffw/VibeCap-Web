# Next.js Official Best Practices (Reference)

Self-contained reference summarizing official Next.js guidance for practical engineering work.

## 1. Source Baseline

Based on Next.js App Router official documentation (v14+).
Always prioritize repository constraints when they conflict with generic defaults.

## 2. Architecture and Routing

### 2.1 Prefer App Router for New Work

- Use App Router conventions for new features.
- Keep Pages Router code stable unless migration is explicitly requested.
- In hybrid repositories, isolate changes within the active router boundary.

### 2.2 File-System Conventions

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared shell, wraps child routes, preserves state across navigation |
| `page.tsx` | Route entry point, makes the route publicly accessible |
| `loading.tsx` | Instant loading UI via React Suspense, shown while route segment loads |
| `error.tsx` | Error boundary for the route segment, catches runtime errors |
| `not-found.tsx` | UI for `notFound()` calls or unmatched routes |
| `route.ts` | Server-side API endpoint (GET, POST, etc.), replaces API routes |
| `template.tsx` | Like layout but re-mounts on navigation (new instance per navigation) |
| `default.tsx` | Fallback UI for parallel routes when no match |
| `global-error.tsx` | Root-level error boundary, wraps the entire app |

### 2.3 Route Groups and Nested Layouts

- `(groupName)/` organizes routes without affecting URL paths.
- Keep layout nesting shallow and purposeful — each layout should serve a clear UI shell purpose.
- Avoid unnecessary parallel routes (`@slot`) or intercepting routes (`(.)`) unless UX specifically requires them.
- Use `loading.tsx` at each layout level where independent loading states are needed.

### 2.4 Dynamic Routes

- `[param]/` for single dynamic segments.
- `[...slug]/` for catch-all segments.
- `[[...slug]]/` for optional catch-all (matches the route with or without segments).
- Access params via the `params` prop in page/layout components.

## 3. Server and Client Boundaries

### 3.1 Default to Server Components

- All components in App Router are Server Components by default.
- Add `'use client'` only when the component needs:
  - Event handlers (`onClick`, `onChange`, etc.)
  - Browser APIs (`window`, `localStorage`, `navigator`)
  - React hooks that use state or effects (`useState`, `useEffect`, `useReducer`, `useContext`)
  - Third-party libraries that depend on client-only features
- Keep `'use client'` boundary as deep and narrow as possible — push it to leaf components.

### 3.2 Composition Pattern

```tsx
// ServerParent.tsx (Server Component — no directive needed)
import ClientButton from './ClientButton';

export default async function ServerParent() {
  const data = await fetchData(); // Direct server-side data access
  return (
    <div>
      <h1>{data.title}</h1>
      <ClientButton label={data.buttonText} />
    </div>
  );
}

// ClientButton.tsx
'use client';
export default function ClientButton({ label }: { label: string }) {
  return <button onClick={() => alert('clicked')}>{label}</button>;
}
```

### 3.3 Server-Only Safety

- Never import server-only code (DB queries, secrets, API keys) into client components.
- Use `import 'server-only'` package to poison client imports at build time:
  ```ts
  import 'server-only';
  export function getSecret() { return process.env.SECRET_KEY; }
  ```
- Never pass secrets as props to client components.
- Keep `process.env.SECRET_*` access strictly in Server Components, Server Actions, or Route Handlers.

## 4. Data Fetching, Caching, and Revalidation

### 4.1 Fetch Close to the Server Boundary

- Fetch data directly in Server Components using `async/await`:
  ```tsx
  export default async function Page() {
    const data = await fetch('https://api.example.com/data');
    return <div>{/* render data */}</div>;
  }
  ```
- Avoid internal network hops — don't call your own Route Handlers from Server Components. Call the data source directly.
- For parallel data fetching, use `Promise.all()`:
  ```tsx
  const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);
  ```

### 4.2 Caching Strategy

| Strategy | When to Use | How |
|----------|-------------|-----|
| Static (default) | Public, rarely changing data | Default `fetch()` behavior, cached at build |
| Time-based revalidation | Data that changes periodically | `fetch(url, { next: { revalidate: 3600 } })` |
| On-demand revalidation | Data changed by user action | `revalidateTag('tag')` or `revalidatePath('/path')` in Server Action |
| No cache | Per-request dynamic data | `fetch(url, { cache: 'no-store' })` |

- Be explicit about caching — never leave it ambiguous.
- Use `revalidateTag(tag)` to invalidate specific cached data after mutations.
- Use `revalidatePath(path)` to invalidate all data for a route.
- Avoid global `cache: 'no-store'` defaults unless strictly required.

### 4.3 Static vs Dynamic Rendering

**Static rendering** (default): page is rendered at build time and cached.

**Dynamic rendering** is triggered when the route uses:
- `cookies()` or `headers()` — request-time APIs
- `searchParams` prop in a Page component
- `fetch()` with `cache: 'no-store'`
- `connection()` or `draftMode()`

Minimize accidental dynamic rendering — isolate dynamic parts with Suspense:
```tsx
export default function Page() {
  return (
    <div>
      <StaticHeader />
      <Suspense fallback={<Loading />}>
        <DynamicContent />
      </Suspense>
    </div>
  );
}
```

## 5. Mutations and Server Actions

### 5.1 Use Server Actions for Trusted Mutations

```tsx
// actions.ts
'use server';

import { revalidateTag } from 'next/cache';

export async function updateItem(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error('Invalid input');

  await db.items.update(parsed.data);
  revalidateTag('items');
}
```

### 5.2 Server Action Rules

- Keep each action small and single-purpose.
- Always validate authorization — never trust the client.
- Always validate and sanitize input with Zod or similar.
- Return predictable shapes for UI error handling.
- Revalidate affected caches/tags after successful mutation.

### 5.3 Form Integration

```tsx
import { updateItem } from './actions';

export default function EditForm() {
  return (
    <form action={updateItem}>
      <input name="title" required />
      <button type="submit">Save</button>
    </form>
  );
}
```

Progressive enhancement with `useActionState`:
```tsx
'use client';
import { useActionState } from 'react';
import { updateItem } from './actions';

export default function EditForm() {
  const [state, action, isPending] = useActionState(updateItem, null);
  return (
    <form action={action}>
      <input name="title" required />
      <button disabled={isPending}>Save</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
```

## 6. Security, Auth, and Environment

### 6.1 Auth at the Data/Action Boundary

- Treat auth checks as server concerns, not client-only guards.
- Validate session/role at every data read and write point:
  ```tsx
  export default async function AdminPage() {
    const session = await getSession();
    if (!session?.isAdmin) redirect('/login');
    const data = await getAdminData();
    return <AdminDashboard data={data} />;
  }
  ```
- Never rely solely on client-side route protection.
- Check auth in Server Actions before performing mutations.
- Use middleware for broad route protection, but always re-check at the data layer.

### 6.2 Environment Variable Discipline

| Prefix | Visibility | Use Case |
|--------|-----------|----------|
| `NEXT_PUBLIC_` | Client + Server | Public app config (app name, public API URL) |
| No prefix | Server only | Secrets, API keys, DB credentials |

- Never import non-prefixed env vars in client components.
- Use `.env.local` for local development, never commit it.

### 6.3 Security Headers

Set via `next.config.js` `headers()`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` as appropriate

## 7. Performance and UX

### 7.1 Streaming with Suspense

```tsx
<Suspense fallback={<Skeleton />}>
  <SlowDataSection />
</Suspense>
```
- Keep the initial shell (navigation, layout) fast and interactive.
- Use `loading.tsx` for route-level loading states.

### 7.2 Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority          // For above-the-fold / LCP images
  placeholder="blur"
/>
```
- Always use `next/image` instead of `<img>` — automatic lazy loading, responsive sizing, WebP/AVIF.
- Always provide `width`/`height` or use `fill` to prevent layout shift.

### 7.3 Font Optimization

```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
  return <body className={inter.className}>{children}</body>;
}
```
- `next/font` self-hosts fonts at build time — zero layout shift, no external requests.

### 7.4 Script Loading

```tsx
import Script from 'next/script';

<Script src="https://analytics.example.com/script.js" strategy="lazyOnload" />
```

| Strategy | When |
|----------|------|
| `beforeInteractive` | Critical scripts needed before page interaction |
| `afterInteractive` | Load after page is interactive (default) |
| `lazyOnload` | Load during idle time |
| `worker` | Load in web worker (experimental) |

### 7.5 Bundle Optimization

- Minimize `'use client'` surface area.
- Use dynamic imports for heavy client-only code:
  ```tsx
  const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
    loading: () => <Skeleton />,
    ssr: false,
  });
  ```
- Use `@next/bundle-analyzer` to inspect bundle composition.

### 7.6 Metadata API

```tsx
// Static
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

// Dynamic
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await fetchData(params.id);
  return { title: data.title };
}
```

## 8. Validation Checklist

Before finishing a change:

1. Confirm route conventions are correct (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
2. Confirm server/client split is intentional — `'use client'` only where necessary.
3. Confirm caching/revalidation matches product requirements.
4. Confirm auth and secret handling remain server-safe.
5. Confirm Server Actions validate authorization and input.
6. Run `lint`, `typecheck`, `test`, and `next build` for changed scope.
7. Flag any accidental dynamic rendering triggers.
