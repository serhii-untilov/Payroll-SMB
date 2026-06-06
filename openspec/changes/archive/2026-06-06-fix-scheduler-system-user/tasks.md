## 1. Service Fixes

- [x] 1.1 Inject `UserService` into `ScheduleService` constructor (add `@Inject(forwardRef(() => UserService)) private usersService: UserService`)
- [x] 1.2 Add `UserService` import to `schedule.service.ts`
- [x] 1.3 In `companiesCalculate()`, call `this.usersService.getSystemUserId()` to obtain the system user ID
- [x] 1.4 Fix `findAllByRoleType` call: change from `({ roleType })` to `(systemUserId, RoleType.Accountant)` positional arguments
- [x] 1.5 Pass `systemUserId` to `calculatePayroll` instead of the accountant's `userId` from the `UserRole` record

## 2. Verification

- [x] 2.1 Run build to verify no scheduler-related compilation errors
- [x] 2.2 Run lint to verify no scheduler-related lint errors