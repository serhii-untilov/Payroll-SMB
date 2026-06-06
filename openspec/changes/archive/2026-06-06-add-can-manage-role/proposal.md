## Why

`UserService.create()` calls `this.accessService.canOperateRoleType(currentRoleType, newRoleType)` but this method does not exist on `UserAccessService`, causing a compilation error. The project needs a role hierarchy check to enforce that users can only assign roles at or below their own level, and that the `System` role can never be assigned via the API.

## What Changes

- Add `canManageRole(current: RoleType, target: RoleType): boolean` method to `UserAccessService` — a synchronous hierarchy check based on the `RoleType` enum order
- Add a guard: `canManageRole` always returns `false` when `target === RoleType.System` (System role cannot be assigned via API)
- Rename the broken `canOperateRoleType` call in `UserService.create()` to `canManageRole`
- Add the same `canManageRole` check to `UserService.update()` to prevent role escalation on user modification

## Capabilities

### New Capabilities

- `role-hierarchy`: Role hierarchy enforcement — defines which roles can manage which other roles based on a static ordering

### Modified Capabilities

_(none)_

## Impact

- **Code**: `UserAccessService` (new method), `UserService` (fix broken call, add check to update)
- **No API changes** — this is internal service logic, no new endpoints