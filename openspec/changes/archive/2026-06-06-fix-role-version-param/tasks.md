## 1. Controller Fixes

- [x] 1.1 Update `update` method route from `@Patch(':id')` to `@Patch(':id/:version')` and add `@Param('version', ParseIntPipe) version: number` parameter, passing `version` to `this.service.update(userId, id, version, payload)`
- [x] 1.2 Update `remove` method route from `@Delete(':id')` to `@Delete(':id/:version')` and add `@Param('version', ParseIntPipe) version: number` parameter, passing `version` to `this.service.remove(userId, id, version)`
- [x] 1.3 Add `restore` endpoint: `@Post(':id/restore/:version')` with `@UseGuards(AccessTokenGuard)`, extracting `id` and `version` params, calling `this.service.restore(userId, id, version)`

## 2. Verification

- [x] 2.1 Run `npm run build` to verify compilation
- [x] 2.2 Run `npm run lint` to verify linting passes
- [x] 2.3 Run API tests for the role resource