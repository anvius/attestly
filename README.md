# Attestly

> Certify the existence of files and text with SHA-256 and a trusted timestamp.

[![CI](https://github.com/anvius/attestly/actions/workflows/ci.yml/badge.svg)](https://github.com/anvius/attestly/actions/workflows/ci.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Version](https://img.shields.io/badge/version-1.3.2-green)](package.json)
[![Runtime: Bun](https://img.shields.io/badge/runtime-Bun-f9f1e1?logo=bun)](https://bun.sh)
[![Frontend: SvelteKit](https://img.shields.io/badge/frontend-SvelteKit-ff3e00?logo=svelte)](https://kit.svelte.dev)

**Attestly** lets anyone generate a **cryptographic proof-of-existence certificate** for a document or text snippet. The original content is never stored — only its SHA-256 fingerprint, a server UTC timestamp, and the cumulative chain digest linking it to every previous certificate.

Live at [doccum.com](https://doccum.com).

> **Hackathon project** — Built for the [CubePath 2026 Hackathon](https://github.com/midudev/hackaton-cubepath-2026) by [@anvius](https://anvius.com).

---

## Screenshots

| Home | Certificate | Verify |
|------|-------------|--------|
| ![Home](docs/screenshots/home-dark.png) | ![Certificate](docs/screenshots/certificate.png) | ![Verify](docs/screenshots/verify.png) |

---

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | SvelteKit 2 + Svelte 5 + Tailwind CSS 3 |
| Backend | Bun + Hono |
| Database | SQLite (`bun:sqlite`) |
| Containers | Docker Compose + multi-stage builds |
| Analytics | GoatCounter (cookieless, GDPR-friendly) |

---

## Quick Start

```bash
# 1. Install dependencies
bun install --cwd src/backend
bun install --cwd src/frontend

# 2. Configure environment (optional for basic dev)
cp .env.example .env

# 3. Start servers in parallel
make dev
```

Open [http://localhost:5173](http://localhost:5173).

### Run all tests

```bash
make test-all
```

### Full stack in Docker

```bash
make start-infra
```

---

## Product Flow

1. The user drags a file or pastes text on `/`.
2. The frontend calls `POST /api/certify`.
3. The backend computes SHA-256, captures a UTC timestamp, and chains the certificate to the previous one (seeded chain digest).
4. The frontend redirects to `/cert/:id`.
5. The public certificate page shows hash, timestamp, chain digest, previous digest, and a QR code linking to the URL.

---

## Privacy

- The original content is **never stored**.
- File names are not persisted.
- Only minimal metadata and cryptographic evidence are kept.
- No third-party cookies. No invasive tracking.

---

## API

See [docs/API.md](docs/API.md) for the full public API reference with cURL examples.

---

## Architecture

DDD with vertical slicing. Each feature is a self-contained column:

```
src/backend/
├── certification/        ← feature: certification
│   ├── domain/           ← pure business logic
│   ├── application/      ← use cases
│   └── infrastructure/   ← HTTP, SQLite, crypto adapters
├── contact/              ← feature: contact form
│   ├── application/
│   └── infrastructure/
└── shared/               ← config, server, DB connection
```

Dependency direction: `Infrastructure → Application → Domain`

### Test Matrix

| Level | Covers | Tool |
|-------|--------|------|
| Unit | Domain + use cases | `bun:test` |
| Integration | Providers, repos, controllers | `bun:test` |
| Acceptance | In-process API end-to-end | `bun:test` |

---

## Frontend Experience

- Bilingual interface (Spanish / English).
- Theme selector (`system` / `light` / `dark`).
- Step-by-step process page: `/process`.
- FAQ and help: `/help`.
- Legal pages: `/legal`, `/privacy`, `/terms`.
- Social sharing from certificate pages (X, LinkedIn, Web Share API).

---

## Environment Variables

See [`.env.example`](.env.example) for the full list with descriptions.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, commit conventions, and architecture rules.

---

## Legal Notice

The legal pages align the MVP with GDPR / LOPDGDD / LSSI for transparency and privacy by design, but they do not constitute legal advice. Obtain professional legal review before any production deployment.

---

## License

[GPL-3.0-or-later](LICENSE)

