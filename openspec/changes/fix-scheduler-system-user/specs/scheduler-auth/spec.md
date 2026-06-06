## ADDED Requirements

### Requirement: Cron methods SHALL obtain and pass a system user ID

Cron methods in the scheduler service SHALL obtain a system user ID via `UserService.getSystemUserId()` and pass it as the first argument to any service method that requires a `userId` parameter for authorization.

#### Scenario: Scheduled company calculation uses system user ID

- **WHEN** the `companiesCalculate` cron method executes
- **THEN** it SHALL call `UserService.getSystemUserId()` to obtain the system user ID
- **AND** it SHALL pass the system user ID to `UserRoleService.findAllByRoleType(systemUserId, roleType)`
- **AND** it SHALL pass the system user ID to `CompanyService.calculatePayroll(systemUserId, companyId)`

#### Scenario: Scheduler service injects UserService

- **WHEN** the `ScheduleService` is instantiated
- **THEN** it SHALL have `UserService` injected as a dependency
- **AND** it SHALL be able to call `this.usersService.getSystemUserId()`