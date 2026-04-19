# BloodConnect: Master Project Context (SSOT)

> [!IMPORTANT]
> This is the **Single Source of Truth (SSOT)** for all AI agents (Claude, Cursor, etc.) working on this project. All architectural decisions, coding standards, and directory structures defined here must be followed strictly.

## 1. Core Principles & Architecture
- **Modularity**: Everything is built as a plugin/module, including delivery mechanisms and data sources.
- **Layered Separation**: 
  - **Application (src/)**: Contains core logic and data access.
    - **Domain Logic**: Pure business rules and domain services.
    - **Data Repository**: Defines how data is fetched/stored (SQL, HTTP APIs). Part of the application source as it defines the data contract.
  - **Infrastructure (infrastructure/)**: Contains **Delivery Mechanisms**. Exposes the application to the outside world (e.g., Express, AWS Lambda, CLI).
- **Shared First**: Any code used by both server and client **must** be placed in `/common`.

## 2. Directory Structure
- `/common`: Shared TypeScript code, types, and utilities.
- `/server/src`: Application layer (Domain Logic & Data Repositories).
- `/server/infrastructure`: Delivery layer (Express, AWS, GCP, etc.).
- `/client/src`: Shared client logic, state management, and hooks.
- `/client/web`: React web implementation.
- `/client/mobile`: React Native mobile implementation.

## 3. Technology Stack
- **Language**: TypeScript (Strict mode).
- **Backend**: Node.js.
- **Frontend**: React (Web) & React Native (Mobile).
- **Database**: SQL (PostgreSQL by default, configurable via Sequelize).

## 4. Coding Standards
- **Exports**: Default export is preferred for files with a single primary class, interface, or object.
- **Types vs. Interfaces**:
  - Use `type` for pure data structures, state shapes, and DTOs.
  - Use `interface` for behavioral definitions, contracts, and objects that will be implemented by classes.
- **Logic Placement**: Maintain thin client wrappers; maximize logic sharing in `client/src`.
- **Infrastructure**: Ensure infrastructure is swappable and modular.

## 5. Database & DTO Design
- **Primary Keys**: Prefer UUIDs (v4) for all primary keys.
- **Timestamps**: All tables should include standard `createdAt` and `updatedAt` timestamps.
- **Enums**: Use string-based enums for statuses, types, and fixed categories to ensure database readability.
- **DTOs**:
  - Reside in `/common/dtos/`.
  - Should be pure data structures without system timestamps (`createdAt`, `updatedAt`) unless business-critical.
- **Models**:
  - Reside in the application layer (`src/dataRepository/...`).
  - Must implement the `Serializable<Dto>` interface to handle bidirectional mapping.
  - Use default exports for model classes.

## 6. Development Workflow
- Use Docker for local database and environment consistency.
- Refer to `docker-compose.yml` for infrastructure service definitions.

## 7. Conversation & Prompt Logging
To maintain a historical record of all interactions within the repository:
- **Directory**: `/prompts`
- **Mandatory Checkpoints**: The agent **MUST** automatically log the verbatim conversation history when:
  - A major architectural change is completed (e.g., setting up global ESLint/TS).
  - A primary feature or module is implemented.
  - A session reaches a natural stopping point or before ending the conversation.
- **Mechanism**: Use `./scripts/export_logs.sh <Conversation_ID> "<Descriptive_Title>"` to export logs.
- **File Naming**: Logs are saved as `YYYYMMDD_HHMMSS-<sanitized_title>.md` in the `/prompts` directory to ensure chronological sorting.
- **Goal**: Ensure the project context remains persistent and portable across different AI sessions.
