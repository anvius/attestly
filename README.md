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

## Architecture Overview

The backend follows DDD with vertical slicing:

- `src/backend/certification/domain`
- `src/backend/certification/application`
- `src/backend/certification/infrastructure`

Dependency direction:

`Infrastructure -> Application -> Domain`

## Versioning

Semantic Versioning (`X.Y.Z`) with pre-release major `0`.

- New feature: bump minor
- Fix: bump patch
- Breaking changes are not allowed before `1.0.0`

## License

MIT
