# BloodConnect: Master Project Context (SSOT)

> [!IMPORTANT]
> This is the **Single Source of Truth (SSOT)** for all AI agents (Claude, Cursor, etc.) working on this project. All architectural decisions, coding standards, and directory structures defined here must be followed strictly.

## 1. Core Principles & Architecture
- **Modularity**: Everything is built as a plugin/module, including infrastructure.
- **Strict Separation**: 
  - **Logic**: Pure business rules and domain services reside in `src` directories. Must be infrastructure-agnostic.
  - **Infrastructure**: Exposes logic through microservices (HTTP, functions). Resides in `infrastructure` directories.
- **Shared First**: Any code (types, utils, interfaces) used by both server and client **must** be placed in `/common`.

## 2. Directory Structure
- `/common`: Shared TypeScript code, types, and utilities.
- `/server/src`: Domain logic and business rules.
- `/server/infrastructure`: Microservice wrappers (Express, AWS, GCP, etc.).
- `/client/src`: Shared client logic, state management, and hooks.
- `/client/web`: React implementation (mechanism to expose the logic).
- `/client/mobile`: React Native implementation (mechanism to expose the logic).

## 3. Technology Stack
- **Language**: TypeScript (Strict mode).
- **Backend**: Node.js.
- **Frontend**: React (Web) & React Native (Mobile).
- **Database**: PostgreSQL (via Docker).

## 4. Development Guidelines
- Maintain thin client wrappers; maximize logic sharing in `client/src`.
- Ensure infrastructure is swappable and modular.
- Use Docker for local database and environment consistency.
- Refer to `docker-compose.yml` for infrastructure service definitions.

## 5. Conversation & Prompt Logging
To maintain a historical record of all interactions within the repository:
- **Directory**: `/prompts`
- **Mandatory Checkpoints**: The agent **MUST** automatically log the verbatim conversation history when:
  - A major architectural change is completed (e.g., setting up global ESLint/TS).
  - A primary feature or module is implemented.
  - A session reaches a natural stopping point or before ending the conversation.
- **Mechanism**: Use `./scripts/export_logs.sh <Conversation_ID> "<Descriptive_Title>"` to export logs.
- **File Naming**: Logs are saved as `YYYYMMDD_HHMMSS-<sanitized_title>.md` in the `/prompts` directory to ensure chronological sorting.
- **Goal**: Ensure the project context remains persistent and portable across different AI sessions.
