## MODIFIED Requirements

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