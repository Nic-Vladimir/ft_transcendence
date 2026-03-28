# Target Microservice Architecture (v0)

## Purpose
This document describes the target microservice architecture of the project and how it relates to the current repository state.

## Current implementation state
The current repository is not yet a full microservice system.

At the moment:
- the application runs as a single Next.js service
- PostgreSQL is used as the main database
- Prisma is present for database access
- the frontend uses the App Router structure (`src/app`)
- the current homepage is still the default Next.js starter page
- some auth/user-related support code already exists in `src/lib` and `src/hooks`
- NGINX has been validated locally as a reverse proxy in front of the current frontend service

## Target architecture
The target architecture separates the system into:
- Edge Gateway
- Frontend Service
- Auth Service
- User Service
- Quiz Service
- Content Service
- per-service databases
- Redis as shared infrastructure
- gRPC contracts for internal service-to-service communication

## Component responsibilities

### Client Layer
The client layer represents the browser-based user interface. Clients communicate only through the Edge Gateway.

### Edge Gateway
The Edge Gateway is the public entrypoint of the system. It is responsible for request routing, TLS termination, and cross-cutting concerns such as forwarding headers and possibly lightweight authentication checks. It should remain thin and should not contain business logic.

### Frontend Service
The Frontend Service provides the web UI. It is responsible for page rendering and client-facing interactions. It should not own core business data.

### Auth Service
The Auth Service is responsible for authentication and identity-related operations such as registration, login, logout, and session validation.

### User Service
The User Service is responsible for user profiles, account-related operations, and administrative user management.

### Quiz Service
The Quiz Service is responsible for quiz execution, session lifecycle, scoring, and runtime game-related logic.

### Content Service
The Content Service is responsible for question banks, categories, and content-related operations.

### Per-service databases
Each backend service owns its own persistent data. Services must not access another service’s database directly.

### Redis
Redis is a shared infrastructure component used for sessions, caching, pub-sub, and transient state. It is not the primary source of truth for business data.

## Communication model
- Clients communicate with the system through HTTP/HTTPS via the Edge Gateway.
- Internal backend services communicate through gRPC where appropriate.
- Each service accesses only its own database directly.
- Shared infrastructure such as Redis is consumed by services, not by databases.

## Mapping from current repo to target architecture
The current repository can be understood as an early baseline that will later be decomposed into services.

Rough mapping:
- current Next.js app -> frontend service shell
- current auth-related code -> future auth service
- current user-related code -> future user service
- current Prisma/PostgreSQL setup -> initial persistence baseline
- current NGINX prototype -> future edge gateway implementation

## Diagram
![Target Microservice Architecture](./target-microservice-architecture-v0.png)
