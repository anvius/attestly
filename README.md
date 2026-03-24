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
3. Backend computes SHA256, captures UTC timestamp, and attempts external time evidence snapshots from CubePath public pages.
4. Backend links each certificate to previous digest (seeded chain model).
5. Frontend redirects to `/cert/:id`.
6. Public certificate page displays hash, timestamp, chain digest, previous digest, evidence hashes, and QR URL.

## Privacy Model

- Original content is not stored.
- File names are not stored.
- Only minimal metadata and cryptographic evidence are persisted.

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

## Frontend Experience

- Bilingual interface (Spanish/English).
- Theme selector with system default (`system` / `light` / `dark`).
- Process explainer page: `/process`.
- About page with product origin context: `/about`.
- FAQ and help pages: `/faq`, `/help`.
- Legal pages: `/legal`, `/privacy`, `/terms`.

## Contacto SMTP y Legal

- Contacto: el formulario de `/contact` envía directamente a `POST /api/contact`.
- Backend: el envío usa SMTP configurable en `etc/config.json` (`contact.smtp.host`, `port`, `secure`, `username`, `password`, `fromEmail`, `toEmail`).
- Sin redirección a Gmail: la respuesta es `ok` y el usuario permanece en la aplicación.
- Mapa legal público: `/legal` (información legal), `/privacy` (privacidad), `/terms` (condiciones), con acceso también desde el pie.

## Legal Note

The legal page is written to align the MVP with Spanish legal frameworks (RGPD/LOPDGDD/LSSI) for transparency and privacy-by-design, but it is not legal advice. Obtain legal counsel review before production deployment.

## Versioning

Semantic Versioning (`X.Y.Z`) with pre-release major `0`.

- New feature: bump minor
- Fix: bump patch
- Breaking changes are not allowed before `1.0.0`

## License

GPL-3.0-or-later

