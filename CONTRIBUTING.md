# Contributing to DOCCUM

Thank you for your interest in contributing. This project follows
[Conventional Commits](https://www.conventionalcommits.org/) and
[Semantic Versioning](https://semver.org/).

## Setup

```bash
# Install dependencies for both workspaces
bun install --cwd src/backend
bun install --cwd src/frontend

# Copy environment template
cp .env.example .env

# Start local dev servers (runs both in parallel)
make dev
```

## Running Tests

```bash
# All tests: unit, integration, acceptance, E2E
make test-all

# Backend tests only
cd src/backend && bun test

# Frontend E2E (requires servers running)
cd src/frontend && bun run test
```

## Code Style

```bash
# Lint backend
cd src/backend && bun run lint

# Lint + type-check frontend
cd src/frontend && bun run check && bun run lint
```

## Commit Convention

| Prefix | When to use |
|--------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Internal restructuring (no behavior change) |
| `test` | Add or update tests |
| `docs` | Documentation only |
| `chore` | Tooling, build, deps |

Example: `feat(certification): add PDF evidence snapshot`

## Architecture Rules

- DDD with vertical slicing — no global `domain/`, `application/`, or `infrastructure/` folders
- Dependency direction: `Infrastructure → Application → Domain`
- See [AGENTS.md](AGENTS.md) for the full rule set
- See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for design context

## License

By contributing you agree that your changes will be licensed under [GPL-3.0-or-later](LICENSE).
