# Propwise — Customer Activity Dashboard

Full-stack customer management dashboard with real-time updates, Redis caching, and sensitive field protection.

## Tech Stack

**Backend:** NestJS, PostgreSQL, Redis, TypeORM, Socket.IO
**Frontend:** Next.js (App Router), React 19, TanStack Query, Tailwind CSS, Sonner

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- Docker (for PostgreSQL + Redis)

### 1. Clone & install

```bash
git clone <repo-url>
cd propwise
pnpm install
```

### 2. Start infrastructure

```bash
docker compose up -d
```

Starts PostgreSQL (port 5433) and Redis (port 6379).

### 3. Configure environment

```bash
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```

### 4. Run migrations

```bash
cd packages/backend
pnpm migration:run
```

### 5. Start both apps

```bash
# From root
pnpm dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## API Overview

| Method | Path            | Notes                                                                                                 |
| ------ | --------------- | ----------------------------------------------------------------------------------------------------- |
| GET    | /customers      | Paginated list. Supports `q`, `page`, `limit`, `sortBy`, `sortOrder`, `createdAfter`, `createdBefore` |
| GET    | /customers/:id  | Single customer                                                                                       |
| POST   | /customers      | Create customer                                                                                       |
| PUT    | /customers/:id  | Update customer                                                                                       |
| DELETE | /customers/:id  | Soft delete                                                                                           |
| DELETE | /customers/bulk | Bulk soft delete. Body: `{ ids: [...] }`                                                              |

---

## Sensitive Data Protection

**Core principle:** No separate internal endpoints. All reads and writes use the same endpoints. The `x-internal: true` header controls data exposure.

### How it works

1. **InternalAccessGuard** runs on every request, reads the `x-internal` header, sets `req.isInternal` boolean
2. **Write path:** Without `x-internal`, `national_id` and `internal_notes` are stripped from the payload before persisting
3. **Read path:** Response DTOs are explicitly constructed — `CustomerPublicDto` omits sensitive fields, `CustomerInternalDto` includes them
4. **Cache partitioning:** Redis cache keys include `internal=true/false` so public and internal responses are never mixed
5. **Socket payloads:** Always non-sensitive (`{ id, full_name, email }` only). Frontend refetches via HTTP with appropriate header

### Frontend

An admin toggle switches between Public and Internal mode:

- Toggles `isInternal` in React context
- Syncs to axios interceptor (adds/removes `x-internal: true` header)
- TanStack Query keys include `isInternal`, so toggling triggers automatic refetch
- Internal columns (National ID, Internal Notes) are only rendered in internal mode
- Amber styling signals sensitive data visibility

---

## Caching Strategy

### Redis (Server)

- **Cache-aside pattern:** Read cache → fallback to DB → write cache
- **Versioned invalidation:** `customers:version` counter increments on any write. Old keys become stale naturally (60s TTL)
- **Key format:** `customers:list:v{version}:{paramsHash}:internal={bool}` and `customers:byId:{id}:internal={bool}`
- **No SCAN:** Version-based invalidation avoids expensive Redis SCAN operations

### TanStack Query (Client)

- `staleTime: 30s` — avoids refetching on every mount
- `gcTime: 5min` — keeps unused cache for quick navigation
- Query keys include all params + `isInternal` — toggling mode = new cache entry
- Socket events trigger `invalidateQueries` for automatic refetch

---

## Real-Time Events

Socket.IO events emitted on every mutation:

| Event                    | Payload                    | Trigger                |
| ------------------------ | -------------------------- | ---------------------- |
| `customer.created`       | `{ id, full_name, email }` | POST /customers        |
| `customer.updated`       | `{ id, full_name, email }` | PUT /customers/:id     |
| `customer.deleted`       | `{ id }`                   | DELETE /customers/:id  |
| `customers.bulk_deleted` | `{ ids }`                  | DELETE /customers/bulk |

Frontend listens via `useCustomerEvents` hook → shows toast notification → invalidates TanStack Query cache → table updates without refresh.

---

## Trade-offs

| Decision                                    | Why                                          | Trade-off                                                                |
| ------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------ |
| OFFSET pagination                           | Simple, sufficient for dashboard scale       | Deep pages (>10k offset) slower — cursor-based better for large datasets |
| Version-based cache invalidation            | No SCAN, O(1) invalidation                   | Stale keys linger until TTL expires (60s) — acceptable for this use case |
| Module-level axios interceptor              | Works outside React tree                     | Requires sync component to bridge context → module variable              |
| Explicit DTOs (no class-transformer groups) | New entity fields don't accidentally leak    | More boilerplate than group-based serialization                          |
| Socket payloads always non-sensitive        | No risk of sensitive data over websockets    | Frontend must refetch via HTTP to get full data                          |
| `x-internal` as feature flag (not auth)     | Demonstrates conscious data exposure control | Real production would use JWT claims or mTLS                             |

```

---

### File summary
```

README.md (NEW)
packages/backend/.env.example (NEW)
packages/frontend/.env.example (NEW)
src/components/ui/skeleton.tsx (NEW)
src/components/layout/internal-banner.tsx (NEW)
src/components/customers/customer-table.tsx (MODIFIED — skeleton import)
src/app/page.tsx (MODIFIED — banner added)
