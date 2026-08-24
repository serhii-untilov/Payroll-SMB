## Why

`UserAccessService` and `UserRoleService` form a circular dependency. `UserAccessService` injects `UserRoleService` to call role-query methods (`hasGlobalRole`, `hasCompanyRole`, etc.), while `UserRoleService` extends `BaseUserAccess` which depends on `IUserAccessService`. This cycle currently causes a `ReferenceError: Cannot access 'UserAccessService' before initialization` at runtime, and the existing `forwardRef` workaround is fragile. The root cause is that role-query methods don't belong to the same domain as access-checked CRUD operations.

## What Changes

- Extract role-query methods (`hasGlobalRole`, `hasCompanyRole`, `getUserCompanyRoleType`, `getUserCompanyRoleTypeOrFail`, `count`, `findOneByCompanyName`) from `UserRoleService` into a new `RoleQueryService`
- `RoleQueryService` does NOT extend `BaseUserAccess` and does NOT depend on `IUserAccessService`, breaking the cycle
- `UserAccessService` injects `RoleQueryService` instead of `UserRoleService`, eliminating the need for `forwardRef`
- Remove `IUserAccessService` injection from `UserRoleService` constructor — `UserRoleService` already calls `requireAccessOrFail` via `BaseUserAccess` so it already receives `IUserAccessService`; but since `RoleQueryService` extracted out, `UserRoleService` no longer needs `IUserAccessService` directly for the role queries that `UserAccessService` was calling
- Remove `forwardRef` from both modules — no longer needed
- Remove the `user-role/index.ts` barrel file, replacing barrel imports with direct file-path imports (3 consumers)

## Capabilities

### New Capabilities
- `role-query-service`: A simple injectable service providing read-only role lookup methods (`hasGlobalRole`, `hasCompanyRole`, `getUserCompanyRoleType`, `getUserCompanyRoleTypeOrFail`, `count`, `findOneByCompanyName`) without access-control enforcement or `BaseUserAccess` inheritance

### Modified Capabilities
- `user-access`: Remove circular dependency by injecting `RoleQueryService` instead of `UserRoleService`; remove `forwardRef` from both `UserAccessModule` and `UserRoleModule`

## Impact

- **New files**: `apps/api/src/resources/user-role/role-query.service.ts`
- **Modified files**: `user-access.service.ts`, `user-access.module.ts`, `user-role.service.ts`, `user-role.module.ts`, `company.module.ts`
- **Removed files**: `user-role/index.ts` (barrel)
- **No API changes** — this is an internal refactoring; no controller routes or DTOs are affected
- **No database changes** — `RoleQueryService` uses the same `UserRole` repository