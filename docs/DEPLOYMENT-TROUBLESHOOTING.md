# Troubleshooting — Despliegue en Dokploy

## Error 404 — Contenedores no encontrados

### Síntomas
- `404 Not Found` en todas las URLs
- Traefik no redirige a los contenedores

### Causa probable
Las labels de Traefik en el `compose.dokploy.yaml` no alcanzan a los contenedores, o el archivo compose está mal configurado.

### Solución

1. **Verifica que el archivo compose está en la ruta correcta:**
   ```bash
   ls -la /path/to/proyecto/infra/compose.dokploy.yaml
   ```

2. **Verifica que Dokploy tiene la ruta correcta:**
   - En Dokploy → tu proyecto → pestaña **General**
   - **Compose Path** debe ser exactamente: `infra/compose.dokploy.yaml`

3. **Reconstruye el despliegue:**
   - Dokploy → tu proyecto → botón **Redeploy**
   - Espera a que el build termine (5-10 minutos)

4. **Verifica que los contenedores corren:**
   ```bash
   ssh tu-usuario@cubepath-vps
   docker ps | grep doccum
   ```
   Deberías ver 3 contenedores: `doccum-backend`, `doccum-frontend`, `doccum-analytics`

5. **Revisa los logs de Traefik:**
   ```bash
   docker logs traefik-container-name
   ```
   Busca líneas con `doccum` para ver si se registraron las rutas.

---

## Certificado SSL/TLS no carga

### Síntomas
- **SEC_E_INVALID_TOKEN** o error de certificado en el navegador
- HTTPS muestra advertencia/no seguro
- HTTP redirige pero HTTPS falla

### Causa probable
Let's Encrypt está generando el certificado. Tarda **30-60 segundos** después del primer deploy.

### Solución

1. **Espera 2-3 minutos tras el deploy:**
   - Dokploy genera el certificado automáticamente vía Let's Encrypt + ACME
   - El navegador cachea certificados viejos — borra caché:
     - Chrome: DevTools → Application → Clear storage
     - Firefox: `about:preferences` → Privacy & Security → Clear Data

2. **Verifica que el certificado se emitió:**
   ```bash
   docker logs traefik-container-name | grep -i acme
   ```
   Busca `[acme] Certificate successfully obtained` con el dominio (`doccum.com`).

3. **Revisa que los dominios están en las labels:**
   ```bash
   grep -A5 "traefik.http.routers.doccum" infra/compose.dokploy.yaml
   ```
   Debería mostrar:
   ```
   traefik.http.routers.doccum-frontend.rule=Host(`doccum.com`)
   traefik.http.routers.doccum-backend.rule=Host(`api.doccum.com`)
   traefik.http.routers.doccum-analytics.rule=Host(`stats.doccum.com`)
   ```

4. **Si los dominios apuntan bien a Dokploy:**
   - Espera otros 5 minutos
   - Reinicia Traefik manualmente:
     ```bash
     docker restart traefik-container-name
     ```

---

## VITE_API_BASE_URL no se está usando

### Síntomas
El frontend intenta conectar a `http://localhost:3000` en lugar de `https://api.doccum.com`.

### Causa
`VITE_API_BASE_URL` se bake en **build-time**, no en runtime. Si cambias la env var tras el build, no surte efecto.

### Solución

1. **En Dokploy, añade la variable ANTES de hacer deploy:**
   - Dokploy → tu proyecto → pestaña **Environment**
   - Añade: `VITE_API_BASE_URL=https://api.doccum.com`
   - Guarda

2. **Fuerza un rebuild completo:**
   - Dokploy → tu proyecto → botón **Redeploy**
   - Selecciona **Full Rebuild** (no incremental)

3. **Verifica que se bakeó:**
   - En el navegador, abre DevTools → Fuentes
   - Busca `localhost:3000` en los archivos `.js`
   - Si no aparece, la bake fue correcta

---

## Contenedor no inicia (build error)

### Síntomas
- Dokploy muestra "Build failed"
- El contenedor está en estado `Exited` o `Error`

### Solución

1. **Revisa el log de build:**
   - Dokploy → tu proyecto → pestaña **Logs**
   - Busca líneas rojas con `ERROR`

2. **Problemas comunes:**
   - **`Package not found`** → `bun install` falló. Verifica `package.json` existe en `src/backend/` y `src/frontend/`
   - **`Port already in use`** → Otro contenedor ocupa el puerto. Cambia `PORT` en `.env`
   - **`DB_PATH` inválida** → `DB_PATH=/data/doccum.db` pero `/data` no existe. Crea el volumen en compose.

3. **Reconstruye desde cero:**
   ```bash
   cd /path/to/proyecto
   git pull origin main  # asegúrate de tener los cambios
   ```
   Luego en Dokploy: **Redeploy** → **Full Rebuild**

---

## Formulario de contacto no envía emails

### Síntomas
- Form se envía (200 OK) pero no llega email
- O error `SMTP host rejected`

### Solución

1. **Verifica SMTP en config.json:**
   ```bash
   cat etc/config.json | grep -A10 "smtp"
   ```
   Debe tener:
   - `"host": "smtp.lexemas.com"`
   - `"port": 587`
   - `"secure": false` (STARTTLS)

2. **Verifica credenciales en Dokploy env vars:**
   ```
   SMTP_USERNAME=doccum@lexemas.com
   SMTP_PASSWORD=***REMOVED***
   ```
   (Sin caracteres especiales sin escapar en el formulario.)

3. **Deshabilita SMTP en desarrollo:**
   - Si no tienes servidor SMTP configurado aún, pon `DISABLE_SMTP=1` en `.env` local
   - En Dokploy, **no** añadas `DISABLE_SMTP` (deja que intente usar SMTP real)

4. **Revisa el log del contenedor backend:**
   ```bash
   docker logs doccum-backend | grep -i smtp
   ```

---

## Checklist de deploy

Antes de contactar con soporte:

- [ ] Dominio apunta a la IP de Dokploy (revisa registros DNS con `dig` o `nslookup`)
- [ ] Firewall permite puertos 80 y 443 (IPv4 y IPv6)
- [ ] `infra/compose.dokploy.yaml` existe y está en la ruta correcta
- [ ] Variables de entorno están en Dokploy (`VITE_API_BASE_URL`, `SMTP_*`, `GOATCOUNTER_*`)
- [ ] Esperaste 2-3 minutos tras el primer deploy
- [ ] Borraste caché del navegador
- [ ] Los 3 contenedores están en `Running`:
  ```bash
  docker ps | grep doccum
  ```

Para dudas más específicas, comparte:
- **URL exacta** donde se ve el error
- **Captura del navegador** (DevTools → Console)
- **Output de:**
  ```bash
  docker ps
  docker logs doccum-backend
  docker logs doccum-frontend
  docker logs traefik
  ```
