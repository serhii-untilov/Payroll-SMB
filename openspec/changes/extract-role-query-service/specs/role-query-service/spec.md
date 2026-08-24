## ADDED Requirements

### Requirement: RoleQueryService SHALL provide read-only role lookup methods without access-control enforcement

A new `RoleQueryService` SHALL be created as a simple `@Injectable()` service that performs role-related repository queries. It SHALL NOT extend `BaseUserAccess` and SHALL NOT inject `IUserAccessService`. It SHALL inject the `UserRole` repository via `@InjectRepository(UserRole)`.

#### Scenario: RoleQueryService provides hasGlobalRole

- **WHEN** `hasGlobalRole(userId, roleType)` is called
- **THEN** it SHALL return whether a user has a global role of the given type, matching the current `UserRoleService.hasGlobalRole` behavior

#### Scenario: RoleQueryService provides hasCompanyRole

- **WHEN** `hasCompanyRole(userId, companyId, roleType)` is called
- **THEN** it SHALL return whether a user has a company-scoped role of the given type, matching the current `UserRoleService.hasCompanyRole` behavior

#### Scenario: RoleQueryService provides getUserCompanyRoleType

- **WHEN** `getUserCompanyRoleType(userId, companyId)` is called
- **THEN** it SHALL return the user's role type for a given company, matching the current `UserRoleService.getUserCompanyRoleType` behavior

#### Scenario: RoleQueryService provides getUserCompanyRoleTypeOrFail

- **WHEN** `getUserCompanyRoleTypeOrFail(userId, companyId)` is called
- **THEN** it SHALL return the user's role type for a given company or throw `ForbiddenException` if not found, matching the current `UserRoleService.getUserCompanyRoleTypeOrFail` behavior

#### Scenario: RoleQueryService provides findOneByCompanyName

- **WHEN** `findOneByCompanyName(userId, name)` is called
- **THEN** it SHALL return a user role matching the company name, matching the current `UserRoleService.findOneByCompanyName` behavior

#### Scenario: RoleQueryService provides count

- **WHEN** `count(userId, companyId)` is called
- **THEN** it SHALL return the count of user-company role records, matching the current `UserRoleService.count` behavior

### Requirement: RoleQueryService SHALL be registered in UserRoleModule and exported for cross-module use

- **WHEN** `UserRoleModule` is defined
- **THEN** `RoleQueryService` SHALL be listed in the `providers` array
- **AND** `RoleQueryService` SHALL be listed in the `exports` array

### Requirement: RoleQueryService SHALL NOT use forwardRef

- **WHEN** `RoleQueryService` or `UserRoleModule` is defined
- **THEN** there SHALL be no `forwardRef` usage in the service, module, or its imports