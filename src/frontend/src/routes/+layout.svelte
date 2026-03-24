
<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import { copy, languageFlags, languageLabels } from "$lib/i18n";
  import type { PublicConfigDto } from "$lib/api";
  import {
    initializePreferences,
    language,
    ownerData,
    brandingData,
    brandedT,
    identityData,
    resolvedTheme,
    setLanguage,
    toggleTheme
  } from "$lib/preferences";

  const goatCounterUrl = import.meta.env.VITE_GOATCOUNTER_URL as string | undefined;

  let languageMenuOpen = false;
  const easterEggES = [
    "A ver Midu, que me llamo Antonio...",
    "IA generativa: chef certificado de bugs",
    "SHA-256: el único hash que nunca hace drama",
    "printf('hola mundo'); — inmortal desde el 72"
  ];
  const easterEggEN = [
    "Hey Midu, just so you know — I'm Antonio",
    "Generative AI: certified premium bug chef",
    "SHA-256: the only hash with zero drama",
    "printf('hello world'); — immortal since '72"
  ];
  let bannerIndex = 0;
  let hackathonBanner = "";

  onMount(async () => {
    initializePreferences();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"}/api/public-config`);
      if (response.ok) {
        const payload = (await response.json()) as PublicConfigDto;
        hackathonBanner = payload.ui?.hackathonBanner ?? "";
        if (payload.owner) {
          ownerData.set(payload.owner);
        }
        if (payload.branding) {
          brandingData.set(payload.branding);
        }
        if (payload.identity) {
          identityData.set(payload.identity);
        }
      }
    } catch {
      // Ignore
    }

    setInterval(() => {
      bannerIndex = bannerIndex + 1;
    }, 5500);
  });

  function handleLanguageSelection(next: "es" | "en"): void {
    setLanguage(next);
    languageMenuOpen = false;
  }

  function toggleLanguageMenu(): void {
    languageMenuOpen = !languageMenuOpen;
  }

  $: t = $brandedT;
  $: _bannerES = hackathonBanner ? [hackathonBanner, ...easterEggES] : easterEggES;
  $: _bannerEN = hackathonBanner ? [hackathonBanner, ...easterEggEN] : easterEggEN;
  $: activeBanner =
    $language === "es"
      ? _bannerES[bannerIndex % _bannerES.length]
      : _bannerEN[bannerIndex % _bannerEN.length];

  $: if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", $language);
    document.documentElement.setAttribute("data-theme", $resolvedTheme);
  }
</script>

