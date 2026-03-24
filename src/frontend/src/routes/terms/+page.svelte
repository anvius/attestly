<svelte:options runes={false} />

<script lang="ts">
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";

  $: t = copy[$language];
</script>

<svelte:head>
  <title>{t.termsPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    {#if $language === "es"}
      <h1>Condiciones de Uso</h1>
      <p>
        Este servicio provee certificacion tecnica de integridad. No sustituye asesoramiento legal profesional ni
        garantiza por si mismo validez procesal en todas las jurisdicciones.
      </p>
      <p>
        El uso implica aceptacion de estas condiciones y de la politica de privacidad publicada.
      </p>
    {:else}
      <h1>Terms of Use</h1>
      <p>
        This service provides technical integrity certification. It does not replace professional legal advice nor
        does it guarantee procedural validity in every jurisdiction by itself.
      </p>
      <p>
        Use of this service implies acceptance of these terms and the published privacy policy.
      </p>
    {/if}
  </article>
</section>
