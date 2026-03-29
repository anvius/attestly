# Changelog

All notable changes to Attestly are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [1.4.0] — 2026-03-24

### Added

- **Verify page**: new `/verify` route lets third parties upload a file to check if it was previously certified; shows hash, match result, and link to certificate.
- **Text certification**: certify plain text directly from the home page via a File/Text tab switcher; new `POST /api/certify-text` endpoint.
- **Certificate counter**: home page displays a live count of total certified files; new `GET /api/certificates/count` endpoint.
- **Example certificate link**: "See a certificate example" link on home page that points to the latest issued certificate; new `GET /api/certificates/latest` endpoint.
- **Navigation**: "Verify" link added to the site header.
- **i18n**: full Spanish and English translations for all new features.
- **Tests**: 14 new tests (unit for VerifyHashUseCase + CountCertificatesUseCase, integration for findByHash + count in SQLite repo, controller tests for verify, count, certify-text, and latest endpoints). Total: 58 tests.

## [1.3.2] — 2026-03-24

### Fixed

- **Banner**: hackathon message shown immediately on load (no API dependency); easter eggs rotate only on hover — fixes invisible banner on slow connections.
- **Deploy**: move `VITE_API_BASE_URL` from runtime `environment` to `build.args` in `compose.dokploy.yaml`; SvelteKit requires it at compile time.

## [1.3.1] — 2026-03-24

### Fixed

- **Banner**: hackathon message shown immediately on load (no API dependency); easter eggs rotate only on hover.

## [1.3.0] — 2026-03-24

### Added

- **Social sharing**: share certificate proof via X/Twitter, LinkedIn, and native Web Share API from the certificate page.

## [1.2.0] — 2026-03-24

### Added

- **Structured logging**: Loki-compatible JSON-lines file (`var/log/app.jsonl`); Hono middleware records 4xx warnings and 5xx errors with method, path, and status.

## [1.1.0] — 2026-03-24

### Added

- **Easter egg banner**: top banner rotates 4 developer in-jokes on hover; fade-in animation; responsive breakpoints refined.

### Changed

- **Container naming**: `Dockerfile.*` → `Containerfile.*`, `docker-compose.yml` → `compose.yaml`, `infra/docker/` → `infra/containers/` (OCI/Podman standard).

---

## [1.0.0] — 2026-03-24

First public release. Submitted to [CubePath 2026 Hackathon](https://github.com/midudev/hackaton-cubepath-2026) by [@anvius](https://anvius.com).

### Added

- **Cryptographic certification**: SHA-256 file fingerprinting with UTC timestamp and verifiable chain stored in SQLite.
- **QR verification**: every certificate exposes a public URL with a scannable QR code for third-party verification without revealing original file content.
- **Drag & drop upload**: SvelteKit CSR frontend with animated step-by-step certification flow.
- **Bilingual UI**: full Spanish / English i18n with instant language toggle.
- **Dark mode**: system-preference aware theme with manual override persisted in `localStorage`.
- **Contact form**: SMTP delivery protected by a server-side arithmetic CAPTCHA (no third-party services).
- **Legal pages**: Terms of Use, Privacy Policy, Legal Notice, and Support — all dynamically branded.
- **Configurable branding**: `etc/config.json` externalises name, domain, taglines, social links, and owner data — white-label ready.
- **GoatCounter analytics**: lightweight, privacy-respecting page-view tracking.
- **Containers + Dokploy**: multi-stage production images and a `compose.dokploy.yaml` for one-command deployment.
- **CI/CD**: GitHub Actions workflow for lint, type-check, and test on every push.
- **DDD vertical-slice backend**: Screaming Architecture with hexagonal ports — domain, application, and infrastructure strictly separated per slice (`certification/`, `contact/`).
- **44 tests**: unit, integration, and acceptance coverage across domain, application, and HTTP layers.

### Architecture

```
src/
  backend/   Hono + Bun, SQLite, DDD vertical slices
  frontend/  SvelteKit 2 + Svelte 5 + TailwindCSS 3
etc/
  config.json   Central configuration (branding, SMTP, owner)
infra/
  compose.yaml          Local development
  compose.dokploy.yaml  Production (CubePath)
```

---

[1.3.2]: https://github.com/anvius/attestly/compare/v1.0.0...v1.3.2
[1.3.1]: https://github.com/anvius/attestly/compare/v1.0.0...v1.3.1
[1.3.0]: https://github.com/anvius/attestly/compare/v1.0.0...v1.3.0
[1.2.0]: https://github.com/anvius/attestly/compare/v1.0.0...v1.2.0
[1.1.0]: https://github.com/anvius/attestly/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/anvius/attestly/releases/tag/v1.0.0
