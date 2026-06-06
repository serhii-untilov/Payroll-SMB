## Context

The user-role resource was partially implemented with copy-paste artifacts from the company resource, resulting in multiple build-breaking errors and deviations from the established full-feature resource pattern. The resource cannot compile currently due to missing imports, invalid destructuring, and wrong argument counts. Beyond build errors, it lacks authorization checks, proper REST patterns, version parameters for optimistic concurrency, and returns raw entities instead of DTOs.

The company resource serves as the canonical full-feature pattern. All other full-feature resources (person, position, payroll, payment) follow it. The user-role resource must be brought into alignment.

## Goals / Non-Goals

**Goals:**

- Fix all build-breaking errors so the project compiles
- Align the user-role service with the full-feature resource pattern (userId as first param, version for optimistic concurrency, canOrFail authorization)
- Align the user-role controller with the full-feature resource pattern (correct route decorators, version path params, @Body decorators, authorization guards)
- Replace the non-existent `FindUserRoleDto` with the existing `ListUserRolesQueryDto`
- Ensure all CRUD endpoints exist (including missing update)
- Make the resource follow REST conventions consistent with other resources

**Non-Goals:**

- Adding a response mapper/DTO transformation layer (separate concern, existing DTOs can be wired in later)
- Changing the database schema or entity definition
- Fixing other resources (scope limited to user-role)
- Updating the web frontend to match new API routes (separate change)

## Decisions

### Decision 1: Replace FindUserRoleDto with ListUserRolesQueryDto

**Choice**: Remove `FindUserRoleDto` usage entirely. Use `ListUserRolesQueryDto` for `findAll` and simplify `findOne` to `@Get(':id')` with no request body (matching company pattern).

**Rationale**: `FindUserRoleDto` does not exist and its intended purpose overlaps with `ListUserRolesQueryDto` which already exists. The company `findOne` takes only `id` with no body, so `FindUserRoleDto` is unnecessary there too.

### Decision 2: Separate userId as first method parameter

**Choice**: `findAll(userId: string, query: ListUserRolesQueryDto)`, `findOne(userId: string, id: string)`, etc. — `userId` is always the first param, never embedded in a DTO.

**Rationale**: Matches every other full-feature resource and the `user-access` spec requirement. The current code tried to destructure `userId` from the DTO, which is both invalid syntax and architecturally wrong.

### Decision 3: Restore standard REST routes

**Choice**: `@Get()` for list, `@Get(':id')` for findOne, `@Post()` for create, `@Patch(':id/:version')` for update, `@Delete(':id/:version')` for remove, `@Post(':id/restore/:version')` for restore.

**Rationale**: The current `@Post('list')` and `@Post('find/:id')` are non-RESTful and inconsistent. Every other resource uses GET for reads.

### Decision 4: Fix Resource enum and property name

**Choice**: Change `public readonly userRoleResource = Resource.Company` to `public readonly resource = Resource.UserRole`.

**Rationale**: `Resource.Company` is a copy-paste error. The property name `resource` matches the convention used by all other services.

## Risks / Trade-offs

- **[Breaking API routes]** `POST /user-roles/find/:id` → `GET /user-roles/:id` and `POST /user-roles/list` → `GET /user-roles` — **Mitigation**: Frontend clients must be updated. Coordinate deployment.
- **[Breaking: version param required]** `remove` and `restore` routes now require `:version` path param — **Mitigation**: Same pattern already applied to other resources; frontend needs to send version.
- **[DTO response transformation]** For now, some endpoints still return raw `UserRole` entities rather than DTOs. This is acceptable as a follow-up, since adding a mapper is a separate concern and doesn't block compilation or correctness.