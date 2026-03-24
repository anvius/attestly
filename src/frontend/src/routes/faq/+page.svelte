<svelte:options runes={false} />

<script lang="ts">
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";

  $: t = copy[$language];
</script>

<svelte:head>
  <title>{t.faqPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    {#if $language === "es"}
      <h1>FAQ</h1>
      <h2>¿Doccum guarda mi archivo?</h2>
      <p>No. Se certifica su integridad y solo se conserva evidencia tecnica minima.</p>
      <h2>¿Que tipos de archivo acepta?</h2>
      <p>Cualquier tipo, hasta el limite configurado en el sistema.</p>
      <h2>¿El certificado se puede compartir?</h2>
      <p>Si. Cada certificado tiene URL publica y codigo QR para verificacion.</p>
    {:else}
      <h1>FAQ</h1>
      <h2>Does Doccum store my file?</h2>
      <p>No. It certifies integrity and stores only minimal technical evidence.</p>
      <h2>What file types are supported?</h2>
      <p>Any file type, up to the configured system limit.</p>
      <h2>Can I share a certificate?</h2>
      <p>Yes. Every certificate includes a public URL and QR code for verification.</p>
    {/if}
  </article>
</section>
