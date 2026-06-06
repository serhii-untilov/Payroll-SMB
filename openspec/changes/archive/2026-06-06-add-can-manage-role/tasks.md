## 1. Add canManageRole to UserAccessService

- [x] 1.1 Add `canManageRole(current: RoleType, target: RoleType): boolean` method to `UserAccessService` with a static hierarchy array `[System, SystemAdmin, CompanyAdmin, Accountant, Manager, Employee]`, returning `false` if `target === System`, otherwise comparing `indexOf(current) <= indexOf(target)`
- [x] 1.2 Add `RoleType` import to `user-access.service.ts` if not already present

## 2. Fix UserService

- [x] 2.1 In `UserService.create()`, rename `canOperateRoleType` call to `canManageRole` (fixing the broken compilation)
- [x] 2.2 Skipped — role changes go through `UserRole` resource, not `User.update()` (UpdateUserDto has no roleId)

## 3. Verification

- [x] 3.1 Run build to verify no user-access or user-related compilation errors
- [x] 3.2 Run lint to verify no new lint errors