# BloodConnect

BloodConnect is a platform to facilitate blood donation requests by connecting seekers with nearby donors.

## Project Structure

The project is organized as a monorepo with the following structure:

- `common/`: Shared code (types, interfaces, utilities) for both server and client.
- `server/`: Backend implementation.
  - `src/`: Core business logic and domain services (infrastructure-agnostic).
  - `infrastructure/`: Modular infrastructure implementations (e.g., Express, AWS, GCP).
- `client/`: Frontend implementation.
  - `src/`: Shared client-side logic (hooks, state, API clients).
  - `web/`: React web application.
  - `mobile/`: React Native mobile application.

## AI & Agent Context

> [!TIP]
> **Project Guidelines**: All AI agents should prioritize the rules defined in **[AI.md](./AI.md)**. This is the Single Source of Truth for the project's technical standards.

## Getting Started

### Prerequisites
- Node.js & npm/yarn
- Docker (for PostgreSQL)

### Database Setup
To start the local database:
```bash
docker-compose up -d
```
*(Ensure you have a docker-compose.yml in the root or appropriate directory)*

## Tech Stack
- **Languages**: TypeScript
- **Web**: React
- **Mobile**: React Native
- **Backend**: Node.js
- **Database**: PostgreSQL (Dockerized)
