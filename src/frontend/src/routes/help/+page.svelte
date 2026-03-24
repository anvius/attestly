<svelte:options runes={false} />

<script lang="ts">
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";

  $: t = copy[$language];
</script>

<svelte:head>
  <title>{t.helpPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    {#if $language === "es"}
      <h1>Ayuda</h1>
      <p>1. Sube un archivo o sueltalo en la pagina principal.</p>
      <p>2. Pulsa certificar y espera el hash.</p>
      <p>3. Guarda el enlace y comparte el QR.</p>
      <p>Si necesitas soporte, usa la pagina de contacto.</p>
    {:else}
      <h1>Help</h1>
      <p>1. Upload a file or drop it on the home page.</p>
      <p>2. Click certify and wait for the hash.</p>
      <p>3. Save the link and share the QR.</p>
      <p>If you need support, use the contact page.</p>
    {/if}
  </article>
</section>
