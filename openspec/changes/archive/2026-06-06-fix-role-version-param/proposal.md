## Why

The Role controller's `update` and `remove` methods are missing the `version` path parameter, even though the Role entity extends `BaseEntity` (which includes a `version` field for optimistic concurrency) and the service layer already expects `version` as an argument. This mismatch means optimistic concurrency is silently broken — updates and deletes proceed without any version check, risking lost updates. Additionally, the `restore` endpoint is entirely absent from the controller despite the service implementing it.

## What Changes

- Add `:version` route segment to Role controller `update` (`@Patch(':id/:version')`) and `remove` (`@Delete(':id/:version')`) endpoints
- Add `@Param('version', ParseIntPipe) version: number` parameter to `update` and `remove` controller methods
- Pass `version` argument from controller to service calls for `update`, `remove`
- Add missing `restore` endpoint (`@Post(':id/restore/:version')`) with `version` parameter, forwarding to `service.restore`

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `user-access`: Role resource controller now enforces optimistic concurrency via `version` parameter on update, remove, and restore operations — requirement change: all mutating endpoints on full-feature resources must accept and forward a `version` path param

## Impact

- **API routes**: `PATCH /roles/:id` → `PATCH /roles/:id/:version`, `DELETE /roles/:id` → `DELETE /roles/:id/:version`, new `POST /roles/:id/restore/:version`
- **Breaking change**: Clients calling `PATCH /roles/:id` or `DELETE /roles/:id` without version will get 404 — **BREAKING**
- **Code**: `apps/api/src/resources/role/role.controller.ts` and corresponding test file