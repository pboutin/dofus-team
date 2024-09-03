# Build configuration
# --------------------

APP_NAME = `grep -m1 name package.json | awk -F: '{ print $$2 }' | sed 's/[ ",]//g'`
APP_VERSION = `git describe --tags`
GIT_REVISION = `git rev-parse HEAD`

PARCEL_ASSETS = ./src/ui/styles.css ./src/ui/settings/settings.tsx ./src/ui/dashboard/dashboard.tsx

# Introspection targets
# ----------------------

.PHONY: help
help: header targets

.PHONY: header
header:
	@echo "\033[34mEnvironment\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@printf "\033[33m%-23s\033[0m" "APP_NAME"
	@printf "\033[35m%s\033[0m" $(APP_NAME)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "APP_VERSION"
	@printf "\033[35m%s\033[0m" $(APP_VERSION)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "GIT_REVISION"
	@printf "\033[35m%s\033[0m" $(GIT_REVISION)
	@echo "\n"

.PHONY: targets
targets:
	@echo "\033[34mTargets\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@perl -nle'print $& if m{^[a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

#  Project targets
# -------------------

.PHONY: install
install:
	npm ci

.PHONY: format
format:
	npx prettier --write .
	npx eslint . --fix --max-warnings=0

.PHONY: lint
lint:
	npx prettier --check .
	npx eslint . --max-warnings=0

.PHONY: start
start:
	npx electron-forge start

.PHONY: package
package:
	npx electron-forge package
