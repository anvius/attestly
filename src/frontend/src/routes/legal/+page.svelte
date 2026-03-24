<svelte:options runes={false} />

<script lang="ts">
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";

  $: t = copy[$language];
</script>

<svelte:head>
  <title>{t.legalPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    <h1>{t.legalTitle}</h1>

    {#if $language === "es"}
      <p>
        Esta información legal tiene fines informativos para un entorno de certificación digital en España. No sustituye
        asesoramiento jurídico individualizado. Antes de usar DocCum en producción, se recomienda validación con asesoría
        legal especializada en protección de datos, servicios digitales y evidencia electrónica.
      </p>

      <h2>1. Finalidad del Servicio</h2>
      <p>
        DocCum permite certificar existencia e integridad de archivos mediante huella criptográfica SHA256, sello temporal UTC,
        cadena verificable y URL/QR público de comprobación. La finalidad es generar evidencia técnica, no custodiar documentación.
      </p>

      <h2>2. Marco Normativo de Referencia (España)</h2>
      <p>
        La operativa se diseña con referencia a: Reglamento (UE) 2016/679 (RGPD), Ley Orgánica 3/2018 (LOPDGDD), Ley 34/2002
        de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE) y principios generales de validez probatoria
        de evidencia electrónica en el ámbito procesal.
      </p>

      <h2>3. Datos Tratados y Minimización</h2>
      <p>
        - No se almacena el contenido original del archivo.
      </p>
      <p>
        - No se conserva el nombre completo del archivo.
      </p>
      <p>
        - Se guardan hash, timestamp, metadatos técnicos mínimos y referencias de trazabilidad.
      </p>
      <p>
        - El QR y URL pública muestran datos de verificación, no el documento original.
      </p>

      <h2>4. Base Jurídica Orientativa</h2>
      <p>
        En contextos empresariales, la base jurídica puede apoyarse en interés legítimo para proteger trazabilidad e integridad
        documental, sujeto a análisis de ponderación. En otros escenarios, puede requerirse consentimiento o ejecución contractual,
        según la naturaleza del tratamiento y rol de las partes.
      </p>

      <h2>5. Roles de Tratamiento</h2>
      <p>
        Dependiendo del caso, el cliente puede actuar como responsable del tratamiento y DocCum como encargado tecnológico de
        certificación. Debe existir acuerdo de encargo cuando aplique, con medidas técnicas y organizativas adecuadas.
      </p>

      <h2>6. Conservación y Retención</h2>
      <p>
        Los certificados y metadatos asociados se conservan durante el periodo necesario para la finalidad probatoria declarada,
        políticas internas de cumplimiento y posibles obligaciones legales. Se recomienda definir una política de retención y borrado
        por categoría de expediente.
      </p>

      <h2>7. Derechos de las Personas Interesadas</h2>
      <p>
        Se deben habilitar mecanismos para ejercer derechos de acceso, rectificación, supresión, limitación, oposición y, cuando
        proceda, portabilidad. La gestión se realiza por canal de soporte autenticado para evitar divulgaciones no autorizadas.
      </p>

      <h2>8. Seguridad y Medidas Técnicas</h2>
      <p>
        - Cifrado en tránsito (TLS) y endurecimiento de infraestructura.
      </p>
      <p>
        - Control de acceso por perfil operativo.
      </p>
      <p>
        - Registro de eventos de certificación y trazabilidad de operaciones.
      </p>
      <p>
        - Revisión periódica de vulnerabilidades y actualización de dependencias.
      </p>

      <h2>9. Uso Aceptable</h2>
      <p>
        El servicio no debe emplearse para actividades ilícitas, falsificación, manipulación fraudulenta de evidencia o carga de
        contenido que vulnere derechos de terceros. El cliente es responsable de la legitimidad del uso y del contenido certificado.
      </p>

      <h2>10. Alcance Probatorio</h2>
      <p>
        Un certificado de DocCum acredita integridad técnica respecto al hash emitido. La fuerza probatoria concreta en un proceso
        depende del contexto, cadena de custodia, pericial técnica y valoración judicial o arbitral aplicable.
      </p>

      <h2>11. Contacto y Soporte</h2>
      <p>
        Para consultas legales, incidencias o solicitudes de derechos, utiliza la página de soporte con formulario autenticado.
        No se publica email directo para reducir abuso automatizado y proteger la seguridad operativa.
      </p>

      <h2>12. Transparencia y Actualizaciones</h2>
      <p>
        Esta información puede actualizarse por cambios normativos, técnicos o de producto. Se recomienda revisar periódicamente
        esta sección antes de integrar DocCum en procesos críticos de negocio.
      </p>
    {:else}
      <p>
        This legal information is provided for informational purposes for a digital certification service in Spain. It does not
        replace individualized legal advice. Before production use, legal validation is recommended with counsel specialized in
        data protection, digital services and electronic evidence.
      </p>

      <h2>1. Service Purpose</h2>
      <p>
        DocCum certifies file existence and integrity using SHA256 fingerprint, UTC timestamp, verifiable chain, and public
        URL/QR verification endpoint. Its purpose is technical evidence generation, not document custody.
      </p>

      <h2>2. Spanish Regulatory References</h2>
      <p>
        The service is designed with reference to: GDPR (EU) 2016/679, Spanish Organic Law 3/2018 (LOPDGDD), Spanish Law 34/2002
        (LSSI-CE), and general evidentiary principles for electronic evidence in procedural contexts.
      </p>

      <h2>3. Processed Data and Minimization</h2>
      <p>
        - Original file content is not stored.
      </p>
      <p>
        - Full file names are not retained.
      </p>
      <p>
        - Hash, timestamp, minimal technical metadata and traceability references are stored.
      </p>
      <p>
        - QR and public URL expose verification data, never original documents.
      </p>

      <h2>4. Indicative Legal Basis</h2>
      <p>
        In business contexts, legal basis may rely on legitimate interest for traceability and document integrity, subject to
        balancing assessment. Other scenarios may require consent or contractual necessity depending on processing nature and roles.
      </p>

      <h2>5. Processing Roles</h2>
      <p>
        Depending on the case, customer may act as controller and DocCum as technical processor. A data processing agreement should
        be in place where applicable, including appropriate technical and organizational safeguards.
      </p>

      <h2>6. Retention and Storage Period</h2>
      <p>
        Certificates and associated metadata are retained for the period required by stated evidentiary purpose, internal compliance
        policies and potential legal obligations. Retention/deletion policy per case category is recommended.
      </p>

      <h2>7. Data Subject Rights</h2>
      <p>
        Mechanisms should exist for access, rectification, erasure, restriction, objection and, where applicable, portability.
        Requests are handled through authenticated support channels to avoid unauthorized disclosure.
      </p>

      <h2>8. Security Measures</h2>
      <p>
        - Transport encryption (TLS) and hardened infrastructure.
      </p>
      <p>
        - Role-based access control.
      </p>
      <p>
        - Certification event logging and operation traceability.
      </p>
      <p>
        - Periodic vulnerability review and dependency updates.
      </p>

      <h2>9. Acceptable Use</h2>
      <p>
        Service must not be used for unlawful activity, forgery, fraudulent evidence manipulation, or third-party rights violations.
        Customer remains responsible for lawful use and legitimacy of certified material.
      </p>

      <h2>10. Evidentiary Scope</h2>
      <p>
        A DocCum certificate proves technical integrity with respect to issued hash. Actual evidentiary weight depends on context,
        chain of custody, expert analysis, and judicial/arbitral assessment.
      </p>

      <h2>11. Contact and Support</h2>
      <p>
        For legal inquiries, incidents, or rights requests, use the support page with authenticated form. Direct email is not
        publicly listed to reduce automated abuse and protect operations.
      </p>

      <h2>12. Transparency and Updates</h2>
      <p>
        This information may be updated due to regulatory, technical, or product changes. Periodic review is recommended before
        integrating DocCum into critical business workflows.
      </p>
    {/if}
  </article>
</section>
