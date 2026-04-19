# Claude Project Guidelines

> [!IMPORTANT]
> **Primary Context Source**: Always refer to [AI.md](./AI.md) for the authoritative project rules, architecture, and standards.

## Core Rules Summary (Detailed in AI.md)
- **Modularity**: Plugin-based architecture.
- **Separation**: Business Logic (`src`) vs Infrastructure (`infrastructure`).
- **Shared Code**: Must go to `/common`.
- **Clients**: Thin wrappers in `web` and `mobile` using logic from `client/src`.

## Build & Run Commands
- **Install All Dependencies**: `npm install` (in respective directories)
- **Server (Express)**:
  - Run Dev: `cd server && npm run dev`
  - Build: `cd server && npm run build`
  - Start: `cd server && npm start`
- **Logging**: `./scripts/export_logs.sh <id> "<title>"`