<svelte:head>
  <meta name="theme-color" content={$resolvedTheme === "dark" ? "#05070f" : "#f6f7fb"} />
  {#if goatCounterUrl}
    <script data-goatcounter="{goatCounterUrl}/count" async src="{goatCounterUrl}/count.js"></script>
  {/if}
</svelte:head>

<a class="skip-link" href="#main-content">{t.skipToContent}</a>

<div class="page-shell">
  <header class="top-banner">
    {#key bannerIndex}
      <div class="top-banner-inner">{activeBanner}</div>
    {/key}
  </header>

  <header class="site-header">
    <div class="site-header-inner">
      <a class="brand" href="/">
        <!-- Seal/stamp logo: a circle with a fingerprint-like checkmark, representing certification -->
        <svg class="brand-seal" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="12" stroke="#49d30f" stroke-width="2"/>
          <circle cx="14" cy="14" r="8" stroke="#49d30f" stroke-width="1.5" stroke-dasharray="3 2"/>
          <path d="M9 14l3.5 3.5 6.5-7" stroke="#49d30f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{$brandingData?.name ?? "DOCCUM"}</span>
      </a>

      <div class="main-nav"></div>

      <div class="actions" style="justify-self: end;">
        <div class="lang-wrap">
          <button class="lang-button" type="button" aria-haspopup="menu" aria-expanded={languageMenuOpen} on:click={toggleLanguageMenu}>
            <span>{languageFlags[$language]}</span>
            <span>{languageLabels[$language]}</span>
            <span aria-hidden="true">▾</span>
          </button>

          {#if languageMenuOpen}
            <div class="lang-menu" role="menu">
              <button type="button" role="menuitem" on:click={() => handleLanguageSelection("en")}>
                <span>{languageFlags.en}</span>
                <span>{languageLabels.en}</span>
              </button>
              <button type="button" role="menuitem" on:click={() => handleLanguageSelection("es")}>
                <span>{languageFlags.es}</span>
                <span>{languageLabels.es}</span>
              </button>
            </div>
          {/if}
        </div>

        <a class="btn btn-outline header-contact" href="/contact">{t.navContact}</a>
      </div>
    </div>
  </header>

  <main id="main-content" class="content-wrap">
    <slot />
  </main>

  <footer class="site-footer">
    <div class="footer-grid">
      <section>
        <a class="brand" href="/" style="font-size: 22px; margin-bottom: 8px; text-decoration: none;">
          <svg class="brand-seal" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="12" stroke="#49d30f" stroke-width="2"/>
            <circle cx="14" cy="14" r="8" stroke="#49d30f" stroke-width="1.5" stroke-dasharray="3 2"/>
            <path d="M9 14l3.5 3.5 6.5-7" stroke="#49d30f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{$brandingData?.name ?? "DOCCUM"}</span>
        </a>
        <p>{t.footerIntro || "Certificando evidencias desde la cadena de custodia al usuario"}</p>
      </section>

      <section style="text-align: right;">
        <h3>{$language === "es" ? "Recursos" : "Resources"}</h3>
        <a href="/process">{$language === "es" ? "¿Cómo es el proceso?" : "How does it work?"}</a>
        <a href="/help">{$language === "es" ? "Ayuda" : "Help"}</a>
      </section>

      <section style="text-align: right;">
        <h3>Legal</h3>
        <a href="/terms">{$language === "es" ? "Condiciones de Uso" : "Terms of Use"}</a>
        <a href="/privacy">{$language === "es" ? "Privacidad" : "Privacy"}</a>
      </section>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-text">
        <span>
          © {new Date().getFullYear()} {$brandingData?.name ?? "DOCCUM"} — {$language === 'es' ? "software libre bajo" : "open-source under"} 
          <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener" style="text-decoration: underline;">AGPL-3.0</a>. 
          {$language === 'es' ? "Obras derivadas: misma licencia." : "Derivative works: same license."}
        </span>
        <span class="made-with-love">Made with ❤️ in {$identityData?.madeInLabel ?? "Mojácar"} by <a href={$identityData?.authorUrl ?? "https://anvius.com"} target="_blank" rel="noreferrer">{$identityData?.authorName ?? "@anvius"}</a></span>
      </div>

      <div class="footer-social">
          <!-- Theme toggle -->
          <button class="footer-icon-btn" type="button" aria-label={t.themeToggleAria} on:click={toggleTheme}>
            {#if $resolvedTheme === "dark"}
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
              </svg>
            {:else}
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path>
              </svg>
            {/if}
          </button>

          <!-- GitHub -->
          <a href={$identityData?.links?.github ?? "https://github.com/anvius/hackaton-midudev-2026"} rel="noreferrer" target="_blank" title="GitHub">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.33.72-4.03-1.42-4.03-1.42-.55-1.4-1.33-1.78-1.33-1.78-1.08-.74.08-.72.08-.72 1.2.08 1.82 1.23 1.82 1.23 1.06 1.82 2.78 1.3 3.46 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.2 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.67.25 2.9.13 3.2.76.84 1.22 1.91 1.22 3.22 0 4.6-2.81 5.62-5.49 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .5z" />
            </svg>
          </a>

          <!-- Codeberg -->
          <a href={$identityData?.links?.codeberg ?? "https://codeberg.org/anvius"} rel="noreferrer" target="_blank" title="Codeberg">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
              <path d="M12 2L3 20h4l1.5-4h7l1.5 4h4L12 2z" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </a>

          <!-- Fosstodon -->
          <a href={$identityData?.links?.mastodon ?? "https://fosstodon.org/@anvius"} rel="me noreferrer" target="_blank" title="Fosstodon (Mastodon)">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" stroke="none" width="24" height="24">
              <path d="M21.327 8.566c0-4.339-2.843-5.61-2.843-5.61-1.433-.658-3.894-.935-6.451-.956h-.063c-2.557.021-5.016.298-6.45.956 0 0-2.843 1.272-2.843 5.61 0 .993-.019 2.181.012 3.441.103 4.243.778 8.425 4.701 9.463 1.809.479 3.362.579 4.612.51 2.268-.126 3.542-.809 3.542-.809l-.173-1.854s-1.503.454-3.307.354c-1.865-.102-3.837-.367-4.14-2.868.04.01.077.018.113.025 1.53.306 3.45.459 5.39.46 2.06.002 4.15-.224 5.92-.61 1.708-.372 3.664-1.258 3.868-3.923.111-1.444.137-2.903.137-4.32zM15.485 13.91V8.636c0-1.153-.393-2.103-1.173-2.835-.783-.733-1.849-1.096-3.197-1.096-1.346 0-2.411.365-3.194 1.096-.78.732-1.17 1.682-1.17 2.835V13.91h2.24V8.892c0-.792.355-1.192 1.066-1.192.71 0 1.065.399 1.065 1.192V13.91h2.239z"/>
            </svg>
          </a>
      </div>
    </div>
  </footer>
</div>
