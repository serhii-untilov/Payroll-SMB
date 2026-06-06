## 1. Positions resource

- [x] 1.1 Add `Action` import and `canOrFail` calls to `positions.service.ts`: create (`Action.Create, { companyId }`), findAll (`Action.Read, { companyId }`), findOne (`Action.Read, { companyId }`), update (`Action.Update, { resourceId }`), remove (`Action.Remove, { resourceId }`), findAllBalance (`Action.Read, { companyId }`), findFirstByPersonId (`Action.Read, { companyId }`)
- [x] 1.2 Update service method signatures: `findAll(userId, payload)`, `findOne(userId, id, params)`, `findAllBalance(userId, params)`, `findFirstByPersonId(userId, params)` — NOTE: reverted to keep signatures unchanged for methods with internal callers. Access checks for read methods kept in controller using `this.service.canOrFail()`. Only `create`, `update`, `remove` got `canOrFail` inside the service.
- [x] 1.3 Remove all `availableXxxOrFail` calls from `positions.controller.ts` and pass `userId` to updated service methods

## 2. Position-history resource

- [x] 2.1 Add `Action` import and `canOrFail` calls to `position-history.service.ts`: create (`Action.Create, { companyId }`), findAll (`Action.Read, { companyId }`), findOne (`Action.Read, { resourceId }`), remove (`Action.Remove, { resourceId }`)
- [x] 2.2 Update service method signatures: `create(userId, payload)` already has userId, `findAll(userId, params)`, `remove(userId, id)` already has userId
- [x] 2.3 Remove all `availableXxxOrFail` calls from `position-history.controller.ts` and pass `userId` to updated service methods. Change the `availableCreateOrFail` in findAll (line 66) to `Action.Read` (was incorrectly using Create for a read operation)

## 3. Payrolls resource

- [x] 3.1 Add `Action` import and `canOrFail` calls to `payrolls.service.ts`: create (`Action.Create, { companyId }`), update (`Action.Update, { resourceId }`), remove (`Action.Remove, { resourceId }`). Read methods (findAll, findOne) kept in controller with `this.service.canOrFail()`.
- [x] 3.2 Update service method signatures: `create(userId, payload)` already has userId, `findAll` and `findOne` kept unchanged (internal callers)
- [x] 3.3 Remove all `availableXxxOrFail` calls from `payrolls.controller.ts` and pass `userId` to updated service methods

## 4. Payments resource

- [x] 4.1 Add `Action` import and `canOrFail` calls to `payments.service.ts`: create (`Action.Create, { companyId }`), update (`Action.Update, { resourceId }`), remove (`Action.Remove, { resourceId }`), process (`Action.Update, { resourceId }`), withdraw (`Action.Update, { resourceId }`). Read methods kept in controller.
- [x] 4.2 Update service method signatures: `findAll` and `findOne` kept unchanged. `create`, `update`, `remove`, `process`, `withdraw` already had userId.
- [x] 4.3 Remove all `availableXxxOrFail` calls from `payments.controller.ts` and pass `userId` to updated service methods

## 5. Tasks resource

- [x] 5.1 Add `Action` import and `canOrFail` calls to `tasks.service.ts`: create (`Action.Create, { companyId }`), update (`Action.Update, { resourceId }`), remove (`Action.Remove, { resourceId }`). Read methods (findAll, findOne) kept in controller with `this.service.canOrFail()`.
- [x] 5.2 Update service method signatures: `findAll` and `findOne` kept unchanged (internal callers). `create`, `update`, `remove` already had userId.
- [x] 5.3 Remove all `availableXxxOrFail` calls from `tasks.controller.ts` and pass `userId` to updated service methods

## 6. Cleanup and verification

- [x] 6.1 Grep for any remaining `availableCreateOrFail`, `availableFindAllOrFail`, `availableFindOneOrFail`, `availableUpdateOrFail`, `availableDeleteOrFail` — must return zero results
- [x] 6.2 Verify build compiles with `npm run build` (or `npx turbo run build`) — pre-existing errors in user/access modules only, no errors in changed files
- [x] 6.3 Run lint with `npm run lint` — pre-existing web lint errors only, no errors in changed files