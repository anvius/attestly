
<script lang="ts">
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";
  import CertAnimation from "$lib/components/cert-animation.svelte";

  $: t = copy[$language];
</script>

<div class="hero-copy">
  <span class="eyebrow">{t.heroEyebrow}</span>
  <h1>{t.heroTitle}</h1>
  <p>{t.heroSubtitle}</p>
  <p class="hint hint-strong">{t.heroDropGlobalHint}</p>

  <CertAnimation />
</div>
