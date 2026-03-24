<script lang="ts">
  import { language, ownerData, brandedT } from "$lib/preferences";

  $: t = $brandedT;
  $: owner = $ownerData;
</script>

<svelte:head>
  <title>{t.legalPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    {#if $language === "es"}
      <h1>Aviso Legal (LSSI-CE)</h1>
      <p>
        En cumplimiento con el deber de información recogido en el artículo 10 de la Ley
        34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio
        Electrónico (LSSI-CE), a continuación, se reflejan los siguientes datos generales referentes a la
        titularidad y operativa de este sitio web.
      </p>

      <h2>1. Titularidad de la Web</h2>
      <p>El responsable legal y editor de este espacio web aplicativo (DOCCUM) es:</p>
      <ul>
        <li><strong>Titular / Denominación:</strong> {owner?.legalName || "DOCCUM Hackathon Dev"}</li>
        <li><strong>NIF / DNI:</strong> {owner?.tin || "Pendiente"}</li>
        <li><strong>Domicilio Social:</strong> {owner?.address || "Pendiente"}</li>
        <li><strong>Correo electrónico:</strong> {owner?.contactEmail || "admin@doccum.example"}</li>
        <li><strong>Sitio Web principal:</strong> <a href={owner?.url}>{owner?.url || "https://example.com"}</a></li>
      </ul>

      <h2>2. Objeto de la Plataforma (Hackathon)</h2>
      <p>
        DOCCUM es una solución tecnológica desarrollada como participación de la 
        <a href="https://github.com/midudev/hackaton-cubepath-2026" target="_blank" rel="noopener">Hackathon CubePath 2026</a>.
        Su propósito exclusivo es certificar la existencia y el estado inmutable de archivos
        de los usuarios que acceden al sistema, haciendo uso paralelo del oráculo público
        y los <em>timestamps</em> de <strong>cubepath.com</strong>, que actúan como sello
        criptográfico temporal e inalterable (Trusted Time-Stamping).
      </p>
      <p>
        Dado su carácter de proyecto de Hackathon "Open Source" (código libre), la aplicación
        se encuentra en su fase experimental "MVP". Las responsabilidades operacionales están
        confinadas al ámbito de evaluación y testeo de la competición.
      </p>

      <h2>3. Condiciones de Uso y Propiedad Intelectual</h2>
      <p>
        El acceso a este portal atribuye la condición de USUARIO/A, que acepta plenamente estas
        disposiciones desde que entra en la web. El diseño, el código fuente en Svelte, su arquitectura, logos y texto (salvo indicación de librerías de terceros) están
        liberados bajo la licencia Open Source declarada en su propio repositorio (GPL-3.0-or-later).
      </p>

      <h2>4. Limitación de la Responsabilidad Técnica</h2>
      <p>
        El TITULAR ({owner?.legalName || "Titular"}) no se hace responsable de las caídas de sistema, virus, intromisiones
        ilegítimas o los usos indebidos de la firma criptográfica resultante o cualquier conflicto
        ocasionado por la pérdida/modificación del archivo subyacente del Usuario.
      </p>

      <h2>5. Jurisdicción y Competencia</h2>
      <p>
        Para la resolución de todas las controversias o cuestiones relacionadas con este sitio web,
        será de aplicación ineludible la legislación española. Las partes se eximen fuertemente
        sometiéndose a los Juzgados y Tribunales competentes según lo marca la Ley civil de España.
      </p>
    {:else}
      <h1>Legal Notice (LSSI-CE)</h1>
      <p>
        Following the informative duties specified in Article 10 of Spanish Law 34/2002, of July 11, regarding
        Society of Information Services and Electronic Commerce (LSSI-CE), the general operations and
        ownership of this digital module are outlined below.
      </p>

      <h2>1. Platform Ownership</h2>
      <p>The legal person accountable and acting editor for this app territory (DOCCUM) is:</p>
      <ul>
        <li><strong>Owner / Legal Name:</strong> {owner?.legalName || "DOCCUM Hackathon Dev"}</li>
        <li><strong>TIN / VAT ID:</strong> {owner?.tin || "Pending"}</li>
        <li><strong>Registered Office:</strong> {owner?.address || "Pending"}</li>
        <li><strong>Email Contact:</strong> {owner?.contactEmail || "admin@doccum.example"}</li>
        <li><strong>Primary Website:</strong> <a href={owner?.url}>{owner?.url || "https://example.com"}</a></li>
      </ul>

      <h2>2. Platform Object (Hackathon)</h2>
      <p>
        DOCCUM is a tech solution engineered under the wings of the 
        <a href="https://github.com/midudev/hackaton-cubepath-2026" target="_blank" rel="noopener">Hackathon CubePath 2026</a>.
        Its sole goal is to certify the persistent state of users' files bridging its logic securely
        by querying the public web-oracle APIs and timestamps of <strong>cubepath.com</strong>.
        This external sponsor acts as a cryptographic trusted time-stamping service.
      </p>
      <p>
        Due to its open-source "Hackathon" competitive nature, the app is maintained in an "MVP" or
        experimental phase. Day-to-day operational responsibilities reflect evaluation boundaries tightly tied to
        the contest.
      </p>

      <h2>3. Terms of Use and Intellectual Property</h2>
      <p>
        Accessing this gateway renders you a USER, implying the absolute acceptance of the stipulations written here.
        The overall design, the Svelte source lines, its architectural scaffold, and wording (barring third-party open packages)
        breathe under the Open Source license (GPL-3.0-or-later) stated on its host repository.
      </p>

      <h2>4. Limitations of Liability</h2>
      <p>
        The OWNER ({owner?.legalName || "Owner"}) shall not be accountable for system crashes, malicious viruses,
        unlawful tampering, or misuse tied to generated cryptographic hashes or conflicts resulting
        from users misplacing their physical file source.
      </p>

      <h2>5. Governing Law and Jurisdiction</h2>
      <p>
        To untangle any discrepancies derived from or closely related to this software interface,
        Spanish civil law shall exclusively apply. Factions subject themselves directly to the authoritative
        Spanish Courts and Tribunals.
      </p>
    {/if}
  </article>
</section>
