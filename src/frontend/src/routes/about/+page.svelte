<svelte:options runes={false} />

<script lang="ts">
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";

  $: t = copy[$language];
</script>

<svelte:head>
  <title>{t.aboutPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    {#if $language === "es"}
      <h1>Sobre Doccum</h1>
      <p>
        Doccum nace de una idea simple: dejar constancia verificable. El nombre se inspira en el latin
        <strong>documentum</strong>, que se usaba como prueba, demostracion o testimonio.
      </p>
      <p>
        Por eso no significa "doc y cum" separados: expresa una sola nocion de evidencia con contexto.
        En la practica, Doccum combina certificacion criptografica, sello temporal verificable y acceso por QR para
        que equipos legales, tecnicos y de compliance compartan una misma fuente de verdad.
      </p>
    {:else}
      <h1>About Doccum</h1>
      <p>
        Doccum starts from one idea: leave verifiable records. The name is inspired by the Latin word
        <strong>documentum</strong>, historically used as proof, demonstration, or testimony.
      </p>
      <p>
        It is not "doc" plus "cum" as separate pieces; it represents one concept of evidence with context.
        In practice, Doccum combines cryptographic certification, verifiable time evidence, and QR access so legal,
        technical, and compliance teams can work from the same source of truth.
      </p>
    {/if}
  </article>
</section>
