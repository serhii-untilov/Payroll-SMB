## Context

The codebase uses `BaseUserAccess` as the base class for services that need permission checks. It provides a single `canOrFail(userId, action, context?)` method. Several newer services (company, person, department, role, job, etc.) already call `canOrFail` inside their service methods.

However, 5 resources still have the old pattern where controllers called `availableXxxOrFail()` methods directly. Those methods no longer exist (the old abstract class was removed), leaving dead code that won't compile. The refactoring is already partially done — all 5 services already extend `BaseUserAccess` — but the call sites in controllers still reference the removed methods.

## Goals / Non-Goals

**Goals:**
- Migrate all 5 remaining resources to use `canOrFail` inside service methods
- Remove all `availableXxxOrFail` calls from controllers
- Make the access control pattern consistent across all resources: permission checks live in services, not controllers

**Non-Goals:**
- Changing the `canOrFail` or `BaseUserAccess` implementation
- Changing the `Action` enum
- Changing the `ActionContextDto` shape
- Changing any API endpoints, DTOs, or response shapes
- Adding new permissions or changing permission logic

## Decisions

### 1. Access checks move into service methods (not controllers)

**Decision**: Follow the pattern from `company.service.ts`, `person.service.ts`, etc., where `canOrFail` is called at the top of service methods.

**Rationale**: Services already extend `BaseUserAccess` and have `canOrFail` available. Access checks in controllers duplicate business logic concerns. Putting them in services ensures they're always enforced, even on internal calls.

**Alternative considered**: Keep checks in controllers but swap method names — rejected because inconsistent with the rest of the codebase.

### 2. Method signature change: `userId` added to methods that need access checks

**Decision**: Methods like `findAll`, `findOne`, `findAllBalance`, `findFirstByPersonId` that previously didn't take `userId` now accept it as the first parameter when they need access checks.

**Rationale**: `canOrFail` requires `userId`. The `userId` is already available in controllers (extracted from the request), so passing it through is clean.

### 3. Context mapping follows semantic meaning of the old method names

| Old method                  | Action         | Context                      |
|-----------------------------|----------------|------------------------------|
| `availableCreateOrFail`     | `Action.Create`| `{ companyId }`              |
| `availableFindAllOrFail`    | `Action.Read`  | `{ companyId }`              |
| `availableFindOneOrFail`    | `Action.Read`  | `{ resourceId: id }`         |
| `availableUpdateOrFail`     | `Action.Update`| `{ resourceId: id }`         |
| `availableDeleteOrFail`     | `Action.Remove`| `{ resourceId: id }`         |

**Rationale**: The old method names directly map to CRUD actions. `FindAll` → Read with company scope, `FindOne` → Read with resource scope, `Create` → Create with company scope, `Update` → Update with resource scope, `Delete` → Remove with resource scope.

### 4. position-history findAll line 66: `availableCreateOrFail` used for a read operation

**Decision**: Change to `canOrFail(userId, Action.Read, { companyId })` — this was likely a bug or shortcut. `findAll` is a read operation, not a create.

**Rationale**: The endpoint is `POST /position-history/find` which returns a list — a read operation semantically.

## Risks / Trade-offs

- **[Signature changes cascade]** → Services like `positions.findAll` are called from other services (e.g., `position-history` calls `positionsService.findOne`). Those callers must also pass `userId`. This is limited since all callers are controllers that have `userId`.
- **[No compile-time check for missed call sites]** → Grep for `availableXxxOrFail` must return zero results after migration.
- **[Low risk]** → All 5 services already extend `BaseUserAccess`. No structural changes needed beyond adding calls and updating signatures.