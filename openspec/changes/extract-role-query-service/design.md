## Context

`UserAccessService` and `UserRoleService` form a circular dependency that causes a runtime `ReferenceError`. The cycle stems from `UserAccessService` injecting `UserRoleService` to call role-query methods, while `UserRoleService` extends `BaseUserAccess` which depends on `IUserAccessService`. The existing `forwardRef` workaround does not prevent the barrel-file evaluation cycle that causes the reference error.

```
Current (broken):

  UserAccessService ──injects──▶ UserRoleService
       ▲                              │
       │                              ▼
       └── IUserAccessService ◀── BaseUserAccess ◀── extends UserRoleService

  Plus barrel cycle:
  user-access/index.ts ◀──▶ user-role/index.ts
```

`UserRoleService` currently has two responsibilities: (1) access-checked CRUD and (2) simple role queries used by `UserAccessService`. The role-query methods (`hasGlobalRole`, `hasCompanyRole`, etc.) don't need access-control enforcement — they're called BY the access-control service itself.

## Goals / Non-Goals

**Goals:**
- Eliminate the circular dependency between `UserAccessService` and `UserRoleService`
- Remove all `forwardRef` usage between these modules
- Remove the `user-role/index.ts` barrel that amplifies the evaluation cycle
- Keep `IUserAccessService` interface — it's the correct abstraction for DI inversion
- Make the dependency graph unidirectional

**Non-Goals:**
- Changing any API routes, DTOs, or controller behavior
- Changing the `BaseUserAccess` abstract class or its usage in other services
- Implementing the TODO access-check logic in `UserAccessService.isAllowed`
- Adding tests (existing tests continue to work unchanged)

## Decisions

### Decision 1: Extract `RoleQueryService` from `UserRoleService`

Move all read-only role-query methods into a new `RoleQueryService` that does NOT extend `BaseUserAccess` and does NOT inject `IUserAccessService`.

Methods to extract:
- `hasGlobalRole(userId, roleType)` → used by `UserAccessService.isAllowed`
- `hasCompanyRole(userId, companyId, roleType)` → used by `UserAccessService.isAllowed`
- `getUserCompanyRoleType(userId, companyId)` → may be used elsewhere
- `getUserCompanyRoleTypeOrFail(userId, companyId)` → may be used elsewhere
- `findOneByCompanyName(userId, name)` → may be used elsewhere
- `count(userId, companyId)` → may be used elsewhere

**Rationale**: These methods perform simple repository queries with no access-control enforcement. They're called by `UserAccessService` itself, so wrapping them in access checks would be circular. Extracting them eliminates the cycle entirely.

**Alternative considered**: Remove `IUserAccessService` and use concrete `UserAccessService` everywhere. Rejected because it would require `forwardRef` in every service extending `BaseUserAccess` (15+ services), and loses the type-safety and testability benefits of the interface.

**Alternative considered**: Remove `user-role/index.ts` barrel only. Rejected because while it fixes the runtime error, the circular DI still exists and `forwardRef` remains fragile.

### Decision 2: `RoleQueryService` lives in `user-role` resource directory

The new service uses the same `UserRole` entity and repository, so it belongs in `apps/api/src/resources/user-role/`. It's registered as a provider in `UserRoleModule` and exported for consumption by `UserAccessModule`.

### Decision 3: `UserAccessService` injects `RoleQueryService` instead of `UserRoleService`

After extraction, `UserAccessService` only needs `hasGlobalRole` and `hasCompanyRole` — both move to `RoleQueryService`. No `forwardRef` needed.

### Decision 4: Remove `user-role/index.ts` barrel

Replace the 3 barrel imports with direct file-path imports. This eliminates the module-evaluation cycle path that causes `ReferenceError`.

### Decision 5: Dependency graph becomes unidirectional

```
After (clean):

  UserAccessService ──injects──▶ RoleQueryService  (no cycle)
                                       │
  UserRoleService ──extends──▶ BaseUserAccess ──uses──▶ IUserAccessService
                                                              ▲
                                                              │
                                          UserAccessService implements IUserAccessService
```

No `forwardRef` anywhere.

## Risks / Trade-offs

- **Duplicate repository injection**: Both `UserRoleService` and `RoleQueryService` inject the same `UserRole` repository. This is acceptable — NestJS's singleton scope means they share the same repository instance. No memory or connection-pool concern.
- **Method location confusion**: `hasGlobalRole` and `hasCompanyRole` move out of `UserRoleService`. Callers importing from `UserRoleService` will need to update. Search for all callers before extracting.
- **`UserRoleModule` must export `RoleQueryService`**: `UserAccessModule` imports `UserRoleModule` to get `RoleQueryService`. This is a one-way import — no cycle.

## Migration Plan

1. Create `RoleQueryService` with the extracted methods
2. Register `RoleQueryService` in `UserRoleModule` providers/exports
3. Switch `UserAccessService` to inject `RoleQueryService` instead of `UserRoleService`
4. Remove `forwardRef` from both modules
5. Remove `user-role/index.ts` and update 3 import paths
6. Run lint + typecheck to verify no regressions

No database changes. No API changes. Rollback is straightforward — revert the commits.

## Open Questions

- Should `count` and `findOneByCompanyName` stay in `UserRoleService` since they may not be called by `UserAccessService`? Leaving them in `UserRoleService` avoids touching more files, but moving them to `RoleQueryService` keeps all query methods together. **Leaning toward moving all query methods** for consistency.