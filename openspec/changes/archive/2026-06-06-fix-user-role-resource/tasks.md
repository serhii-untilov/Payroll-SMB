## 1. Service Fixes

- [x] 1.1 Fix `Resource.Company` → `Resource.UserRole` and rename `userRoleResource` → `resource`
- [x] 1.2 Fix `findAll` signature: change from `findAll({ userId: string, relations, withDeleted }: FindUserRoleDto)` to `findAll(userId: string, query: ListUserRolesQueryDto): Promise<ListUserRolesDto>`
- [x] 1.3 Fix `findOne` signature: change from `findOne(id: string, { relations, withDeleted }: FindUserRoleDto)` to `findOne(userId: string, id: string)` with `canOrFail` authorization check
- [x] 1.4 Fix `findAllByRoleType` signature: separate `userId` param and remove `FindUserRoleDto` dependency
- [x] 1.5 Fix copy-paste variable name `userCompany` → `userRole` in `findOne`
- [x] 1.6 Remove `FindUserRoleDto` import and all references; add `ListUserRolesQueryDto` import

## 2. Controller Fixes

- [x] 2.1 Add `@ApiBearerAuth()` class decorator
- [x] 2.2 Fix `create`: add `@Body()` decorator on `dto` parameter
- [x] 2.3 Fix `findAll`: change `@Post('list')` → `@Get()`, use `ListUserRolesQueryDto` instead of `FindUserRoleDto`, pass `userId` as first arg
- [x] 2.4 Fix `findOne`: change `@Post('find/:id')` → `@Get(':id')`, remove `@Body() params`, remove `ParseIntPipe` from `id`, pass `userId` to service
- [x] 2.5 Add `update` endpoint: `@Patch(':id/:version')` with `@Body() payload: UpdateUserRoleDto`, calling `this.service.update(userId, id, version, payload)`
- [x] 2.6 Fix `remove`: add `:version` route segment, add `@Param('version', ParseIntPipe) version: number`, pass to service
- [x] 2.7 Fix `restore`: update route to `@Post(':id/restore/:version')`, add `@Param('version', ParseIntPipe) version: number`, pass to service
- [x] 2.8 Fix Swagger `@ApiCreatedResponse` on `create`: correct description and response type
- [x] 2.9 Remove `FindUserRoleDto` import; add `ListUserRolesQueryDto`, `UpdateUserRoleDto` imports

## 3. Verification

- [x] 3.1 Run `npm run build` to verify compilation (no user-role related errors)
- [x] 3.2 Run `npm run lint` to verify linting passes for user-role files
- [x] 3.3 Run API tests for the user-role resource