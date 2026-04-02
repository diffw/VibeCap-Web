# Golang Google Official Best Practices (Reference)

Self-contained reference summarizing Google Go style guidance and Go official practices.

## 1. Source Baseline

Based on Google Go Style Guide, Effective Go, and Go Code Review Comments.
Use repository constraints as tie-breaker when recommendations conflict with existing architecture.

## 2. Style and Readability

### 2.1 Guiding Principles

Optimize for the **reader**, not the writer. In order of priority:
1. **Clarity** — code communicates its purpose unambiguously
2. **Simplicity** — code accomplishes its goal in the simplest way
3. **Concision** — code has a high signal-to-noise ratio
4. **Maintainability** — code can be easily changed by future maintainers
5. **Consistency** — code is consistent with the broader codebase

### 2.2 Formatting

- Use `gofmt` — no exceptions, no configuration.
- Use `goimports` if the project uses it (auto-organizes imports).
- Import grouping order: stdlib, third-party, internal packages (separated by blank lines).

### 2.3 Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Package | Short, lowercase, no underscores | `http`, `json`, `strconv` |
| Exported function | PascalCase, verb-noun | `ReadFile`, `ParseQuery` |
| Unexported function | camelCase | `readConfig`, `parseInput` |
| Interface | Describe behavior, -er suffix for one method | `Reader`, `Stringer`, `Handler` |
| Receiver | 1-2 letter abbreviation of type | `func (s *Store) Get()` |
| Constant | PascalCase exported, camelCase unexported | `MaxRetries`, `defaultTimeout` |
| Acronyms | All caps exported, all lower unexported | `HTTPClient`, `xmlParser` |

- Prefer clear names over abbreviations — `userCount` not `usrCnt`.
- Exception: short-lived variables in small scopes (`i`, `v`, `err`, `ctx`).
- Avoid stuttering: `user.Name` not `user.UserName`.

### 2.4 Comments

- Doc comments on all exported symbols — start with the symbol name:
  ```go
  // Store manages persistence for user records.
  type Store struct { ... }

  // Get retrieves a user by ID. Returns ErrNotFound if the user does not exist.
  func (s *Store) Get(ctx context.Context, id string) (*User, error) { ... }
  ```
- Explain **why**, not **what** — the code shows what.
- Package comment: one sentence in the package's main file.

## 3. Package Design and API Boundaries

### 3.1 Small, Cohesive Packages

- Each package should have a clear, single responsibility.
- Avoid catch-all `util`, `common`, `helpers` packages.
- Name packages by what they **provide**, not what they **contain**.

### 3.2 Exported API Discipline

- Export only stable, meaningful APIs — keep internal helpers unexported.
- Prefer concrete types over interfaces at API boundaries:
  ```go
  // GOOD — returns concrete type
  func NewStore(db *pgx.Pool) *Store { ... }

  // AVOID — returning interface when only one implementation exists
  func NewStore(db *pgx.Pool) StoreInterface { ... }
  ```
- "Accept interfaces, return structs."
- Introduce interfaces only when:
  - Multiple implementations exist or are planned.
  - Testing requires substitution.
  - The consumer defines the interface (consumer-side interfaces).

### 3.3 Constructor Pattern

```go
// Explicit constructor with required dependencies
func NewService(store *Store, cache *Cache) *Service {
    return &Service{store: store, cache: cache}
}

// Options pattern for optional configuration
type Option func(*Server)

func WithPort(port int) Option {
    return func(s *Server) { s.port = port }
}

func NewServer(opts ...Option) *Server {
    s := &Server{port: 8080} // Sensible defaults
    for _, opt := range opts {
        opt(s)
    }
    return s
}
```

## 4. Error Handling and Logging

### 4.1 Return Errors, Don't Panic

```go
// GOOD — return error
func ReadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("reading config %s: %w", path, err)
    }
    return cfg, nil
}

// BAD — panic for expected failures
func ReadConfig(path string) *Config {
    data, err := os.ReadFile(path)
    if err != nil {
        panic(err) // Don't do this
    }
}
```

- `panic` only for truly unrecoverable programmer errors (violated invariants).
- `log.Fatal` is acceptable in `main()` for startup failures.

### 4.2 Error Wrapping

```go
// Wrap with context — %w preserves cause chain
if err != nil {
    return fmt.Errorf("fetching user %s: %w", id, err)
}

// Check wrapped errors
if errors.Is(err, sql.ErrNoRows) {
    return ErrNotFound
}

// Type-assert wrapped errors
var pgErr *pgconn.PgError
if errors.As(err, &pgErr) {
    // Handle specific PostgreSQL error
}
```

- **Always wrap with context** — the full call chain should be readable from the error.
- Use `%w` when callers need unwrapping. Use `%v` when cause should be opaque.

### 4.3 Error Message Conventions

- Lowercase, no trailing punctuation: `"reading config: file not found"`
- No `"error:"` or `"failed to"` prefix — the call chain implies failure.
- Include the relevant identifier: `"fetching user abc-123: connection refused"`

### 4.4 Logging Discipline

- Log at the point where action is taken (retry, fallback, return to user).
- Avoid duplicate logging across layers:
  ```go
  // BAD — logged in repo AND handler
  func (r *Repo) Get(id string) (*Item, error) {
      item, err := r.db.Query(...)
      if err != nil {
          log.Error("query failed", "err", err) // Logged here
          return nil, err                         // AND by caller
      }
  }

  // GOOD — return wrapped error, let handler log
  func (r *Repo) Get(id string) (*Item, error) {
      item, err := r.db.Query(...)
      if err != nil {
          return nil, fmt.Errorf("querying item %s: %w", id, err)
      }
      return item, nil
  }
  ```

