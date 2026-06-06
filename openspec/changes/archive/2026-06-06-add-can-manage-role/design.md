## Context

The `RoleType` enum defines a privilege hierarchy: `System > SystemAdmin > CompanyAdmin > Accountant > Manager > Employee`. Currently, `UserService.create()` calls `this.accessService.canOperateRoleType(currentRoleType, newRoleType)` but this method does not exist on `UserAccessService`, causing a compilation error. There is no mechanism to enforce role hierarchy during user creation or role assignment.

The `System` role is special: it's used only by internal services (cron jobs, migrations via `getSystemUserId()`) and is never accessible via the API. Auth middleware should already reject System-role API calls, but `canManageRole` adds a defense-in-depth guard by rejecting `System` as a target role.

## Goals / Non-Goals

**Goals:**

- Add `canManageRole(current, target): boolean` to `UserAccessService` — synchronous, no DB queries
- Enforce that a role can only manage roles at or below its own level in the hierarchy
- Enforce that `System` can never be assigned as a target role
- Fix the broken `canOperateRoleType` call in `UserService.create()`
- Add the same check to `UserService.update()` to prevent role escalation

**Non-Goals:**

- Changing the existing `canUser()` method or its behavior
- Adding new API endpoints
- Changing the RoleType enum values or their ordering
- Implementing company-scoped role restrictions (a CompanyAdmin should not manage users in another company — that's handled by `canOrFail` with `{ companyId }` context)

## Decisions

### Decision 1: Synchronous method, no DB access

**Choice**: `canManageRole` is a pure synchronous function that compares enum index positions.

**Rationale**: Both arguments are already-resolved `RoleType` values (no DB lookup needed). The hierarchy is static and known at compile time. Making it async would add unnecessary overhead and complexity.

### Decision 2: Method name `canManageRole`

**Choice**: Simple, clear name that describes exactly what it does.

**Alternative considered**: `canOperateRoleType` (existing broken call) — too vague, doesn't convey the hierarchy concept. `canUserRoleOperateOnRoleType` — too verbose for a simple index comparison.

### Decision 3: Reject System as target role

**Choice**: `canManageRole` returns `false` when `target === RoleType.System`, regardless of the current role.

**Rationale**: The System role is internal-only (cron, migrations). It should never be assigned through the API. Even SystemAdmin should not be able to grant System role to a user via the API.

### Decision 4: Hierarchy defined as a static array in the method

**Choice**: The role hierarchy is defined as a constant array inside the method: `[System, SystemAdmin, CompanyAdmin, Accountant, Manager, Employee]`. A role can manage roles with equal or higher index (i.e., equal or lower privilege).

**Rationale**: The order matches the `RoleType` enum definition. Keeping it as an explicit array makes the hierarchy visible and easy to modify. Using `indexOf` is clear and performant for a 6-element array.

## Risks / Trade-offs

- **[Hardcoded hierarchy]** The role order is defined in code, not in configuration or the database. Changes to the role hierarchy require a code change. → **Mitigation**: The hierarchy rarely changes, and when it does, it should be an intentional deployment.
- **[Self-assignment]** `canManageRole(CompanyAdmin, CompanyAdmin)` returns `true` (current role can manage same-level roles). This is correct for "create a user with the same role" but also allows "change your own role to the same level." → **Mitigation**: This is acceptable — same-level role assignment is a standard permission pattern.