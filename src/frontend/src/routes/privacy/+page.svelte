<script lang="ts">
  import { copy } from "$lib/i18n";
  import { language, ownerData } from "$lib/preferences";

  $: t = copy[$language];
  $: owner = $ownerData;
</script>

<svelte:head>
  <title>{t.privacyPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    {#if $language === "es"}
      <h1>Política de Privacidad</h1>
      <p>
        DOCCUM, proyecto desarrollado y mantenido en el contexto de la Hackathon CubePath, se compromete a
        proteger drásticamente su privacidad bajo la normativa europea (Reglamento UE 2016/679 - RGPD) y la
        normativa española (LOPDGDD 3/2018).
      </p>

      <h2>1. Responsable del Tratamiento</h2>
      <ul>
        <li><strong>Identidad:</strong> {owner?.legalName || "DOCCUM Dev"}</li>
        <li><strong>NIF/CIF:</strong> {owner?.tin || "Pendiente"}</li>
        <li><strong>Dirección:</strong> {owner?.address || "Pendiente"}</li>
        <li><strong>Contacto DPO:</strong> {owner?.contactEmail || "admin@doccum.example"}</li>
      </ul>

      <h2>2. Minimización y Ausencia de Almacenamiento</h2>
      <p>
        <strong>DOCCUM procesa pero NO guarda su archivo original.</strong> Toda la carga y firmado se
        realiza extrayendo el <em>hash</em> criptográfico (SHA-256) en una memoria efímera que
        está estrictamente limitada por middleware de tamaño (evitando violaciones de seguridad).
        Una vez extraído el hash, el archivo es permanentemente destruido.
      </p>

      <h2>3. Datos Técnicos Almacenados</h2>
      <p>
        En nuestra base de datos conservamos <strong>exclusivamente</strong> los siguientes metadatos
        de manera indefinida con el único propósito de validar las certificaciones emitidas frente a
        servicios públicos y de auditoría provistos por <em>cubepath.com</em>:
      </p>
      <ul>
        <li>Dígito criptográfico (Hash SHA-256) y metadato del tamaño del fichero.</li>
        <li>Sello de tiempo (Timestamp) calculado automáticamente (UTC).</li>
        <li>Huella de tiempo cruzada de <strong>CubePath</strong> que sirvió como oráculo de tiempo inmutable.</li>
      </ul>

      <h2>4. Legitimación del Tratamiento</h2>
      <p>
        La base legal para el tratamiento de estas trazas (hashes) es el <strong>consentimiento expreso</strong> y
        el interés legítimo de prevenir el fraude (Art. 6.1.a y 6.1.f RGPD). Para el formulario de contacto, el
        tratamiento se legitima en el consentimiento explícito brindado al enviarlo.
      </p>

      <h2>5. Proveedores y Evidencias de Terceros (Cesiones de Datos)</h2>
      <p>
        DOCCUM consume la infraestructura de <strong>cubepath.com</strong> (patrocinadores del Hackathon). En su
        naturaleza de Oracle / Time-Stamper, nosotros consumimos su timestamp API pero en ningún punto exponemos
        identidad del usuario que sube el archivo, ya que actuamos íntegramente de manera técnica para capturar firmes.
        No existe transferencia de datos personales internacionales mediante la validación del hash.
      </p>

      <h2>6. Derechos de los Interesados</h2>
      <p>
        Cualquier ciudadano europeo tiene derecho al Acceso, Rectificación, Supresión, Oposición y Limitación del
        Tratamiento. Dado que el propio diseño de DOCCUM previene enlazar "identidad personal -> hash", la posibilidad de
        supresión puede ser técnica si no es posible la identificación. Contacte a {owner?.contactEmail || "admin@doccum.example"}.
      </p>
    {:else}
      <h1>Privacy Policy</h1>
      <p>
        DOCCUM, a project developed for the CubePath Hackathon, is committed to drastically protecting your
        privacy under the European regulations (EU Regulation 2016/679 - GDPR) as well as the Spanish Law
        (LOPDGDD 3/2018).
      </p>

      <h2>1. Data Controller</h2>
      <ul>
        <li><strong>Identity:</strong> {owner?.legalName || "DOCCUM Dev"}</li>
        <li><strong>TIN:</strong> {owner?.tin || "Pending"}</li>
        <li><strong>Address:</strong> {owner?.address || "Pending"}</li>
        <li><strong>DPO Contact:</strong> {owner?.contactEmail || "admin@doccum.example"}</li>
      </ul>

      <h2>2. Minimization and No Storage Approach</h2>
      <p>
        <strong>DOCCUM processes but does NOT save your original file.</strong> All uploading and signing operations
        work by extracting the cryptographic <em>hash</em> (SHA-256) in an ephemeral memory container which is strictly limited
        by software middlewares (preventing security leaks). Right after hash extraction, the file is destroyed.
      </p>

      <h2>3. Interacted Technical Data</h2>
      <p>
        Our database stores <strong>exclusively</strong> the following metadata indefinitely, with the sole purpose of validating
        the emitted certificates against public ledger logic and timestamps provided by <em>cubepath.com</em>:
      </p>
      <ul>
        <li>Cryptographic digest (SHA-256 Hash) and basic file size length.</li>
        <li>Locally generated temporal timestamp (UTC).</li>
        <li>Cross-verified timestamp digest from the <strong>CubePath</strong> network used as an immutable time oracle.</li>
      </ul>

      <h2>4. Legal Basis for Processing</h2>
      <p>
        The legal framework for processing these traces is your <strong>express consent</strong> and the legitimate interest
        to prevent fraud (Art. 6.1.a & 6.1.f GDPR). Using the contact form also bases the processing on your clear consent.
      </p>

      <h2>5. Third-Party Oracle Services</h2>
      <p>
        DOCCUM natively utilizes operations from <strong>cubepath.com</strong> (official Hackathon sponsor). As an Oracle /
        Time-Stamper, we consume their timestamp API, but we NEVER expose user identities. There is no international transfer
        of physical personal data, only hashes.
      </p>

      <h2>6. Data Subject Rights</h2>
      <p>
        European citizens maintain their rights of Access, Rectification, Deletion, Objection, and Restriction. Since DOCCUM's design
        inherently prevents linking "personal identity -> hash", the rights of deletion might be technologically blocked if you
        cannot mechanically prove identity of the hash. Contact us at {owner?.contactEmail || "admin@doccum.example"}.
      </p>
    {/if}
  </article>
</section>
