## MODIFIED Requirements

### Requirement: UserAccessService SHALL inject RoleQueryService instead of UserRoleService

`UserAccessService` SHALL inject `RoleQueryService` (not `UserRoleService`) to perform role queries. The `isAllowed` method SHALL call `roleQueryService.hasGlobalRole` and `roleQueryService.hasCompanyRole` instead of the previous `userRoleService.hasGlobalRole` and `userRoleService.hasCompanyRole`.

#### Scenario: isAllowed uses RoleQueryService for global role check

- **WHEN** `isAllowed(dto)` is called
- **THEN** it SHALL call `this.roleQueryService.hasGlobalRole(dto.userId, RoleType.SystemAdmin)` instead of `this.userRoleService.hasGlobalRole(...)`

#### Scenario: isAllowed uses RoleQueryService for company role check

- **WHEN** `isAllowed(dto)` is called with `dto.context?.companyId`
- **THEN** it SHALL call `this.roleQueryService.hasCompanyRole(dto.userId, dto.context.companyId, RoleType.CompanyAdmin)` instead of `this.userRoleService.hasCompanyRole(...)`

### Requirement: UserAccessModule SHALL NOT use forwardRef for UserRoleModule

`UserAccessModule` SHALL import `UserRoleModule` directly (without `forwardRef`). The `forwardRef(() => UserAccessModule)` self-reference and `forwardRef(() => UserRoleModule)` SHALL both be removed.

#### Scenario: UserAccessModule imports UserRoleModule without forwardRef

- **WHEN** `UserAccessModule` is defined
- **THEN** its `imports` array SHALL contain `UserRoleModule` (not `forwardRef(() => UserRoleModule)`)
- **AND** there SHALL be no `forwardRef(() => UserAccessModule)` self-reference

### Requirement: UserRoleModule SHALL NOT use forwardRef for UserAccessModule

`UserRoleModule` SHALL import `UserAccessModule` directly (without `forwardRef`). The `forwardRef(() => UserAccessModule)` SHALL be removed.

#### Scenario: UserRoleModule imports UserAccessModule without forwardRef

- **WHEN** `UserRoleModule` is defined
- **THEN** its `imports` array SHALL contain `UserAccessModule` (not `forwardRef(() => UserAccessModule)`)

### Requirement: user-role barrel index.ts SHALL be removed

The file `apps/api/src/resources/user-role/index.ts` SHALL be deleted. All imports that previously resolved through this barrel SHALL use direct file paths.

#### Scenario: Import UserRoleService from direct path

- **WHEN** a file imports `UserRoleService` from `../user-role`
- **THEN** the import SHALL change to `../user-role/user-role.service`

#### Scenario: Import UserRoleModule from direct path

- **WHEN** a file imports `UserRoleModule` from `../user-role`
- **THEN** the import SHALL change to `../user-role/user-role.module`

#### Scenario: Import RoleQueryService from direct path

- **WHEN** a file imports `RoleQueryService` from `../user-role`
- **THEN** the import SHALL change to `../user-role/role-query.service`

### Requirement: UserRoleService SHALL NOT contain extracted query methods

The methods `hasGlobalRole`, `hasCompanyRole`, `getUserCompanyRoleType`, `getUserCompanyRoleTypeOrFail`, `findOneByCompanyName`, and `count` SHALL be removed from `UserRoleService`. These methods SHALL exist only in `RoleQueryService`.

#### Scenario: UserRoleService no longer has hasGlobalRole

- **WHEN** `UserRoleService` is defined
- **THEN** it SHALL NOT have a `hasGlobalRole` method

#### Scenario: UserRoleService no longer has hasCompanyRole

- **WHEN** `UserRoleService` is defined
- **THEN** it SHALL NOT have a `hasCompanyRole` method

#### Scenario: UserRoleService no longer has getUserCompanyRoleType

- **WHEN** `UserRoleService` is defined
- **THEN** it SHALL NOT have a `getUserCompanyRoleType` method

#### Scenario: UserRoleService no longer has getUserCompanyRoleTypeOrFail

- **WHEN** `UserRoleService` is defined
- **THEN** it SHALL NOT have a `getUserCompanyRoleTypeOrFail` method

#### Scenario: UserRoleService no longer has findOneByCompanyName

- **WHEN** `UserRoleService` is defined
- **THEN** it SHALL NOT have a `findOneByCompanyName` method

#### Scenario: UserRoleService no longer has count

- **WHEN** `UserRoleService` is defined
- **THEN** it SHALL NOT have a `count` method