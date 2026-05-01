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
- Respect multi-tenant access (ABAC/RBAC)

## Rules

- Do NOT user `Action` from rxjs, instead use `Action` from `@/types`
- Do NOT use raw TypeORM `BaseEntity` — use project BaseEntity
- Do NOT introduce CQRS pattern
- Always use extends BaseEntity for a resource class, find the BaseEntity in the project, don't use raw TypeORM
- Do NOT use `checkVersionOrFail`, instead use `version: number` as a parameter for update, remove, or delete repository operations, if entity extends the BaseEntity abstract class.
- Always use `deepTransformToShortDate(params)` if params type has a Date type member
- Always describe members of a DTO class using `ApiProperty` and `ApiPropertyOptional` from `@nestjs/swagger`, using `Type` from `class-transformer`, using `Is*` from `class-validator`
- Always describe members of an entity class using `typeorm` types annotations
- Always name module, controller, service in singular, examples: CompanyModule, not CompaniesModule, DepartmentController, not DepartmentsController, PaymentService, not PaymentsService. The same for parameters and variables for modules, controllers, and services. The same for a file name, examples: company.controller.ts, not companies.controller.ts, department.service.ts, not departments.service.ts, payment.module.ts, not payments.module.ts.

## Security

- Respect tenant isolation
- No auth bypass
- No unsafe queries
- Do not expose internal APIs or secrets
- Do not bypass authorization checks
- All queries must respect tenant boundaries
- Never return data without access validation

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
