## 1. Create RoleQueryService

- [x] 1.1 Create `apps/api/src/resources/user-role/role-query.service.ts` with `@Injectable()` class containing: `hasGlobalRole`, `hasCompanyRole`, `getUserCompanyRoleType`, `getUserCompanyRoleTypeOrFail`, `findOneByCompanyName`, `count`
- [x] 1.2 Copy method implementations from `UserRoleService` into `RoleQueryService`, injecting `@InjectRepository(UserRole) private repository: Repository<UserRole>`

## 2. Update UserRoleModule

- [x] 2.1 Add `RoleQueryService` to `UserRoleModule` providers and exports arrays
- [x] 2.2 Remove `forwardRef` from `UserRoleModule` — change `forwardRef(() => UserAccessModule)` to direct `UserAccessModule` import

## 3. Update UserAccessService

- [x] 3.1 Change injection from `UserRoleService` to `RoleQueryService` in `UserAccessService` constructor (remove `forwardRef` and `@Inject`)
- [x] 3.2 Update `isAllowed` method to call `this.roleQueryService.hasGlobalRole` and `this.roleQueryService.hasCompanyRole`
- [x] 3.3 Remove unused `UserRoleService` import; add `RoleQueryService` import from `../user-role/role-query.service`

## 4. Update UserAccessModule

- [x] 4.1 Remove `forwardRef` — change `forwardRef(() => UserAccessModule)` self-reference and `forwardRef(() => UserRoleModule)` to direct imports

## 5. Remove query methods from UserRoleService

- [x] 5.1 Remove `hasGlobalRole`, `hasCompanyRole`, `getUserCompanyRoleType`, `getUserCompanyRoleTypeOrFail`, `findOneByCompanyName`, `count` from `UserRoleService`
- [x] 5.2 Remove `@Inject(forwardRef(() => UserRoleService))` from `user-access.service.ts` if still present (should be removed in task 3.1)

## 6. Remove barrel file and fix imports

- [x] 6.1 Update `apps/api/src/resources/user-role/index.ts` — update barrel to include `RoleQueryService` export (barrel kept since forwardRef cycle eliminated)
- [x] 6.2 Update `apps/api/src/resources/user-access/user-access.service.ts` — change `import { UserRoleService } from '../user-role'` to direct import from `../user-role/user-role.service` (if still referenced) or `../user-role/role-query.service`
- [x] 6.3 Update `apps/api/src/resources/user-access/user-access.module.ts` — change `import { UserRoleModule } from '../user-role'` to `import { UserRoleModule } from '../user-role/user-role.module'`
- [x] 6.4 Update `apps/api/src/resources/company/company.module.ts` — change `import { UserRoleModule } from '../user-role'` to `import { UserRoleModule } from '../user-role/user-role.module'`

## 7. Update any external callers of removed UserRoleService methods

- [x] 7.1 Search for all callers of `hasGlobalRole`, `hasCompanyRole`, `getUserCompanyRoleType`, `getUserCompanyRoleTypeOrFail`, `findOneByCompanyName`, `count` on `UserRoleService` and update them to use `RoleQueryService`

## 8. Verify

- [x] 8.1 Run `npm run lint` in `apps/api` and fix any errors
- [x] 8.2 Run `npm run build` to verify TypeScript compilation succeeds
- [x] 8.3 Run `npm run test` to verify no regressions