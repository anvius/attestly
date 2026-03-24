<svelte:options runes={false} />

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

  let firstOperand = 7;
  let secondOperand = 5;

  $: t = copy[$language];

  onMount(() => {
    void getContactConfig()
      .then((config) => {
        firstOperand = config.captcha.firstOperand;
        secondOperand = config.captcha.secondOperand;
      })
      .catch(() => {
        firstOperand = 7;
        secondOperand = 5;
      });
  });

  function onCaptchaInput(): void {
    if (captchaAnswer === "") {
      if (error === t.contactError) {
        error = "";
      }
      return;
    }

    if (Number(captchaAnswer) !== firstOperand + secondOperand) {
      status = "";
      error = t.contactError;
      return;
    }

    if (error === t.contactError) {
      error = "";
    }
  }

  async function onSubmit(): Promise<void> {
    if (Number(captchaAnswer) !== firstOperand + secondOperand) {
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
        captchaAnswer: Number(captchaAnswer),
        honeypot
      });

      status = t.contactSuccess;
      name = "";
      email = "";
      message = "";
      captchaAnswer = "";
      honeypot = "";
    } catch {
      status = "";
      error = t.contactError;
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
      <textarea id="contact-message" name="contact-message" rows="6" required bind:value={message}></textarea>

      <label for="contact-captcha">{t.contactCaptchaLabel}</label>
      <div class="captcha-row">
        <span class="captcha-question">{firstOperand} + {secondOperand} =</span>
        <input id="contact-captcha" name="contact-captcha" type="number" required bind:value={captchaAnswer} on:input={onCaptchaInput} />
      </div>

      <label class="sr-only" for="contact-honeypot">Do not fill this field</label>
      <input id="contact-honeypot" name="contact-honeypot" type="text" tabindex="-1" autocomplete="off" class="sr-only" bind:value={honeypot} />

      <button class="btn btn-solid" type="button" disabled={loading} on:click={onSubmit}>
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
