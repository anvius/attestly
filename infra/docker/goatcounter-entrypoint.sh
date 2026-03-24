#!/bin/sh
set -e

DB="/data/goatcounter.db"

if [ ! -f "$DB" ]; then
  goatcounter db create site \
    -createdb \
    -vhost="${GOATCOUNTER_VHOST:-localhost:8080}" \
    -user.email="${GOATCOUNTER_EMAIL:-admin@doccum.com}" \
    -user.password="${GOATCOUNTER_PASSWORD:-changeme}" \
    -db "sqlite3+$DB"
fi

exec goatcounter serve \
  -listen "${GOATCOUNTER_LISTEN:-:8080}" \
  -tls none \
  -db "sqlite3+$DB" \
  -automigrate
