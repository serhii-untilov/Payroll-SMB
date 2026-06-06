## 1. Positions resource

- [x] 1.1 Update `positions.service.ts`: change `update` signature to `update(userId, id, version, payload)`, replace `findOneOrFail` + `checkVersionOrFail` + `save` with `repository.update({ id, version }, { ...payload, updatedUserId, updatedDate })` + `findOneOrFail`, remove `checkVersionOrFail` import
- [x] 1.2 Update `positions.controller.ts`: change route to `@Patch(':id/:version')`, add `@Param('version', ParseIntPipe) version: number`, pass `version` as separate arg to service
- [x] 1.3 Update `UpdatePositionDto`: verify `version` is excluded (no change needed if already excluded via `OmitType`)

## 2. Position-history resource

- [x] 2.1 Update `position-history.service.ts`: change `update` signature to `update(userId, id, version, payload)`, replace `findOneOrFail` + `checkVersionOrFail` + `save` with `repository.update({ id, version }, { ...payload, updatedUserId, updatedDate })` + `findOneOrFail`, remove `checkVersionOrFail` import
- [x] 2.2 Update `position-history.controller.ts`: change route to `@Patch(':id/:version')`, add `@Param('version', ParseIntPipe) version: number`, pass `version` as separate arg to service
- [x] 2.3 Update `UpdatePositionHistoryDto`: verify `version` is excluded (no change needed if already excluded)

## 3. Payrolls resource

- [x] 3.1 Update `payrolls.service.ts`: change `update` signature to `update(userId, id, version, payload)`, replace `findOneOrFail` + `checkVersionOrFail` + `save` with `repository.update({ id, version }, { ...payload, updatedUserId, updatedDate })` + `findOneOrFail`, remove `checkVersionOrFail` import
- [x] 3.2 Update `payrolls.controller.ts`: change route to `@Patch(':id/:version')`, add `@Param('version', ParseIntPipe) version: number`, pass `version` as separate arg to service
- [x] 3.3 Update `UpdatePayrollDto`: add `version` to `OmitType` list since it's inherited from `Payroll` entity

## 4. Payments resource

- [x] 4.1 Update `payments.service.ts`: change `update` signature to `update(userId, id, version, payload)`, replace `findOneOrFail` + `checkVersionOrFail` + `save` with `repository.update({ id, version }, { ...payload, updatedUserId, updatedDate })` + `findOneOrFail`, remove `checkVersionOrFail` import
- [x] 4.2 Update `payments.controller.ts`: change route to `@Patch(':id/:version')`, add `@Param('version', ParseIntPipe) version: number`, pass `version` as separate arg to service
- [x] 4.3 Update `UpdatePaymentDto`: verify `version` is excluded (no change needed if already excluded)

## 5. Tasks resource

- [x] 5.1 Update `tasks.service.ts`: change `update` signature to `update(userId, id, version, payload)`, replace `findOneOrFail` + `checkVersionOrFail` + `save` with `repository.update({ id, version }, { ...payload, updatedUserId, updatedDate })` + `findOneOrFail`, remove `checkVersionOrFail` import
- [x] 5.2 Update `tasks.controller.ts`: change route to `@Patch(':id/:version')`, add `@Param('version', ParseIntPipe) version: number`, pass `version` as separate arg to service
- [x] 5.3 Update `UpdateTaskDto`: add `version` to `OmitType` list since it's inherited from `Task` entity

## 6. Cleanup and verification

- [x] 6.1 Delete `apps/api/src/utils/lib/check-version.ts`
- [x] 6.2 Remove `export * from './lib/check-version'` from `apps/api/src/utils/index.ts`
- [x] 6.3 Grep for any remaining `checkVersionOrFail` or `check-version` references — must return zero results
- [x] 6.4 Verify build compiles with `npm run build`
- [x] 6.5 Run lint with `npm run lint`