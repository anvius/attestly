<svelte:options runes={false} />

<script lang="ts">
  import { verifyFile } from "$lib/api";
  import type { VerifyResultDto } from "$lib/api";
  import { brandedT } from "$lib/preferences";

  let selectedFile: File | null = null;
  let dragging = false;
  let loading = false;
  let result: VerifyResultDto | null = null;
  let error = "";
  let fileInput: HTMLInputElement | null = null;

  $: t = $brandedT;

  function triggerFilePicker(): void {
    fileInput?.click();
  }

  function onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input?.files || input.files.length === 0) {
      return;
    }
    selectFile(input.files[0]!);
  }

  function selectFile(file: File): void {
    selectedFile = file;
    result = null;
    error = "";
  }

  function onDrop(event: DragEvent): void {
    event.preventDefault();
    dragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      selectFile(files[0]!);
    }
  }

  async function submitVerification(): Promise<void> {
    if (!selectedFile) return;

    try {
      error = "";
      loading = true;
      result = await verifyFile(selectedFile);
    } catch {
      error = "Verification failed";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>{t.verifyPageTitle}</title>
</svelte:head>

<section class="content-page">
  <div class="content-card">
    <h1>{t.verifyTitle}</h1>
    <p class="hint">{t.verifySubtitle}</p>

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="verify-dropzone"
      class:verify-dropzone-active={dragging}
      on:dragover|preventDefault={() => (dragging = true)}
      on:dragleave|preventDefault={() => (dragging = false)}
      on:drop={onDrop}
      role="region"
      aria-label={t.verifyDropZone}
    >
      <p class="dropzone-label">{t.verifyDropZone}</p>
      <p class="hint">{t.verifyDropHint}</p>
      <button class="btn btn-solid" type="button" on:click={triggerFilePicker}>
        {t.verifySelectFile}
      </button>
      <input
        bind:this={fileInput}
        class="sr-only"
        type="file"
        on:change={onFileInputChange}
      />
    </div>

    {#if selectedFile}
      <div class="file-meta">
        <span><strong>{selectedFile.name}</strong></span>
        <span class="hint">{selectedFile.type || "unknown"} — {(selectedFile.size / 1024).toFixed(1)} KB</span>
      </div>

      <button
        class="btn btn-solid certify-button"
        type="button"
        disabled={loading}
        on:click={submitVerification}
      >
        {#if loading}
          {t.verifyLoading}
        {:else}
          {t.verifyButton}
        {/if}
      </button>
    {/if}

    {#if error}
      <p class="status-error" aria-live="polite">{error}</p>
    {/if}

    {#if result}
      <div class="verify-result" class:verify-ok={result.verified} class:verify-fail={!result.verified}>
        <div class="verify-result-icon">
          {#if result.verified}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          {:else}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          {/if}
        </div>

        <h2>{result.verified ? t.verifyResultTrue : t.verifyResultFalse}</h2>
        <p>{result.verified ? t.verifyResultTrueDesc : t.verifyResultFalseDesc}</p>

        <div class="verify-hash">
          <span class="hint">{t.verifyHash}:</span>
          <code>{result.hash}</code>
        </div>

        {#if result.verified && result.certificate}
          <a class="btn btn-solid" href="/cert/{result.certificate.id}">
            {t.verifyViewCert}
          </a>
        {/if}
      </div>
    {/if}
  </div>
</section>

<style>
  .verify-dropzone {
    border: 2px dashed var(--border);
    border-radius: 14px;
    padding: 32px 20px;
    text-align: center;
    display: grid;
    gap: 8px;
    justify-items: center;
    transition: border-color 0.15s;
  }

  .verify-dropzone-active {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 5%, transparent);
  }

  .dropzone-label {
    font-size: 16px;
    font-weight: 600;
  }

  .verify-result {
    border-radius: 14px;
    padding: 20px;
    display: grid;
    gap: 8px;
    justify-items: center;
    text-align: center;
  }

  .verify-ok {
    background: color-mix(in srgb, var(--ok) 10%, transparent);
    border: 1px solid var(--ok);
  }

  .verify-fail {
    background: color-mix(in srgb, var(--error) 10%, transparent);
    border: 1px solid var(--error);
  }

  .verify-result-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .verify-ok .verify-result-icon {
    color: var(--ok);
  }

  .verify-fail .verify-result-icon {
    color: var(--error);
  }

  .verify-result h2 {
    font-size: 22px;
    margin: 0;
  }

  .verify-hash {
    display: grid;
    gap: 4px;
    width: 100%;
  }

  .verify-hash code {
    font-size: 12px;
    word-break: break-all;
    background: var(--surface-soft);
    padding: 8px;
    border-radius: 8px;
    border: 1px solid var(--border);
  }
</style>