### 4.5 Sentinel Errors

```go
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
)

// Usage
if errors.Is(err, ErrNotFound) {
    http.Error(w, "Not found", http.StatusNotFound)
}
```

## 5. Concurrency and Context

### 5.1 Context Propagation

- Pass `context.Context` as the **first parameter**:
  ```go
  func (s *Service) GetUser(ctx context.Context, id string) (*User, error) {
      return s.store.FindUser(ctx, id)
  }
  ```
- **Never store context in structs** — always pass as function parameter.
- Never use `context.Background()` in request handlers — propagate the request context.
- `context.Background()` only in `main()`, initialization, or top-level background tasks.

### 5.2 Timeouts and Cancellation

```go
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()

resp, err := client.Do(req.WithContext(ctx))
```

- Add timeouts for all external I/O (HTTP, DB, gRPC).
- Always `defer cancel()` immediately after creating a derived context.
- Check `ctx.Err()` after long operations.

### 5.3 Goroutine Lifecycle

```go
// Explicit lifecycle with errgroup
func (s *Server) Start(ctx context.Context) error {
    g, ctx := errgroup.WithContext(ctx)

    g.Go(func() error {
        return s.httpServer.ListenAndServe()
    })

    g.Go(func() error {
        <-ctx.Done()
        return s.httpServer.Shutdown(context.Background())
    })

    return g.Wait()
}
```

- Every goroutine must have a clear shutdown path.
- Use `errgroup`, `sync.WaitGroup`, or channel patterns.
- Never fire-and-forget goroutines in request handlers.

### 5.4 Shared State

- Prefer **channels** for goroutine communication.
- **`sync.Mutex`** for simple shared state:
  ```go
  type Counter struct {
      mu    sync.Mutex
      value int
  }

  func (c *Counter) Inc() {
      c.mu.Lock()
      defer c.mu.Unlock()
      c.value++
  }
  ```
- **`sync.RWMutex`** when reads >> writes.
- **`sync.Once`** for one-time initialization.
- Keep mutex scopes small and flat.

## 6. Testing Strategy

### 6.1 Table-Driven Tests

```go
func TestParseID(t *testing.T) {
    tests := []struct {
        name    string
        input   string
        want    int
        wantErr bool
    }{
        {name: "valid", input: "42", want: 42},
        {name: "zero", input: "0", want: 0},
        {name: "negative", input: "-1", wantErr: true},
        {name: "empty", input: "", wantErr: true},
        {name: "non-numeric", input: "abc", wantErr: true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := ParseID(tt.input)
            if tt.wantErr {
                if err == nil {
                    t.Errorf("ParseID(%q) = %d, want error", tt.input, got)
                }
                return
            }
            if err != nil {
                t.Fatalf("ParseID(%q) unexpected error: %v", tt.input, err)
            }
            if got != tt.want {
                t.Errorf("ParseID(%q) = %d, want %d", tt.input, got, tt.want)
            }
        })
    }
}
```

### 6.2 Test Naming and Readability

- Test function: `TestFunctionName` or `TestType_Method`.
- Subtest names: descriptive, lowercase with spaces.
- Failure messages always include function, input, got, and want:
  ```go
  t.Errorf("GetUser(%q) = %v, want %v", id, got, want)
  ```

### 6.3 Test Helpers

```go
func newTestStore(t *testing.T) *Store {
    t.Helper()
    store := NewStore(testDB)
    t.Cleanup(func() { store.Close() })
    return store
}
```

- Use `t.Helper()` in test helpers — errors report caller's line.
- Use `t.Cleanup()` for teardown.
- Keep helpers focused, setup scoped to each test.

### 6.4 Race Detection

```bash
go test -race ./...
```

- Run in CI and during development for concurrency-sensitive code.
- Fix all detected races — they are real bugs.

### 6.5 Test Isolation

- Each test independent — no shared mutable state between tests.
- Use `t.Parallel()` where safe.
- Use subtests for scenario isolation.

## 7. Modules, Dependencies, and Project Layout

### 7.1 Module Boundaries

- `go.mod` at repository root (or per deployable unit in monorepo).
- `go.work` for multi-module workspaces during development.
- Pin and update dependencies intentionally.

### 7.2 Project Layout

```
apps/api/
├── cmd/
│   └── server/          # main.go — thin entry point
├── internal/
│   ├── config/          # Configuration loading
│   ├── domain/          # Business types and rules
│   ├── service/         # Business logic orchestration
│   ├── repository/      # Data access (interfaces + implementations)
│   ├── http/            # HTTP handlers and routing
│   └── db/              # Database connection and migrations
├── migrations/          # SQL migration files
├── go.mod
└── go.sum
```

- `cmd/` — thin entry points, no business logic.
- `internal/` — non-public, cannot be imported externally.
- Organize by **responsibility**, not by technical layer dogma.

### 7.3 Dependency Discipline

- Prefer standard library first → existing project deps → new deps only when significant value.
- Vet new dependencies for maintenance, security, and license.

## 8. Validation Checklist

Before finishing a change:

1. Confirm `gofmt` / `goimports` pass for touched files.
2. Confirm `go vet ./...` passes.
3. Confirm package/API changes are minimal and intentional.
4. Confirm error handling preserves semantics — wrapping with `%w`, no duplicate logging.
5. Confirm `context.Context` propagated correctly — first parameter, no struct storage.
6. Confirm goroutine lifecycles are explicit — shutdown paths defined.
7. Run `go test ./...` and `go test -race ./...` for changed scope.
8. For bug fixes, document root-cause evidence.
