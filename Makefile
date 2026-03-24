SHELL := /bin/bash

.PHONY: dev dev-backend dev-frontend build test-all lint start-infra up-infra stop-infra test-docker validate-architecture deploy

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
	docker compose -f infra/docker-compose.yml up -d --build --remove-orphans

up-infra: start-infra
	@echo "Frontend: http://localhost:$${FRONTEND_PORT:-4174}"
	@echo "Backend health: http://localhost:$${BACKEND_PORT:-3001}/health"

stop-infra:
	docker compose -f infra/docker-compose.yml down --remove-orphans

test-docker: start-infra
	@timeout=90; \
	until curl -fsS "http://localhost:$${BACKEND_PORT:-3001}/health" >/dev/null; do \
		timeout=$$((timeout - 1)); \
		if [ $$timeout -le 0 ]; then \
			echo "Backend health check timed out"; \
			$(MAKE) stop-infra; \
			exit 1; \
		fi; \
		sleep 1; \
	done
	@timeout=90; \
	until curl -fsS "http://localhost:$${FRONTEND_PORT:-4174}" | grep -qi "DocCum"; do \
		timeout=$$((timeout - 1)); \
		if [ $$timeout -le 0 ]; then \
			echo "Frontend smoke check timed out"; \
			$(MAKE) stop-infra; \
			exit 1; \
		fi; \
		sleep 1; \
	done
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
