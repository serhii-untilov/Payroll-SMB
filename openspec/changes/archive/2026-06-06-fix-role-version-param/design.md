## Context

The Role resource is a full-feature resource — its entity extends `BaseEntity`, which includes a `version` field for optimistic concurrency. The service layer is already correctly implemented: `update`, `remove`, and `restore` all accept a `version` parameter and use `repository.update({ id, version }, ...)` to enforce optimistic locking.

However, the controller layer is broken: the `update` and `remove` routes omit `:version`, no `@Param('version')` is extracted, and `version` is not forwarded to the service. The `restore` endpoint is missing entirely. This means all role mutations bypass optimistic concurrency, creating a lost-update risk.

## Goals / Non-Goals

**Goals:**

- Fix Role controller to match the established pattern used by Company and other full-feature resources
- Add `:version` route segment to `update` (`@Patch(':id/:version')`) and `remove` (`@Delete(':id/:version')`)
- Add `@Param('version', ParseIntPipe) version: number` to both methods and pass it through to the service
- Add missing `restore` endpoint (`@Post(':id/restore/:version')`) with version parameter

**Non-Goals:**

- Changing the service layer (already correct)
- Changing the entity or DTO definitions
- Fixing other resources (scope limited to Role)
- Updating OpenAPI spec or codegen (separate concern)

## Decisions

### Decision 1: Follow Company controller pattern exactly

**Choice**: Mirror the Company controller's route structure and parameter extraction.

**Rationale**: Company is the canonical full-feature resource in this codebase. Consistency reduces cognitive load and matches client expectations.

### Decision 2: Use `ParseIntPipe` for version parameter

**Choice**: `@Param('version', ParseIntPipe) version: number`

**Rationale**: Matches all other full-feature controllers. Ensures type safety and automatic 400 errors for non-integer version values.

### Decision 3: Include restore endpoint

**Choice**: Add `@Post(':id/restore/:version')` with version.

**Rationale**: The service already implements `restore(userId, id, version)`. Since Role extends `BaseEntity` (which has soft-delete via `deletedDate`), clients need a way to restore soft-deleted roles. Omitting this endpoint leaves functionality unreachable.

## Risks / Trade-offs

- **[Breaking API change]** Routes change from `PATCH /roles/:id` → `PATCH /roles/:id/:version` and `DELETE /roles/:id` → `DELETE /roles/:id/:version` → **Mitigation**: Front-end clients must be updated to include version in requests. Coordinate deployment with client updates.