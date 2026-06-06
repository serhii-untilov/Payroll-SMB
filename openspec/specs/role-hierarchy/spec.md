## Purpose

Defines role hierarchy enforcement rules for role assignment operations. Establishes which roles can manage which other roles based on a static privilege ordering.

## Requirements

### Requirement: Role hierarchy enforcement method SHALL exist on UserAccessService

`UserAccessService` SHALL provide a `canManageRole(current: RoleType, target: RoleType): boolean` method that enforces role hierarchy rules for role assignment operations. The method SHALL be synchronous and not require database access.

#### Scenario: Higher role can manage lower role

- **WHEN** `canManageRole` is called with `current = RoleType.SystemAdmin` and `target = RoleType.Employee`
- **THEN** it SHALL return `true`

#### Scenario: Same-level role can be managed

- **WHEN** `canManageRole` is called with `current = RoleType.CompanyAdmin` and `target = RoleType.CompanyAdmin`
- **THEN** it SHALL return `true`

#### Scenario: Lower role cannot manage higher role

- **WHEN** `canManageRole` is called with `current = RoleType.Employee` and `target = RoleType.CompanyAdmin`
- **THEN** it SHALL return `false`

#### Scenario: System role can never be assigned as target

- **WHEN** `canManageRole` is called with any `current` role and `target = RoleType.System`
- **THEN** it SHALL return `false`

#### Scenario: Hierarchy order is enforced

- **WHEN** the role hierarchy is evaluated
- **THEN** the order from highest to lowest privilege SHALL be: System, SystemAdmin, CompanyAdmin, Accountant, Manager, Employee
- **AND** a role with a lower index in the hierarchy can manage any role with an equal or higher index

### Requirement: UserService create and update SHALL enforce role hierarchy

`UserService.create()` and `UserService.update()` SHALL call `canManageRole` to verify that the current user's role type can manage the target user's role type before proceeding with the operation.

#### Scenario: User creation with insufficient role

- **WHEN** a user with `Employee` role attempts to create a user with `CompanyAdmin` role
- **THEN** the service SHALL call `canManageRole(Employee, CompanyAdmin)`
- **AND** the service SHALL throw `ForbiddenException` when `canManageRole` returns `false`

#### Scenario: User creation with sufficient role

- **WHEN** a user with `CompanyAdmin` role attempts to create a user with `Accountant` role
- **THEN** the service SHALL call `canManageRole(CompanyAdmin, Accountant)`
- **AND** the service SHALL proceed with creation when `canManageRole` returns `true`

#### Scenario: User update with role escalation attempt

- **WHEN** a user with `Accountant` role attempts to update another user's role to `SystemAdmin`
- **THEN** the service SHALL call `canManageRole(Accountant, SystemAdmin)`
- **AND** the service SHALL throw `ForbiddenException` when `canManageRole` returns `false`