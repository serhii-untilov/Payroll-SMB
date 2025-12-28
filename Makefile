# =====================================
# Full Release + Docker Makefile
# =====================================

# Usage examples:
#   make release VERSION=v1.5.0
#   make docker-release VERSION=v1.5.0
#   make release-full VERSION=v1.5.0
#   make release-publish VERSION=v1.5.0
#   make release-ci VERSION=v1.5.0
# =====================================

RELEASE_FILE := RELEASE.md
CHANGELOG := CHANGELOG.md
CI ?= false
RC ?=
BETA ?=

# -------------------------------------
# Helpers
# -------------------------------------

define confirm
	@if [ "$(CI)" != "true" ]; then \
		read -p "$(1) [y/N]: " ans; \
		[ "$$ans" = "y" ] || exit 1; \
	fi
endef

json_version = node -p "require('./$(1)/package.json').version" 2>/dev/null

detect_version = \
	$(or \
		$(VERSION), \
		$(shell test -f package.json && $(call json_version,.)), \
		$(shell test -f api/package.json && $(call json_version,api)), \
		$(shell test -f web/package.json && $(call json_version,web)) \
	)

VERSION := $(detect_version)

ifdef RC
	VERSION := $(VERSION)-rc.$(RC)
endif

ifdef BETA
	VERSION := $(VERSION)-beta.$(BETA)
endif

TAG := v$(VERSION)

# -------------------------------------
# Guards
# -------------------------------------

guard-version:
ifndef VERSION
	$(error Cannot determine VERSION)
endif

guard-gh:
	@command -v gh >/dev/null || (echo "❌ gh not installed"; exit 1)

guard-clean:
	@git diff --quiet || (echo "❌ Working tree not clean"; exit 1)

# -------------------------------------
# Version info
# -------------------------------------

## Show resolved version
version:
	@echo $(TAG)

# -------------------------------------
# Git / GitHub release targets
# -------------------------------------

## Create and push git tag
tag: guard-version guard-clean
	@if git rev-parse $(TAG) >/dev/null 2>&1; then \
		echo "⚠️  Tag $(TAG) already exists, skipping tag creation"; \
	else \
		git tag $(TAG); \
		git push origin $(TAG); \
	fi

## Generate RELEASE.md + draft GitHub release
release-draft: guard-gh guard-version
	@bash -c '\
		echo "📝 Generating RELEASE.md from git commits for $(TAG)"; \
		if git describe --tags --abbrev=0 $(TAG)^ >/dev/null 2>&1; then \
			START_TAG=$$(git describe --tags --abbrev=0 $(TAG)^); \
		else \
			START_TAG=$$(git rev-list --max-parents=0 HEAD); \
		fi; \
		echo "ℹ️  Generating notes from $$START_TAG..$(TAG)"; \
		git log --pretty=format:"* %s" $$START_TAG..$(TAG) > $(RELEASE_FILE); \
		if gh release view $(TAG) >/dev/null 2>&1; then \
			echo "ℹ️  Updating existing GitHub release $(TAG)"; \
			gh release edit $(TAG) --notes-file $(RELEASE_FILE); \
		else \
			echo "ℹ️  Creating draft release $(TAG)"; \
			gh release create $(TAG) --draft --notes-file $(RELEASE_FILE); \
		fi'

## Append RELEASE.md to CHANGELOG.md
changelog:
	@echo "\n---\n" >> $(CHANGELOG)
	@cat $(RELEASE_FILE) >> $(CHANGELOG)
	@echo "✅ Appended to $(CHANGELOG)"

## Full local release flow (draft + changelog)
release: tag release-draft changelog
	@echo "✅ Draft release ready: $(TAG)"

## Publish draft release
release-publish: guard-gh guard-version
# 	$(call confirm,"Publish release $(TAG)?")
	gh release edit $(TAG) --draft=false
	@echo "🚀 Published $(TAG)"

# -------------------------------------
# Docker build targets
# -------------------------------------

## Build & push Docker images for a specific version
docker-release: guard-version
# 	$(call confirm,"🐳 Build & push Docker images with tag $(TAG)?")
	@echo "Building Docker images for version $(TAG)..."
	TAG=$(TAG) npm run d:multi
# 	TAG=$(TAG) docker buildx bake --push --progress auto --set tags=$(TAG)
	@echo "✅ Docker images built and pushed with tag $(TAG)"

# -------------------------------------
# Combined full release + Docker
# -------------------------------------

release-full: release docker-release
	@echo "✅ Full release completed for $(TAG)"

# -------------------------------------
# CI-friendly release (no prompts)
# -------------------------------------

release-ci:
	@$(MAKE) CI=true release

docker-ci:
	@$(MAKE) CI=true docker-release

release-full-ci:
	@$(MAKE) CI=true release-full

# -------------------------------------
# Pre-release helpers
# -------------------------------------

release-rc:
	@$(MAKE) release RC=$(RC)

release-beta:
	@$(MAKE) release BETA=$(BETA)

# -------------------------------------
# Cleanup
# -------------------------------------

release-delete: guard-gh guard-version
# 	$(call confirm,"Delete release $(TAG)?")
	gh release delete $(TAG) --yes
	git tag -d $(TAG)
	git push origin :refs/tags/$(TAG)
	@echo "🗑️  Deleted release $(TAG) and tag"
