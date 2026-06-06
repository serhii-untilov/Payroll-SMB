## Why

The `checkVersionOrFail` utility performs a manual two-step optimistic concurrency check (fetch record, compare versions, throw if mismatch). This is redundant because TypeORM's `repository.update({ id, version }, ...)` already enforces version matching via the WHERE clause in a single atomic operation. The `company.service.ts` already demonstrates the correct pattern — eliminating the extra DB query and the separate utility function.

## What Changes

- Replace `checkVersionOrFail(record, payload)` + `repository.save(...)` with `repository.update({ id, version }, { ...dto, updatedUserId, updatedDate })` in 5 services: positions, position-history, payrolls, payments, tasks
- **BREAKING**: Service `update` method signatures change — `version: number` becomes a separate parameter instead of being inside the DTO payload
- Remove `check-version.ts` utility and its re-export from `utils/index.ts`

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `user-access`: Update access check pattern for write operations — version parameter moves from DTO body to method signature, `repository.update` replaces manual check + `repository.save`

## Impact

- 5 service files: `positions.service.ts`, `position-history.service.ts`, `payrolls.service.ts`, `payments.service.ts`, `tasks.service.ts`
- 5 controller files that call these service `update` methods (must pass `version` separately)
- 1 utility file removed: `apps/api/src/utils/lib/check-version.ts`
- 1 export removed: `apps/api/src/utils/index.ts`
- DTOs: `version` field may need adjustment in update DTOs (removed from DTO if now a separate param)