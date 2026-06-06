## Purpose

Defines access control patterns for service methods and controllers in resources that extend `BaseUserAccess`.

## Requirements

### Requirement: Access checks SHALL be enforced inside service methods

All access control checks (`canOrFail`) for resources that extend `BaseUserAccess` SHALL be called inside service methods, not in controllers. Controllers SHALL pass `userId` to service methods that require access checks.

#### Scenario: Create operation access check in service

- **WHEN** a service method handles a create operation
- **THEN** it SHALL call `canOrFail(userId, Action.Create, { companyId })` at the beginning of the method before any business logic

#### Scenario: Read operation access check with company scope in service

- **WHEN** a service method handles a list/find operation scoped to a company
- **THEN** it SHALL call `canOrFail(userId, Action.Read, { companyId })` at the beginning of the method

#### Scenario: Read operation access check with resource scope in service

- **WHEN** a service method handles a read-by-id operation
- **THEN** it SHALL call `canOrFail(userId, Action.Read, { resourceId: id })` at the beginning of the method

#### Scenario: Update operation access check in service

- **WHEN** a service method handles an update operation
- **THEN** it SHALL call `canOrFail(userId, Action.Update, { resourceId: id })` at the beginning of the method

#### Scenario: Remove operation access check in service

- **WHEN** a service method handles a delete/remove operation
- **THEN** it SHALL call `canOrFail(userId, Action.Remove, { resourceId: id })` at the beginning of the method

### Requirement: Controllers SHALL NOT call access control methods directly

Controllers for positions, position-history, payrolls, payments, and tasks SHALL NOT call `availableCreateOrFail`, `availableFindAllOrFail`, `availableFindOneOrFail`, `availableUpdateOrFail`, or `availableDeleteOrFail`. All access control SHALL be delegated to the corresponding service method.

#### Scenario: Controller delegates to service with userId

- **WHEN** a controller method receives a request that requires access control
- **THEN** it SHALL pass `userId` to the service method and the service method SHALL enforce access control internally

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

### Requirement: Service update methods SHALL use repository.update with version for optimistic concurrency

Service `update` methods for full-feature resources (positions, position-history, payrolls, payments, tasks) SHALL use `repository.update({ id, version }, data)` instead of `checkVersionOrFail` + `repository.save`. The `version` parameter SHALL be accepted as a separate method argument, not inside the DTO.

#### Scenario: Update method uses repository.update with version in WHERE clause

- **WHEN** a service `update` method is called with `userId`, `id`, `version`, and `dto`
- **THEN** it SHALL call `repository.update({ id, version }, { ...dto, updatedUserId: userId, updatedDate: new Date() })`
- **AND** it SHALL NOT call `checkVersionOrFail`
- **AND** it SHALL NOT call `repository.save` for the update operation

#### Scenario: Update method returns the updated entity

- **WHEN** a service `update` method completes the repository.update call
- **THEN** it SHALL call `repository.findOneOrFail({ where: { id } })` to return the updated entity

#### Scenario: Version is a separate parameter in service method signatures

- **WHEN** a service `update` method is defined
- **THEN** its signature SHALL be `update(userId: string, id: string, version: number, dto: UpdateXxxDto)`
- **AND** `version` SHALL NOT be part of the DTO type

### Requirement: Controller update endpoints SHALL accept version as URL parameter

Controllers for positions, position-history, payrolls, payments, tasks, and roles SHALL accept `version` as a URL path parameter in update endpoints, matching the company controller pattern.

#### Scenario: Update route includes version path parameter

- **WHEN** a controller defines an update endpoint
- **THEN** the route SHALL be `@Patch(':id/:version')`
- **AND** the handler SHALL extract `version` via `@Param('version', ParseIntPipe) version: number`
- **AND** `version` SHALL be passed as a separate argument to the service method

#### Scenario: Remove route includes version path parameter

- **WHEN** a controller defines a remove endpoint for a full-feature resource
- **THEN** the route SHALL be `@Delete(':id/:version')`
- **AND** the handler SHALL extract `version` via `@Param('version', ParseIntPipe) version: number`
- **AND** `version` SHALL be passed as a separate argument to the service remove method

#### Scenario: Restore route includes version path parameter

- **WHEN** a controller defines a restore endpoint for a soft-deletable resource
- **THEN** the route SHALL be `@Post(':id/restore/:version')`
- **AND** the handler SHALL extract `version` via `@Param('version', ParseIntPipe) version: number`
- **AND** `version` SHALL be passed as a separate argument to the service restore method

### Requirement: Update DTOs SHALL NOT include the version field

Update DTOs for positions, position-history, payrolls, payments, and tasks SHALL NOT include `version` as a settable field, since `version` is now a URL parameter.

#### Scenario: DTO omits version field

- **WHEN** an Update DTO type is defined for a full-feature resource
- **THEN** `version` SHALL be explicitly omitted from the DTO if it would otherwise be inherited from the entity
- **AND** `version` SHALL NOT appear in the request body schema

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