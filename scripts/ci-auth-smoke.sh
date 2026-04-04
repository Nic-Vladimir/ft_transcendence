#!/usr/bin/env bash

set -euo pipefail

COOKIE_JAR="/tmp/ft_transcendence-auth-cookies.txt"

docker compose ps

if docker compose ps | grep -Eq 'Restarting|Exited|Created'; then
  echo "One or more containers are not healthy."
  exit 1
fi

curl -I --fail http://localhost:8080 >/dev/null
curl -k --fail https://localhost:8443/health >/dev/null
curl -k --fail https://localhost:8443/login >/dev/null

curl -k --fail -sS -c "${COOKIE_JAR}" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@admin.com","password":"adminpass"}' \
  https://localhost:8443/api/auth/login >/tmp/ft_transcendence-login.json

grep -q '"id"' /tmp/ft_transcendence-login.json

curl -k --fail -sS -b "${COOKIE_JAR}" \
  https://localhost:8443/api/auth/me >/tmp/ft_transcendence-me.json

grep -q '"email":"admin@admin.com"' /tmp/ft_transcendence-me.json

curl -k --fail -sS -b "${COOKIE_JAR}" \
  https://localhost:8443/api/auth/users >/tmp/ft_transcendence-users.json

grep -q '"role":"admin"' /tmp/ft_transcendence-users.json

curl -k --fail -sS -b "${COOKIE_JAR}" \
  https://localhost:8443/api/auth/roles >/tmp/ft_transcendence-roles.json

grep -q '"admin"' /tmp/ft_transcendence-roles.json
