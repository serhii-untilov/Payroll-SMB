## Context

The project uses `checkVersionOrFail(record, payload)` — a manual utility that fetches a record, compares `record.version` with `payload.version`, and throws `BadRequestException` on mismatch. This pattern is used in 5 services: positions, position-history, payrolls, payments, tasks.

The `company.service.ts` already demonstrates the target pattern: `repository.update({ id, version }, data)` uses TypeORM's WHERE clause for optimistic concurrency in a single atomic operation, eliminating the extra DB read and the separate utility.

Current pattern (all 5 services):
```ts
const record = await this.repository.findOneOrFail({ where: { id } });
checkVersionOrFail(record, payload);
await this.repository.save({ ...payload, id, updatedUserId: userId, updatedDate: new Date() });
```

Target pattern (company.service.ts):
```ts
await this.repository.update(
    { id, version },
    { ...dto, updatedUserId: userId, updatedDate: new Date() },
);
await this.repository.findOneOrFail({ where: { id } });
```

## Goals / Non-Goals

**Goals:**
- Replace all `checkVersionOrFail` usages with `repository.update({ id, version }, ...)` in the 5 affected services
- Change method signatures to accept `version` as a separate parameter (matching company pattern)
- Update controllers to extract `version` from URL params (matching company controller pattern)
- Remove `check-version.ts` and its re-export

**Non-Goals:**
- Refactoring `remove` methods that don't currently use `checkVersionOrFail` (separate concern)
- Changing other resources that don't use `checkVersionOrFail`
- Modifying DTOs for fields other than `version`

## Decisions

### 1. `version` as URL parameter (not request body)

**Decision:** Move `version` from the request body to a URL path parameter (`:id/:version`), matching `company.controller.ts`.

**Rationale:** The company resource already uses this pattern. URL params are explicit and make the API contract clear. `repository.update({ id, version }, ...)` needs `version` as a separate value, not mixed into the DTO.

**Alternative considered:** Keep `version` in the body and destructure in the controller. Rejected because it diverges from the established company pattern.

### 2. Use `repository.update()` instead of `repository.save()`

**Decision:** Replace `repository.save({ ...payload, id, ... })` with `repository.update({ id, version }, { ...dto, ... })`.

**Rationale:** `update` with a WHERE clause `{ id, version }` is atomic — if the version doesn't match, zero rows are affected, providing optimistic concurrency. `save` doesn't use the version in its WHERE clause.

### 3. Exclude `version` from update DTOs

**Decision:** For Payroll and Task DTOs that inherit `version` from the entity, explicitly omit `version` from the DTO since it's now a URL parameter. For Position, PositionHistory, Payment DTOs that already don't include `version`, no change needed.

**Rationale:** `version` should not be in the request body when it's a URL parameter. The Company DTO already follows this pattern.

### 4. Post-update `findOneOrFail` for return value

**Decision:** After `repository.update()`, fetch the updated record with `findOneOrFail({ where: { id } })` to return to the caller.

**Rationale:** `repository.update()` returns an `UpdateResult` (affected row count), not the entity. Services need to return the updated entity. The company service also follows this pattern.

### 5. position-history.service.ts update has side effects

**Decision:** The `normalizeAfterCreateOrUpdate()` and event emission in position-history update must be preserved. The pre-update `findOneOrFail` for version checking is removed, but the post-update fetch still provides the updated record for normalization.

**Rationale:** The `record` was only used for `checkVersionOrFail`. All other logic uses the `updated` record fetched after save.

## Risks / Trade-offs

- **[Zero-row update not throwing]** → If version doesn't match, `repository.update` affects 0 rows but doesn't throw. The subsequent `findOneOrFail` returns the unchanged record. The company service already has this behavior. If explicit error messages are needed later, check `UpdateResult.affected === 0` and throw. Consider this a follow-up, not in scope.
- **[API contract change]** → `@Patch(':id/:version')` is a breaking change for existing API clients. → Ensure clients are updated to pass version in URL.