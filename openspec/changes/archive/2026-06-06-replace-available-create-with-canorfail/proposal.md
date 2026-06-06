## Why

The old access service with `availableCreateOrFail`, `availableFindAllOrFail`, `availableFindOneOrFail`, `availableUpdateOrFail`, and `availableDeleteOrFail` methods has been replaced by the new `canOrFail` method on `BaseUserAccess`. However, 5 controllers (positions, position-history, payrolls, payments, tasks) still call the old methods, which no longer have definitions. These dead calls need to be replaced and access checks moved into service methods to match the established pattern (see company, person, department services).

## What Changes

- **Remove** all `availableXxxOrFail()` calls from 5 controllers: positions, position-history, payrolls, payments, tasks
- **Add** `canOrFail()` calls inside corresponding service methods, following the pattern already used in `company.service.ts`, `person.service.ts`, etc.
- **Update** service method signatures to accept `userId` where needed (e.g., `findAll`, `findOne`, `findAllBalance`, `findFirstByPersonId`)
- **Update** controller method signatures to pass `userId` to service methods that previously didn't need it

### Mapping

| Old Method                          | New Method                                                    |
|-------------------------------------|---------------------------------------------------------------|
| `availableCreateOrFail(userId, companyId)` | `canOrFail(userId, Action.Create, { companyId })`               |
| `availableFindAllOrFail(userId, companyId)` | `canOrFail(userId, Action.Read, { companyId })`                 |
| `availableFindOneOrFail(userId, id)` | `canOrFail(userId, Action.Read, { resourceId: id })`           |
| `availableUpdateOrFail(userId, id)` | `canOrFail(userId, Action.Update, { resourceId: id })`         |
| `availableDeleteOrFail(userId, id)` | `canOrFail(userId, Action.Remove, { resourceId: id })`          |

### Affected Resources

1. **positions** — 6 access checks across create, findAll, findOne, update, remove, findBalance, findFirstByPersonId
2. **position-history** — 4 access checks across create, findAll, findLast, remove
3. **payrolls** — 6 access checks across create, findAll (2 paths), findOne, update, remove
4. **payments** — 5 access checks across create, update, remove, process, withdraw
5. **tasks** — 5 access checks across create, findAll, findOne, update, remove

## Capabilities

### New Capabilities

_(none — this is a refactor of existing access control)_

### Modified Capabilities

- `user-access`: Access checks are moved from controller layer into service layer for consistency with the new `canOrFail` pattern

## Impact

- **Controllers**: positions, position-history, payrolls, payments, tasks — remove access check calls, add `userId` passthrough to some service methods
- **Services**: positions, position-history, payrolls, payments, tasks — add `canOrFail` calls, some method signatures gain `userId` parameter
- **No API contract changes** — endpoints and DTOs remain the same
- **No database changes** — no migrations needed