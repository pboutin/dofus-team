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

.PHONY: lint
lint:
	npx prettier --check .

.PHONY: dev-electron
dev-electron:
	mkdir -p ./dist
	npx tsc -w -p ./src/electron/tsconfig.json

.PHONY: dev-ui
dev-ui:
	mkdir -p ./dist
	cp *.html ./dist/
	npx parcel watch $(PARCEL_ASSETS)

.PHONY: compile
compile: compile-ui compile-electron

.PHONY: compile-ui
compile-ui:
	mkdir -p ./dist
	cp *.html ./dist/
	npx parcel build --no-optimize --no-source-maps --no-cache $(PARCEL_ASSETS)

.PHONY: compile-electron
compile-electron:
	mkdir -p ./dist
	npx tsc -p ./src/electron/tsconfig.json

.PHONY: start
start: compile
	npx electron ./dist/electron/main.js

.PHONY: debug-electron
debug-electron:
	npx electron ./dist/electron/main.js debug
