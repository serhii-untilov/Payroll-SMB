# AGENTS.md

## Monorepo structure

- `apps/api` — NestJS back-end, `apps/web` — React+Vite front-end
- `packages/shared` — types shared between api and web
- `packages/openapi` — generated OpenAPI client
- `packages/nginx`, `packages/postgres` — infra packages

## Entry points

- API bootstrap: `apps/api/src/main.ts`
- Web entry: `apps/web/src/main.tsx`
- Main domain example:
  - for a full-future resource: `apps/api/src/resources/company/`
  - for a simple resource: `apps/api/src/resources/laws/`
- Shared types: `packages/shared`

## Commands

```bash
npm run dev              # start docker DB, run migrations, launch api+web in dev mode
npm run build            # turbo build (api uses nest build, web uses vite build)
npm run lint             # turbo lint
npm run test             # turbo test (requires build first — see turbo.json)
npm run m:gen            # generate typeorm migration (requires running DB)
npm run m:run            # run migrations (NODE_ENV=production)
npm run codegen          # generate DTOs from OpenAPI spec
```

## Docs

- See docs/ folder
- index: `docs/Home.md`

## API specifics

- NestJS with TypeORM, `@/*` path maps to `./src/*` (see `apps/api/tsconfig.json`)
- `Resource` enum in `@/types` — services expose `public readonly resource = Resource.Xxx`
- `BaseEntity` in `src/resources/common/base/` — use instead of raw TypeORM `BaseEntity`
- `checkVersionOrFail(record, payload)` in `@/utils` — optimistic concurrency check
- `AvailableForUser` base class does **not** exist; `available*OrFail` methods are obsolete
- Resource pattern: simple `@Injectable()` service with CRUD, no CQRS (see `laws` resource)
- Tests: `NODE_ENV=test jest --passWithNoTests --bail` (Linux) in `apps/api`

## Web specifics

- React + MUI + Vite, `tsc -b` runs before vite build
- Tests: jest with `--passWithNoTests`

## Conventions

- TypeORM migrations in `apps/api/src/migrations/ddl/`, seeds in `src/migrations/seed/`
- DTOs in `dto/` folders, entities in `entities/` — auto-generated via `npm run codegen`
- Multi-tenant architecture with row-level (ABAC), role-based (RBAC), and field-level access

## Patterns

- Services are simple CRUD providers (no CQRS)
- Use enums for resource identification
- Prefer composition over inheritance

## How to add a new resource (API)

1. Create entity in `entities/`
2. Generate DTO via `npm run codegen` or create manually in `dto/`
3. Create service with CRUD methods:
    - see `company` for a full-future resource, or `laws` for a simple resource
    - ask me about resource type, if not specified
    - make migration to fill role permissions by resource type, as it described in the `docs/role-permission.md`
    - add role permissions functions into a CRUD methods
4. Add controller
5. Add migration if schema changed
6. Add tests (optional but preferred)

## Rules

- Do NOT use raw TypeORM `BaseEntity` — use project BaseEntity
- Do NOT introduce CQRS pattern
- Do NOT use deprecated `available*OrFail` methods
- Always use `checkVersionOrFail` for updates
- Respect multi-tenant access (ABAC/RBAC)

## Security

- Respect tenant isolation
- No auth bypass
- No unsafe queries
- Do not expose internal APIs or secrets
- Do not bypass authorization checks
- All queries must respect tenant boundaries
- Never return data without access validation
