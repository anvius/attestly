# Changelog

All notable changes to DOCCUM are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

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
- **Docker + Dokploy**: multi-stage production images and a `docker-compose.dokploy.yml` for one-command deployment.
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
  docker-compose.yml          Local development
  docker-compose.dokploy.yml  Production (CubePath)
```

---

[1.0.0]: https://github.com/anvius/hackaton-midudev-2026/releases/tag/v1.0.0
