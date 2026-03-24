# DocCum

DocCum is an MVP to certify the existence of files and text content by generating a SHA256 hash and a trusted server timestamp.

## Stack

- Frontend: SvelteKit + Tailwind CSS
- Backend: Bun + Hono
- Database: SQLite
- Containers: Docker Compose

## Quick Start

1. Install dependencies:

   bun --cwd src/backend install
   bun --cwd src/frontend install

2. Run locally:

   make dev

3. Run tests:

   make test-all

4. Validate architecture:

   make validate-architecture

5. Start full container stack:

   make start-infra

## Product Flow

1. User drops a file or pastes text in `/`.
2. Frontend calls `POST /api/certify`.
3. Backend computes SHA256 and stores certificate metadata in SQLite.
4. Frontend redirects to `/cert/:id`.
5. Public certificate page displays hash, timestamp, and QR URL.

## Architecture Overview

The backend follows DDD with vertical slicing:

- `src/backend/certification/domain`
- `src/backend/certification/application`
- `src/backend/certification/infrastructure`

Dependency direction:

`Infrastructure -> Application -> Domain`

### Testing Matrix

- Unit: domain + use cases (`src/backend/tests/certification/domain|application`)
- Integration: providers/repositories/controllers (`src/backend/tests/certification/infrastructure`)
- Acceptance: API end-to-end in-process (`src/backend/tests/acceptance`)
- E2E: browser flow with Playwright (`src/frontend/tests/e2e`)

## Versioning

Semantic Versioning (`X.Y.Z`) with pre-release major `0`.

- New feature: bump minor
- Fix: bump patch
- Breaking changes are not allowed before `1.0.0`

## License

MIT

