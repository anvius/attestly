<script lang="ts">
  import { copy } from "$lib/i18n";
  import { language, ownerData } from "$lib/preferences";

  $: t = copy[$language];
  $: owner = $ownerData;
</script>

<svelte:head>
  <title>{t.termsPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    {#if $language === "es"}
      <h1>Condiciones de Uso</h1>
      <p>
        El acceso y uso de la plataforma DOCCUM (en adelante, el "Servicio") implica la aceptación plena y sin reservas 
        de las presentes Condiciones Generales de Uso. DOCCUM es un proyecto experimental para certificar digitalmente 
        documentos.
      </p>

      <h2>1. Descripción del Servicio</h2>
      <p>
        DOCCUM permite a los usuarios obtener una certificación técnica de integridad para sus documentos 
        mediante el cálculo de un <em>hash SHA-256</em> y la integración con el sello temporal inmutable provisto 
        por <strong>cubepath.com</strong> (patrocinador oficial de las tecnologías de validación temporal).
        Este sistema NO almacena su documento original y no somos un servicio de custodia documental.
      </p>

      <h2>2. Uso Leal y Restricciones</h2>
      <p>
        El Usuario se compromete a no utilizar el Servicio para fines ilícitos, lesivos de los derechos e intereses de 
        terceros, o que de cualquier forma puedan dañar, inutilizar, sobrecargar, deteriorar o impedir la normal utilización 
        de los servicios propiciados por {owner?.legalName || "el Titular"}.
        No se tolerará el SPAM, la evasión de CAPTCHAS o la ingeniería inversa maléfica.
      </p>

      <h2>3. Disponibilidad y Responsabilidad</h2>
      <p>
        Por su naturaleza de proyecto "Open Source" de Hackathon, la disponibilidad del servicio no está garantizada bajo un SLA 
        estricto. Nos eximimos de responsabilidad ante interrupciones técnicas causadas por factores externos, sobrecargas o mantenimientos. 
        Tampoco garantizamos intrínsecamente la validez probatoria absoluta frente a juzgados, al depender dicho peso legal de una 
        pericial técnica integral externa al proyecto.
      </p>

      <h2>4. Protección de Datos y Privacidad</h2>
      <p>
        El tratamiento sistemático de datos personales, si lo hubiere (como el envío del formulario de contacto), 
        se rige por nuestra <a href="/privacy">Política de Privacidad</a> en cumplimiento estricto con la normativa 
        LSSI y RGPD vigente en España.
      </p>

      <h2>5. Jurisdicción</h2>
      <p>
        Estas condiciones se interpretarán según las Leyes de España, sometiéndose de forma expresa a los Tribunales en caso de controversia.
      </p>
    {:else}
      <h1>Terms of Use</h1>
      <p>
        Access to and the use of the DOCCUM platform (hereinafter, the "Service") implies full and unreserved acceptance
        of these General Conditions of Use. DOCCUM is an experimental project destined to digitally certify documents.
      </p>

      <h2>1. Service Description</h2>
      <p>
        DOCCUM allows users to obtain a technical integrity certification for their documents by calculating a 
        <em>SHA-256 hash</em> and integrating an immutable timestamp provided by <strong>cubepath.com</strong> 
        (the official sponsor for timestamp validation technologies). This system does NOT store your original document; 
        we are not a file custody service.
      </p>

      <h2>2. Fair Use and Restrictions</h2>
      <p>
        The User agrees not to use the Service for illegal purposes, prejudicial to the rights and interests of third parties, 
        or in any way that could damage, disable, overload, or impair the normal use of the services provided by 
        {owner?.legalName || "the Owner"}. Activities such as SPAM, CAPTCHA evasion, or malicious reverse engineering will not be tolerated.
      </p>

      <h2>3. Availability and Liability</h2>
      <p>
        Due to its nature as an "Open Source" Hackathon project, service availability is not heavily guaranteed under a strict SLA. 
        We disclaim liability for technical interruptions caused by external factors, overload, or maintenance. Furthermore, we 
        do not intrinsically guarantee absolute evidentiary validity in a court of law, as such legal weighting depends on comprehensive 
        technical expert witness procedures external to the project.
      </p>

      <h2>4. Data Protection and Privacy</h2>
      <p>
        The systematic processing of personal data, if any (such as using the contact form), is strictly governed by our 
        <a href="/privacy">Privacy Policy</a> in compliance with current LSSI and GDPR laws in Spain.
      </p>

      <h2>5. Governing Law</h2>
      <p>
        These conditions shall be interpreted in accordance with the Laws of Spain, expressly submitting unreservedly to its Courts in case of dispute.
      </p>
    {/if}
  </article>
</section>
