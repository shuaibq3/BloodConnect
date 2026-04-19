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
- **Default Rule**: The agent **must** automatically log the entire verbatim conversation history at the end of a session, or whenever significant architectural/code changes are completed.
- **Mechanism**: The agent should run `./scripts/export_logs.sh <id> "<Session Title>"` to ensure the log is captured in Markdown format with a descriptive filename.
- **Summaries**: Only provide a summary of the conversation if specifically requested by the user. Otherwise, the formatted verbatim log is the primary record.
- **File Naming**: Logs are saved as `<sanitized_session_title>.md` in the `/prompts` directory.
