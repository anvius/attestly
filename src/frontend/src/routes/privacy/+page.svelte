<svelte:options runes={false} />

<script lang="ts">
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";

  $: t = copy[$language];
</script>

<svelte:head>
  <title>{t.privacyPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    {#if $language === "es"}
      <h1>Privacidad</h1>
      <p>
        Doccum aplica minimizacion de datos: no persiste el contenido original del archivo y limita la retencion de
        metadatos a lo estrictamente necesario para verificacion.
      </p>
      <p>
        Para solicitudes sobre datos personales o ejercicio de derechos, utiliza el formulario de contacto oficial.
      </p>
    {:else}
      <h1>Privacy</h1>
      <p>
        Doccum follows data minimization: it does not persist original file content and keeps metadata only when
        strictly required for verification.
      </p>
      <p>
        For personal data requests or rights exercise, please use the official contact form.
      </p>
    {/if}
  </article>
</section>
