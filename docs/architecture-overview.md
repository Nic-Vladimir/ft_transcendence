# Target Microservice Architecture (v0)

## Purpose
This document describes the target architecture of the project and how it relates to the current repository state. It serves as a reference for organizing the system and guiding future evolution.

---

## Current implementation state
The current repository is not yet a full microservice system.

At the moment:
- the application runs as a single Next.js service
- Caddy is used as the HTTP entrypoint (reverse proxy)
- PostgreSQL is used as the main database
- Prisma is present for database access
- the frontend uses the App Router structure (`src/app`)
- the current homepage is still close to the default Next.js starter page
- some auth/user-related support code already exists in `src/lib` and `src/hooks`

---

## Target architecture
The target architecture separates the system into logical domains while keeping a simple deployment at the beginning:

- Edge Gateway (Caddy)
- Frontend Service (Next.js)
- Auth domain
- User domain
- Quiz domain
- Content domain
- PostgreSQL (initially shared)
- Redis as shared infrastructure (optional later)
- REST APIs for communication

The goal is to define clear boundaries first, and only split into separate services when needed.

---

## Component responsibilities

### Client Layer
The client layer represents the browser-based user interface. Clients communicate only through the Edge Gateway.

### Edge Gateway (Caddy)
Caddy acts as the public entrypoint of the system. It is responsible for:
- HTTP/HTTPS handling
- TLS termination
- request routing
- forwarding headers

It should remain thin and must not contain business logic.

### Frontend Service (Next.js)
The Frontend Service provides the user interface and handles client interactions. It also currently hosts backend logic through API routes. This service acts as a combined frontend/backend during early development.

### Auth Domain
Responsible for authentication and identity-related operations such as registration, login, logout, and session validation.

### User Domain
Responsible for user profiles, account-related operations, and administrative user management.

### Quiz Domain
Responsible for quiz execution, session lifecycle, scoring, and game-related logic.

### Content Domain
Responsible for question banks, categories, and content management.

### Database (PostgreSQL)
Currently a single shared database. In a full microservice architecture, each service would own its own data, but this separation is not required at the beginning.

### Redis (optional)
Used for caching, sessions, or transient state if needed later. Not required for the initial implementation.

---

## Communication model
- Clients communicate with the system via HTTPS through Caddy.
- Caddy routes requests to the Next.js application.
- Internal communication is currently handled within the same application.
- Future service-to-service communication will use REST APIs.
- Each domain should conceptually own its data, even if the database is shared initially.

---

## Mapping from current repo to target architecture
The current repository can be understood as a baseline that will evolve toward the target architecture.

Rough mapping:
- Caddy -> Edge Gateway
- current Next.js app -> frontend + backend combined service
- auth/user logic in `src/lib` and `src/hooks` -> future domain separation
- Prisma/PostgreSQL -> initial shared persistence layer

---

## Evolution strategy
- Step 1: Keep a single application (Next.js + Postgres)
- Step 2: Organize code by domain (auth, user, quiz, content)
- Step 3: Define clear API boundaries (REST)
- Step 4: Extract services only when needed

---

## Diagram
![Target Microservice Architecture](./target-microservice-architecture-v0.png)