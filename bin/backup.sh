#!/bin/bash
set -e

# ==============================================================================
# doccum-backup.sh - Backup automatico para SQLite (DDD Simplifier)
# ==============================================================================
# Propósito: Realizar un volcado en caliente (hot-backup) de la base de datos
# SQLite de producción sin bloquear las operaciones de escritura/lectura.
#
# Uso para Cronjob (Ejecutar todos los días a las 02:00 AM):
# 0 2 * * * /ruta/absoluta/a/doccum-backup.sh >> /var/log/doccum-backup.log 2>&1
# ==============================================================================

# Variables (Ajustar rutas según el entorno de despliegue)
DB_PATH="/opt/doccum/data/doccum.db"
BACKUP_DIR="/opt/doccum/backups"
DATE_SUFFIX=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/doccum_${DATE_SUFFIX}.db"

# 1. Verificar pre-requisitos
if [ ! -f "$DB_PATH" ]; then
    echo "[$(date -Iseconds)] ERROR: Base de datos no encontrada en $DB_PATH."
    exit 1
fi

mkdir -p "$BACKUP_DIR"

# 2. Ejecutar Backup en Caliente
# Utilizamos el comando nativo de sqlite3 '.backup' que copia páginas
# garantizando consistencia atómica sin interrumpir lecturas o escrituras.
echo "[$(date -Iseconds)] Iniciando backup en $BACKUP_FILE..."

if command -v sqlite3 >/dev/null 2>&1; then
    sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"
else
    # Fallback si sqlite3 no está disponible, usando cp 
    # Asegúrate de que WAL mode u otros logs asimilen esta copia simple si no hay operaciones.
    echo "Advertencia: CLI de sqlite3 no encontrada, haciendo copia directa (cp)..."
    cp "$DB_PATH" "$BACKUP_FILE"
fi

echo "[$(date -Iseconds)] Backup completado con éxito."

# 3. Rotación de Backups (Opcional - Eliminar los mayores a 30 días)
echo "[$(date -Iseconds)] Realizando rotación (Eliminando > 30 días)..."
find "$BACKUP_DIR" -type f -name "doccum_*.db" -mtime +30 -exec rm {} \;

echo "[$(date -Iseconds)] Fin de la operación."
