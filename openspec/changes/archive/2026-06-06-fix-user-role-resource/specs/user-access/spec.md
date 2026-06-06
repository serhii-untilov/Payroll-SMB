## MODIFIED Requirements

### Requirement: Service method signatures requiring access checks SHALL accept userId

Service methods that perform access checks SHALL accept `userId` as their first parameter (after `this`), consistent with the pattern in `company.service.ts`, `person.service.ts`, etc.

#### Scenario: findAll gains userId parameter

- **WHEN** a service `findAll` method needs to check read access
- **THEN** its signature SHALL be `findAll(userId: string, ...)` and it SHALL call `canOrFail` before executing the query

#### Scenario: findOne gains userId parameter

- **WHEN** a service `findOne` method needs to check read access
- **THEN** its signature SHALL be `findOne(userId: string, ...)` and it SHALL call `canOrFail` before returning the result

#### Scenario: findAllByRoleType gains userId parameter

- **WHEN** a service `findAllByRoleType` method needs to check read access
- **THEN** its signature SHALL be `findAllByRoleType(userId: string, ...)` and it SHALL call `canOrFail` before executing the query

## ADDED Requirements

### Requirement: User-role service SHALL follow full-feature resource pattern

The user-role service SHALL follow the same pattern as other full-feature resources (company, person, position, etc.) for method signatures, authorization, and optimistic concurrency.

#### Scenario: Service resource property uses correct enum value

- **WHEN** the user-role service class is defined
- **THEN** it SHALL declare `public readonly resource = Resource.UserRole`
- **AND** it SHALL NOT use `Resource.Company` or any other incorrect enum value

#### Scenario: Service methods accept version parameter for write operations

- **WHEN** a service `update`, `remove`, or `restore` method is defined
- **THEN** it SHALL accept `version: number` as a separate parameter (not inside the DTO)
- **AND** it SHALL use `repository.update({ id, version }, ...)` for optimistic concurrency

### Requirement: User-role controller SHALL follow full-feature REST pattern

The user-role controller SHALL follow the established REST pattern for full-feature resources, matching the company controller structure for routes, decorators, and parameter handling.

#### Scenario: Controller class has ApiBearerAuth decorator

- **WHEN** the user-role controller class is defined
- **THEN** it SHALL have the `@ApiBearerAuth()` class decorator

#### Scenario: Create endpoint uses Post with Body decorator

- **WHEN** a controller `create` method is defined
- **THEN** it SHALL use `@Post()` route
- **AND** the DTO parameter SHALL have the `@Body()` decorator
- **AND** it SHALL call `this.service.create(userId, payload)` passing userId and the body

#### Scenario: FindAll endpoint uses Get with query DTO

- **WHEN** a controller `findAll` method is defined
- **THEN** it SHALL use `@Get()` route (not `@Post('list')`)
- **AND** it SHALL pass `userId` as the first argument to the service method
- **AND** it SHALL NOT use the non-existent `FindUserRoleDto`

#### Scenario: FindOne endpoint uses Get with id param and no body

- **WHEN** a controller `findOne` method is defined
- **THEN** it SHALL use `@Get(':id')` route (not `@Post('find/:id')`)
- **AND** it SHALL extract `id` via `@Param('id') id: string` (no `ParseIntPipe`)
- **AND** it SHALL NOT accept a request body
- **AND** it SHALL pass `userId` and `id` to the service method

#### Scenario: Update endpoint uses Patch with version path param

- **WHEN** a controller `update` method is defined
- **THEN** it SHALL use `@Patch(':id/:version')` route
- **AND** it SHALL extract `version` via `@Param('version', ParseIntPipe) version: number`
- **AND** the DTO parameter SHALL have the `@Body()` decorator
- **AND** it SHALL call `this.service.update(userId, id, version, payload)`

#### Scenario: Remove endpoint uses Delete with version path param

- **WHEN** a controller `remove` method is defined
- **THEN** it SHALL use `@Delete(':id/:version')` route
- **AND** it SHALL extract `version` via `@Param('version', ParseIntPipe) version: number`
- **AND** it SHALL call `this.service.remove(userId, id, version)`

#### Scenario: Restore endpoint uses Post with version path param

- **WHEN** a controller `restore` method is defined
- **THEN** it SHALL use `@Post(':id/restore/:version')` route
- **AND** it SHALL extract `version` via `@Param('version', ParseIntPipe) version: number`
- **AND** it SHALL call `this.service.restore(userId, id, version)`