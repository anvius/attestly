# ARCHITECTURE

## Style

- Domain-Driven Design
- Vertical slicing
- Screaming architecture

## Slice Layout

`src/backend/certification/`

- `domain/`
- `application/`
- `infrastructure/`

## Dependency Direction

`Infrastructure -> Application -> Domain`

## Runtime

- Backend runtime: Bun
- Frontend framework: SvelteKit
- Database: SQLite

## Deployment

- Docker files under `infra/docker/`
- Compose orchestration in `infra/docker-compose.yml`
- Makefile as command entry point
