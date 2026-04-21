.PHONY: build-dev
build-dev: ## Build the development docker image.
	docker compose -p app-client-dev -f docker/dev/compose.yaml build

.PHONY: start-dev
start-dev: ## Start the development docker container in detached mode.
	docker compose -p app-client-dev -f docker/dev/compose.yaml up -d

.PHONY: watch-dev
watch-dev: ## Start the development docker container in watch mode.
	docker compose -p app-client-dev -f docker/dev/compose.yaml up -w

.PHONY: stop-dev
stop-dev: ## Stop the development docker container.
	docker compose -p app-client-dev -f docker/dev/compose.yaml down

.PHONY: build-staging
build-staging: ## Build the staging docker image.
	docker compose -f docker/staging/compose.yaml build

.PHONY: start-staging
start-staging: ## Start the staging docker container.
	docker compose -f docker/staging/compose.yaml up -d

.PHONY: stop-staging
stop-staging: ## Stop the staging docker container.
	docker compose -f docker/staging/compose.yaml down
  
.PHONY: build-prod
build-prod: ## Build the production docker image.
	docker compose -p app-client-prod -f docker/prod/compose.yaml build

.PHONY: start-prod
start-prod: ## Start the production docker container.
	docker compose -p app-client-prod -f docker/prod/compose.yaml up -d

.PHONY: stop-prod
stop-prod: ## Stop the production docker container.
	docker compose -p app-client-prod -f docker/prod/compose.yaml down