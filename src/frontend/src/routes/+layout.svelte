<svelte:options runes={false} />

<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import { page } from "$app/stores";
  import { copy, languageFlags, languageLabels } from "$lib/i18n";
  import {
    initializePreferences,
    language,
    resolvedTheme,
    setLanguage,
    toggleTheme
  } from "$lib/preferences";

  let languageMenuOpen = false;
  let hackathonBanner = "";

  onMount(async () => {
    initializePreferences();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"}/api/public-config`);
      if (response.ok) {
        const payload = (await response.json()) as { ui?: { hackathonBanner?: string } };
        hackathonBanner = payload.ui?.hackathonBanner ?? "";
      }
    } catch {
      hackathonBanner = "";
    }
  });

  function handleLanguageSelection(next: "es" | "en"): void {
    setLanguage(next);
    languageMenuOpen = false;
  }

  function toggleLanguageMenu(): void {
    languageMenuOpen = !languageMenuOpen;
  }

  $: t = copy[$language];
  $: homeActive = $page.url.pathname === "/";
  $: processActive = $page.url.pathname.startsWith("/process");
  $: aboutActive = $page.url.pathname.startsWith("/about");
  $: faqActive = $page.url.pathname.startsWith("/faq");
  $: activeBanner = hackathonBanner || t.hackathonBanner;

  $: if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", $language);
    document.documentElement.setAttribute("data-theme", $resolvedTheme);
  }
</script>

<svelte:head>
  <meta name="theme-color" content={$resolvedTheme === "dark" ? "#05070f" : "#f6f7fb"} />
</svelte:head>

<a class="skip-link" href="#main-content">{t.skipToContent}</a>

<div class="page-shell">
  <header class="top-banner">
    <div class="top-banner-inner">{activeBanner}</div>
  </header>

  <header class="site-header">
    <div class="site-header-inner">
      <a class="brand" href="/">
        <span class="brand-mark">⬢</span>
        <span>DOCCUM</span>
      </a>

      <nav class="main-nav" aria-label="Main navigation">
        <a class={homeActive ? "active" : ""} href="/">{t.navHome}</a>
        <a class={processActive ? "active" : ""} href="/process">{t.navProcess}</a>
        <a class={aboutActive ? "active" : ""} href="/about">{t.navAbout}</a>
        <a class={faqActive ? "active" : ""} href="/faq">{t.navFaq}</a>
      </nav>

      <div class="actions">
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

        <a class="btn btn-outline" href="/contact">{t.navContact}</a>
      </div>
    </div>
  </header>

  <main id="main-content" class="content-wrap">
    <slot />
  </main>

  <footer class="site-footer">
    <div class="footer-grid">
      <section>
        <h2 class="footer-brand">DOCCUM</h2>
        <p>{t.footerIntro}</p>
      </section>

      <section>
        <h3>{t.footerSectionProduct}</h3>
        <a href="/">{t.footerLinkHome}</a>
        <a href="/process">{t.footerLinkProcess}</a>
        <a href="/about">{t.footerLinkAbout}</a>
      </section>

      <section>
        <h3>{t.footerSectionResources}</h3>
        <a href="/help">{t.footerLinkHelp}</a>
        <a href="/faq">{t.footerLinkFaq}</a>
        <a href="/contact">{t.footerLinkContact}</a>
      </section>

      <section>
        <h3><a class="footer-heading-link" href="/legal">{t.footerSectionLegal}</a></h3>
        <a href="/privacy">{t.footerLinkPrivacy}</a>
        <a href="/terms">{t.footerLinkTerms}</a>
      </section>
    </div>

    <div class="footer-bottom">
      <span>{t.footerCopyright}</span>

      <div class="footer-social">
        <button class="footer-icon-btn" type="button" aria-label={t.themeToggleAria} on:click={toggleTheme}>
          {#if $resolvedTheme === "dark"}
            <span aria-hidden="true">☀</span>
          {:else}
            <span aria-hidden="true">☾</span>
          {/if}
        </button>
        <a
          href="https://github.com/"
          rel="noreferrer"
          target="_blank"
          aria-label="GitHub"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.33.72-4.03-1.42-4.03-1.42-.55-1.4-1.33-1.78-1.33-1.78-1.08-.74.08-.72.08-.72 1.2.08 1.82 1.23 1.82 1.23 1.06 1.82 2.78 1.3 3.46 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.2 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.67.25 2.9.13 3.2.76.84 1.22 1.91 1.22 3.22 0 4.6-2.81 5.62-5.49 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .5z" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</div>
