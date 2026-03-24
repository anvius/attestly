
<script lang="ts">
  import { onMount } from "svelte";
  import { getContactConfig, sendContactMessage } from "$lib/api";
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";

  let name = "";
  let email = "";
  let message = "";
  let captchaAnswer = "";
  let honeypot = "";
  let loading = false;
  let status = "";
  let error = "";

  let firstOperand: number | null = null;
  let secondOperand: number | null = null;
  let captchaToken = "";

  function generateLocalCaptcha(): void {
    firstOperand = 2 + Math.floor(Math.random() * 11);
    secondOperand = 2 + Math.floor(Math.random() * 11);
    captchaToken = "";
  }

  generateLocalCaptcha();

  async function refreshCaptcha(): Promise<void> {
    captchaAnswer = "";

    try {
      const config = await getContactConfig();
      firstOperand = config.captcha.firstOperand;
      secondOperand = config.captcha.secondOperand;
      captchaToken = config.captcha.token ?? "";
    } catch {
      generateLocalCaptcha();
    }
  }

  $: t = copy[$language];

  onMount(async () => {
    await refreshCaptcha();
  });

  function onCaptchaInput(): void {
    if (captchaAnswer === "") {
      if (error === t.contactError) error = "";
      return;
    }

    if (firstOperand === null || secondOperand === null || Number(captchaAnswer) !== firstOperand + secondOperand) {
      // Don't show error immediately on typing, let onSubmit handle it,
      // but clear previous errors if it's correct.
      return;
    }

    if (error === t.contactError) {
      error = "";
    }
  }

  async function onSubmit(): Promise<void> {
    if (firstOperand === null || secondOperand === null || Number(captchaAnswer) !== firstOperand + secondOperand) {
      status = "";
      error = t.contactError;
      return;
    }

    loading = true;
    error = "";
    status = t.contactSending;

    try {
      await sendContactMessage({
        name,
        email,
        message,
        captchaToken,
        captchaAnswer: Number(captchaAnswer),
        honeypot
      });

      status = t.contactSuccess;
      name = "";
      email = "";
      message = "";
      await refreshCaptcha();
    } catch {
      status = "";
      error = t.contactError;
      await refreshCaptcha();
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>{t.contactPageTitle}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card contact-card">
    <h1>{t.contactTitle}</h1>
    <p>{t.contactSubtitle}</p>

    <form class="contact-form" on:submit|preventDefault={onSubmit}>
      <label for="contact-name">{t.contactFormName}</label>
      <input id="contact-name" name="contact-name" type="text" autocomplete="name" required bind:value={name} />

      <label for="contact-email">{t.contactFormEmail}</label>
      <input id="contact-email" name="contact-email" type="email" autocomplete="email" required bind:value={email} />

      <label for="contact-message">{t.contactFormMessage}</label>
      <textarea id="contact-message" name="contact-message" rows="6" minlength="20" required bind:value={message}></textarea>

      <label for="contact-captcha">{t.contactCaptchaLabel}</label>
      <div class="captcha-row">
        <span class="captcha-question">{firstOperand ?? "?"} + {secondOperand ?? "?"} =</span>
        <input id="contact-captcha" name="contact-captcha" type="number" required bind:value={captchaAnswer} on:input={onCaptchaInput} />
      </div>

      <label class="sr-only" for="contact-honeypot">Do not fill this field</label>
      <input id="contact-honeypot" name="contact-honeypot" type="text" tabindex="-1" autocomplete="off" class="sr-only" bind:value={honeypot} />

      <button class="btn btn-solid" type="submit" disabled={loading}>
        {t.contactSubmit}
      </button>

      {#if status}
        <p class="status-ok" aria-live="polite">{status}</p>
      {/if}
      {#if error}
        <p class="status-error" aria-live="polite">{error}</p>
      {/if}
    </form>
  </article>
</section>
