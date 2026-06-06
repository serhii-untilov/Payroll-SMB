## MODIFIED Requirements

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

Controllers for positions, position-history, payrolls, payments, and tasks SHALL accept `version` as a URL path parameter in update endpoints, matching the company controller pattern.

#### Scenario: Update route includes version path parameter

- **WHEN** a controller defines an update endpoint
- **THEN** the route SHALL be `@Patch(':id/:version')`
- **AND** the handler SHALL extract `version` via `@Param('version', ParseIntPipe) version: number`
- **AND** `version` SHALL be passed as a separate argument to the service method

### Requirement: Update DTOs SHALL NOT include the version field

Update DTOs for positions, position-history, payrolls, payments, and tasks SHALL NOT include `version` as a settable field, since `version` is now a URL parameter.

#### Scenario: DTO omits version field

- **WHEN** an Update DTO type is defined for a full-feature resource
- **THEN** `version` SHALL be explicitly omitted from the DTO if it would otherwise be inherited from the entity
- **AND** `version` SHALL NOT appear in the request body schema

## REMOVED Requirements

### Requirement: checkVersionOrFail utility function

**Reason**: Replaced by `repository.update({ id, version }, ...)` which provides built-in optimistic concurrency via TypeORM's WHERE clause
**Migration**: Use `repository.update({ id, version }, data)` with version as a separate method parameter instead of calling `checkVersionOrFail(record, payload)`