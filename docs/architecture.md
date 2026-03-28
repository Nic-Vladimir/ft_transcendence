Current Architecture

Client → Gateway (Caddy) → App (Next.js) → Database (Postgres)

Data flow

Browser request
→ Caddy (TLS + routing)
→ Next.js (API or page)
→ Prisma
→ PostgreSQL
→ Response back