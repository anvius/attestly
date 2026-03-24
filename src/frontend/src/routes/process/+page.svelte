
<script lang="ts">
  import { language, brandedT } from "$lib/preferences";

  $: t = $brandedT;
</script>

<svelte:head>
  <title>{t.processPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    <h1>{t.processTitle}</h1>

    {#if $language === "es"}
      <p>
        DOCCUM es un sistema de certificación digital orientado a demostrar existencia e integridad de archivos en un momento
        determinado. No funciona como repositorio documental: su objetivo principal es generar evidencia técnica verificable,
        minimizando al máximo el tratamiento de datos personales y contenido sensible.
      </p>

      <h2>Flujo Completo de Certificación</h2>
      <p>
        1. Seleccionas un único archivo (documento o imagen). El archivo se procesa como bytes para que el resultado sea
        matemáticamente reproducible.
      </p>
      <p>
        2. Se calcula una huella SHA256. Esa huella representa de forma única el contenido: cualquier cambio mínimo genera
        una huella distinta.
      </p>
      <p>
        3. Se registra timestamp UTC y se incorporan referencias temporales externas para reforzar la auditabilidad del momento
        de certificación.
      </p>
      <p>
        4. El certificado se integra en una cadena de digests, enlazando cada emisión con la anterior para detectar alteraciones
        retroactivas.
      </p>
      <p>
        5. Se publica una URL de verificación y un QR. Cualquier tercero autorizado puede validar hash, fecha y trazabilidad
        sin tener acceso al archivo original.
      </p>

      <h2>Qué Guarda y Qué No Guarda</h2>
      <p>
        DOCCUM no almacena el contenido original del archivo ni su nombre completo. Se conserva un resumen seguro con tipo,
        tamaño y una pista mínima no sensible para contexto operacional.
      </p>
      <p>
        Esta decisión reduce riesgo legal y de seguridad: incluso en escenarios de incidencia, la plataforma no expone documentos
        ni material gráfico propietario.
      </p>

      <h2>Ejemplos de Uso</h2>
      <p>
        - Autoría de logotipos y piezas visuales antes de lanzamiento público.
      </p>
      <p>
        - Prueba de versión documental en procesos internos (compliance, contratación, auditoría).
      </p>
      <p>
        - Evidencia de envío/recepción de entregables entre cliente y proveedor.
      </p>
      <p>
        - Soporte probatorio preliminar en procedimientos extrajudiciales o judiciales (siempre con validación jurídica específica).
      </p>

      <h2>Cómo Verificar un Certificado</h2>
      <p>
        1. Accede a la URL pública o escanea el QR.
      </p>
      <p>
        2. Descarga el archivo original en local y calcula SHA256 con una herramienta independiente.
      </p>
      <p>
        3. Compara la huella obtenida con la huella del certificado.
      </p>
      <p>
        4. Revisa timestamp y referencia de cadena para trazabilidad histórica.
      </p>
      <p>
        Si la huella coincide, se confirma integridad del archivo respecto al certificado emitido.
      </p>

      <h2>Buenas Prácticas Operativas</h2>
      <p>
        - Certifica archivos finales, no borradores temporales.
      </p>
      <p>
        - Conserva el archivo exacto usado en certificación para futuras comprobaciones.
      </p>
      <p>
        - Documenta internamente el contexto de emisión (proyecto, versión, responsable).
      </p>
      <p>
        - Usa verificación cruzada independiente cuando el certificado vaya a emplearse en un contexto legal sensible.
      </p>
    {:else}
      <p>
        DOCCUM is a digital certification system designed to prove file existence and integrity at a specific time. It is not a
        document repository: the primary goal is to generate verifiable technical evidence while minimizing personal data and
        sensitive content processing.
      </p>

      <h2>End-to-End Certification Flow</h2>
      <p>
        1. You select a single file (document or image). The file is processed as bytes so the result is mathematically reproducible.
      </p>
      <p>
        2. A SHA256 fingerprint is computed. That fingerprint uniquely represents content: any minimal change yields a different
        result.
      </p>
      <p>
        3. UTC timestamp is recorded and external time references are attached to strengthen auditability.
      </p>
      <p>
        4. The certificate is inserted into a digest chain, linking each issuance to the previous one to make retroactive tampering
        detectable.
      </p>
      <p>
        5. A public verification URL and QR are generated. Authorized third parties can validate hash, date and traceability
        without accessing original content.
      </p>

      <h2>What Is Stored and What Is Not</h2>
      <p>
        DOCCUM does not store original file content or full file names. It keeps a safe summary with type, size and a minimal
        non-sensitive hint for operational context.
      </p>
      <p>
        This reduces legal and security risk: even in incident scenarios, the platform does not expose proprietary documents
        or visual assets.
      </p>

      <h2>Use Cases</h2>
      <p>
        - Authorship protection for logos and visual assets before public release.
      </p>
      <p>
        - Document version proof for internal compliance, contracting and audit workflows.
      </p>
      <p>
        - Delivery evidence between clients and vendors.
      </p>
      <p>
        - Preliminary evidentiary support for legal or pre-legal procedures (always with case-specific legal validation).
      </p>

      <h2>How to Verify a Certificate</h2>
      <p>
        1. Open the public URL or scan the QR.
      </p>
      <p>
        2. Download the original file locally and compute SHA256 with an independent tool.
      </p>
      <p>
        3. Compare your hash with the certificate hash.
      </p>
      <p>
        4. Review timestamp and chain reference for historical traceability.
      </p>
      <p>
        If hashes match, file integrity is confirmed against the issued certificate.
      </p>

      <h2>Operational Best Practices</h2>
      <p>
        - Certify final files, not temporary drafts.
      </p>
      <p>
        - Keep the exact certified file for future verification.
      </p>
      <p>
        - Record issuance context internally (project, version, owner).
      </p>
      <p>
        - Use independent cross-check verification when certificates are used in sensitive legal contexts.
      </p>
    {/if}
  </article>
</section>
