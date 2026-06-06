## Context

`ScheduleService.companiesCalculate()` is the only cron job in the project. It runs at 02:00 AM daily to recalculate payroll for all companies with accountant-level users. Currently it calls `findAllByRoleType({ roleType })` — a broken call using a single object argument when the method signature requires two positional arguments `(userId: string, roleType: RoleType)`. This is a TypeScript compilation error.

More importantly, cron methods have no authenticated user context. Services that enforce authorization via `canOrFail(userId, ...)` require a valid user ID. The project provides `UserService.getSystemUserId()` for exactly this purpose — obtaining a system user ID for automated operations.

The `ProcessorModule` already imports `UserModule`, so the DI wiring is in place. Only the service-level injection and call-site fix are needed.

## Goals / Non-Goals

**Goals:**

- Fix the compilation error in `ScheduleService.companiesCalculate()`
- Ensure cron methods obtain a system user ID via `UserService.getSystemUserId()` and pass it through to service methods that require authorization
- Maintain consistency with the established pattern (system user for automated/batch operations)

**Non-Goals:**

- Adding new cron jobs (out of scope)
- Changing `findAllByRoleType` or other service methods (already fixed in previous changes)
- Changing any API endpoints (scheduler has no controller)

## Decisions

### Decision 1: Use `UserService.getSystemUserId()` for system user ID

**Choice**: Inject `UserService` and call `getSystemUserId()`.

**Rationale**: This is the established project pattern — `PayPeriodCalculationService` already uses `this.usersService.getSystemUserId()` for automated batch operations. The standalone `getSystemUserId(dataSource)` function is for migrations only (no DI available).

### Decision 2: Pass `systemUserId` to `calculatePayroll` instead of accountant's `userId`

**Choice**: Use `systemUserId` for the `calculatePayroll` call.

**Rationale**: This is a cron-initiated batch operation, not an accountant-triggered action. The system user is the correct identity for authorization gates and audit trails in automated operations. Mixing per-accountant user IDs with cron context could cause authorization failures if the accountant is deactivated.

## Risks / Trade-offs

- **[Audit trail change]** Previously each company's calculation was attributed to the accountant user. Now it will be attributed to the system user. → **Mitigation**: This aligns with how `PayPeriodCalculation` already attributes automated updates — to the system user.