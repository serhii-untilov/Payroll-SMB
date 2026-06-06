## Why

The user-role resource has multiple build-breaking errors (missing DTO imports, invalid destructuring syntax, wrong argument counts) and deviates significantly from the established full-feature resource pattern. The service uses a non-existent `FindUserRoleDto`, the controller lacks proper authorization, version parameters, and several endpoints, and the resource returns raw entities instead of DTOs.

## What Changes

- Create `FindUserRoleDto` or replace its usage with existing `ListUserRolesQueryDto`
- Fix invalid destructuring syntax in service methods (`{ userId: string }` → separate `userId` param)
- Fix service method signatures to match full-feature pattern: `userId` as first param, `version` for update/remove/restore
- Fix `Resource.Company` → `Resource.UserRole` and rename property to `resource`
- Add missing `@Body()` decorator on controller `create` method
- Add `userId` parameter to `findOne` service method with `canOrFail` authorization check
- Add missing `update` endpoint (`@Patch(':id/:version')`) in controller
- Add version parameter to `remove` and `restore` controller endpoints
- Remove `ParseIntPipe` from `id` params (snowflake IDs are strings)
- Change `@Post('find/:id')` → `@Get(':id')` for `findOne`
- Add `@ApiBearerAuth()` class decorator
- Fix Swagger response descriptions and types
- Fix copy-paste remnant variable names (`userCompany` → `userRole`)
- **BREAKING**: API routes change — `@Post('find/:id')` → `@Get(':id')`, new `@Patch(':id/:version')` update endpoint, version added to remove/restore routes

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `user-access`: User-role controller and service must follow the full-feature resource pattern — authorization checks, version parameters, and correct method signatures

## Impact

- **API routes**: `POST /user-roles/find/:id` → `GET /user-roles/:id`, new `PATCH /user-roles/:id/:version`, `DELETE /user-roles/:id/:version`, `POST /user-roles/:id/restore/:version` — **BREAKING**
- **Code**: `apps/api/src/resources/user-role/` — service, controller, DTOs, and index
- **Dependencies**: Must create or replace `FindUserRoleDto`; existing `ListUserRolesQueryDto` and `ListUserRolesDto` remain available