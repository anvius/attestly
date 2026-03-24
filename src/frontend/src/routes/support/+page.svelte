
<script lang="ts">
  import { language, brandedT } from "$lib/preferences";

  $: t = $brandedT;
</script>

<svelte:head>
  <title>{t.contactPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    <h1>{t.contactTitle}</h1>
    <p>{t.contactSubtitle}</p>
    <a class="btn btn-solid" href="/contact">{t.navContact}</a>
  </article>
</section>
