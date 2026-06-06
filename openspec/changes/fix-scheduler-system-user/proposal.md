## Why

The `ScheduleService.companiesCalculate()` cron method calls `findAllByRoleType()` with wrong arguments (a single object instead of two positional params), causing a TypeScript compilation error. More fundamentally, cron methods run without an authenticated user context, so they need a system user ID to pass through authorization checks (`canOrFail`) that guard service methods.

## What Changes

- Inject `UserService` into `ScheduleService` and use `getSystemUserId()` to obtain the system user ID
- Fix `findAllByRoleType` call: pass `systemUserId` as first argument and `RoleType.Accountant` as second positional argument (replacing the broken single-object call)
- Pass `systemUserId` to `calculatePayroll` instead of the accountant's `userId` from the `UserRole` record — cron-initiated operations should consistently use the system user for authorization and audit

## Capabilities

### New Capabilities

- `scheduler-auth`: Cron methods in the scheduler service SHALL obtain and pass a system user ID for authorization and audit purposes

### Modified Capabilities

_(none)_

## Impact

- **Code**: `apps/api/src/processor/schedule/schedule.service.ts` — constructor injection and `companiesCalculate` method
- **Module**: `apps/api/src/processor/processor.module.ts` — `UserModule` is already imported, no module changes needed
- **No API routes affected** — scheduler has no controller/endpoints