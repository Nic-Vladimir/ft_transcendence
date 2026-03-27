# 🎯 Trivia App

A social trivia web app built with **Next.js**, **PostgreSQL**, and **Prisma ORM**, served over HTTPS via **Caddy**.

---

## ⚙️ Setup

```bash
make setup   # creates Docker volume folders
make dev     # starts the stack
```

Access at: **<https://localhost:8443>**

```bash
make cleanall  # tears down containers and volumes
```

---

## 🐳 Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| App      | Next.js (pages + API routes)  |
| Database | PostgreSQL + Prisma ORM       |
| Gateway  | Caddy (HTTPS, routing)        |
| Docs     | Swagger                       |
| Styling  | Bootstrap                     |

---

## 🗂️ Project Structure

```
pages/
├── api/
│   ├── auth/
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   ├── me.ts
│   │   ├── register.ts
│   │   └── [id].ts
│   └── users.ts
├── admin/
├── login.tsx
├── profile.tsx
└── swagger.tsx

components/admin/
├── AdminLayout.tsx
├── AdminSidebar.tsx
├── UserModals.tsx
└── UsersTable.tsx

hooks/
├── useAuth.ts
├── useProfile.ts
└── useUsers.ts
```

All API routes live under `pages/api/` and are handled server-side with Prisma + session auth. The frontend consumes them via `fetch('/api/...')`.

---

## 🔀 Routing (Caddy)

| Path                          | Target                  |
|-------------------------------|-------------------------|
| `/api/*`                      | Next.js API routes      |
| `/_next/*`, `/public/*`       | Next.js assets          |
| `/admin/*`, `/swagger*`       | Next.js pages           |
| `/*`                          | Next.js catch-all       |
| `/`                           | Static files (`/srv`)   |

HTTP → HTTPS redirect is handled automatically.

---

## 🍪 Auth & Sessions

Cookie-based sessions. On login, a session cookie is issued and validated on subsequent requests via `/api/auth/me`.

**To get admin access:**

1. Register with `admin@admin.com`
2. Run `./adminrole.sh`

> Currently only admin users can access protected content.

---

## 🌐 Pages

| URL                                      | Description       |
|------------------------------------------|-------------------|
| `https://localhost:8443`                 | Home              |
| `https://localhost:8443/login`           | Login / Register  |
| `https://localhost:8443/profile`         | User profile      |
| `https://localhost:8443/admin/users`     | User management   |
| `https://localhost:8443/swagger`         | API docs          |

---

## 🔧 Extending

Add a new service in `docker-compose.yml`, connect it to `app-network`, and add a route in the Caddyfile:

```caddyfile
handle_path /myservice/* {
    reverse_proxy myservice:4000
}
```
