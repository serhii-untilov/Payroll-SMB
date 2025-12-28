# =====================================
# Full Release + Docker Makefile
# =====================================
# Usage examples:
#   make release-delete
#   make release
#   make docker-release
#   make release-publish
# -------------------------------------
#   make release-full
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

## Create GitHub release directly with auto-generated notes
release-draft: guard-gh guard-version guard-clean
# 	$(call confirm,"Create GitHub release $(TAG)?")
	@echo "📝 Creating GitHub release $(TAG) with auto-generated notes..."
	@if gh release view $(TAG) >/dev/null 2>&1; then \
		echo "⚠️  Release $(TAG) already exists, skipping creation"; \
	else \
		gh release create $(TAG) --draft --generate-notes; \
	fi
	@echo "✅ GitHub draft release ready: $(TAG)"

## Append RELEASE.md to CHANGELOG.md if it exists
changelog:
	@if [ -f $(RELEASE_FILE) ]; then \
		echo "\n---\n" >> $(CHANGELOG); \
		cat $(RELEASE_FILE) >> $(CHANGELOG); \
		echo "✅ Appended to $(CHANGELOG)"; \
	else \
		echo "⚠️  $(RELEASE_FILE) not found, skipping changelog update"; \
	fi

release: tag release-draft changelog
	@echo "✅ Draft release ready: $(TAG)"

## Publish draft release
release-publish: guard-gh guard-version
	$(call confirm,"Publish release $(TAG)?")
	gh release edit $(TAG) --draft=false
	@echo "🚀 Published $(TAG)"

# -------------------------------------
# Docker build targets
# -------------------------------------

## Build & push Docker images for a specific version
docker-release: guard-version
# 	$(call confirm,"🐳 Build & push Docker image with tag $(TAG)?")
	@echo "Building Docker image for version $(TAG)..."
	TAG=$(TAG) npm run d:multi
	@echo "✅ Docker image built and pushed with tag $(TAG)"

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
	$(call confirm,"Delete release $(TAG)?")
	gh release delete $(TAG) --yes
	git tag -d $(TAG)
	git push origin :refs/tags/$(TAG)
	@echo "🗑️  Deleted release $(TAG) and tag"
