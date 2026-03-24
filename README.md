# DOCCUM

> Certifica la existencia de archivos y textos con SHA-256 y marca de tiempo de confianza.

[![CI](https://github.com/midudev/hackaton-cubepath-2026/actions/workflows/ci.yml/badge.svg)](https://github.com/midudev/hackaton-cubepath-2026/actions/workflows/ci.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Version](https://img.shields.io/badge/version-0.1.0-green)](package.json)
[![Runtime: Bun](https://img.shields.io/badge/runtime-Bun-f9f1e1?logo=bun)](https://bun.sh)
[![Frontend: SvelteKit](https://img.shields.io/badge/frontend-SvelteKit-ff3e00?logo=svelte)](https://kit.svelte.dev)

DOCCUM permite a cualquier persona generar un **certificado criptográfico de existencia** para un documento o fragmento de texto. El contenido no se almacena: solo su huella SHA-256, una marca de tiempo UTC del servidor y el digest acumulativo de la cadena de certificados anterior.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | SvelteKit 2 + Svelte 5 + Tailwind CSS 3 |
| Backend | Bun + Hono |
| Base de datos | SQLite (`bun:sqlite`) |
| Contenedores | Docker Compose + multi-stage builds |
| Analytics | GoatCounter (cookieless, GDPR) |

---

## Inicio rápido

```bash
# 1. Instalar dependencias
bun --cwd src/backend install
bun --cwd src/frontend install

# 2. Configurar entorno (opcional para dev básico)
cp .env.example .env

# 3. Arrancar servidores en parallel
make dev
```

Abre [http://localhost:5173](http://localhost:5173).

### Todos los tests

```bash
make test-all
```

### Validar arquitectura

```bash
make validate-architecture
```

### Stack completo en Docker

```bash
make start-infra
```

---

## Flujo del producto

1. El usuario arrastra un archivo o pega texto en `/`.
2. El frontend llama a `POST /api/certify`.
3. El backend calcula SHA-256, captura timestamp UTC y enlaza el certificado a la cadena anterior (seeded chain digest).
4. El frontend redirige a `/cert/:id`.
5. La página pública del certificado muestra hash, timestamp, digest de cadena, digest previo y QR con la URL.

---

## Privacidad

- El contenido original **no se almacena**.
- No se almacenan nombres de archivo.
- Solo se persiste metadata mínima y evidencia criptográfica.
- Sin cookies de terceros. Sin tracking invasivo.

---

## Arquitectura

DDD con vertical slicing. Cada feature es una columna autónoma:

```
src/backend/
├── certification/        ← feature: certificación
│   ├── domain/           ← lógica de negocio pura
│   ├── application/      ← casos de uso
│   └── infrastructure/   ← adaptadores HTTP, SQLite, crypto
├── contact/              ← feature: formulario de contacto
│   ├── application/
│   └── infrastructure/
└── shared/               ← config, servidor, DB connection
```

Dirección de dependencias: `Infrastructure → Application → Domain`

### Matriz de tests

| Nivel | Qué cubre | Herramienta |
|-------|-----------|-------------|
| Unit | Domain + use cases | `bun:test` |
| Integration | Providers, repos, controllers | `bun:test` |
| Acceptance | API end-to-end en proceso | `bun:test` |
| E2E | Flujo en navegador | Playwright |

---

## Experiencia frontend

- Interfaz bilingüe (Español / English).
- Selector de tema (`system` / `light` / `dark`).
- Página explicativa del proceso: `/process`.
- FAQ y ayuda: `/help`.
- Páginas legales: `/legal`, `/privacy`, `/terms`.

---

## Variables de entorno

Consulta [`.env.example`](.env.example) para la lista completa con descripción.

---

## Contribuir

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para setup local, convención de commits y reglas de arquitectura.

---

## Nota legal

Las páginas legales alinean el MVP con RGPD/LOPDGDD/LSSI para transparencia y privacidad por diseño, pero no constituyen asesoramiento jurídico. Obtén revisión legal antes de despliegue en producción.

---

## Licencia

[GPL-3.0-or-later](LICENSE)

