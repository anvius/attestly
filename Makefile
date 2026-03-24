SHELL := /bin/bash

.PHONY: dev dev-backend dev-frontend build test-all lint start-infra stop-infra test-docker validate-architecture deploy

dev:
	@echo "Starting backend and frontend in parallel"
	@$(MAKE) -j2 dev-backend dev-frontend

dev-backend:
	cd src/backend && bun run dev

dev-frontend:
	cd src/frontend && bun run dev

build:
	cd src/backend && bun run build
	cd src/frontend && bun run build

test-all:
	cd src/backend && bun run test
	cd src/frontend && bun run test

lint:
	cd src/backend && bun run lint
	cd src/frontend && bun run lint

start-infra:
	docker compose -f infra/docker-compose.yml up -d

stop-infra:
	docker compose -f infra/docker-compose.yml down

test-docker: start-infra
	docker compose -f infra/docker-compose.yml exec backend bun test
	docker compose -f infra/docker-compose.yml exec frontend bun run check
	docker compose -f infra/docker-compose.yml exec frontend bun run lint
	docker compose -f infra/docker-compose.yml exec frontend bun run build
	$(MAKE) stop-infra

validate-architecture:
	@test -d src/backend/certification/domain
	@test -d src/backend/certification/application
	@test -d src/backend/certification/infrastructure
	@test -d src/frontend/src/routes
	@test -d infra/docker
	@test -d etc
	@test -d var/log
	@echo "Architecture validation passed"

deploy:
	@echo "Deploy simulation for Hackathon MVP"
	docker compose -f infra/docker-compose.yml up -d --build
	@echo "Deployment complete (simulated)"
