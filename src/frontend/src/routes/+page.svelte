<svelte:options runes={false} />

<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { certifyFile, getPublicConfig } from "$lib/api";
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";

  let selectedFile: File | null = null;
  let imagePreviewUrl = "";
  let dragging = false;
  let loading = false;
  let status = "";
  let error = "";
  let maxUploadBytes = 25 * 1024 * 1024;
  let fileInput: HTMLInputElement | null = null;
  let inputFiles: FileList | null = null;

  $: t = copy[$language];
  $: isImage = selectedFile?.type.startsWith("image/") ?? false;

  function setSelectedFile(file: File | null): void {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      imagePreviewUrl = "";
    }

    selectedFile = file;

    if (file && file.type.startsWith("image/")) {
      imagePreviewUrl = URL.createObjectURL(file);
    }
  }

  async function submitCertification(): Promise<void> {
    if (!selectedFile) {
      return;
    }

    try {
      error = "";
      loading = true;
      status = t.loading;

      const result = await certifyFile(selectedFile);

      status = t.success;
      await goto(`/cert/${result.id}`);
    } catch {
      error = t.error;
      status = "";
    } finally {
      loading = false;
    }
  }

  function applyFiles(files: FileList | null): void {
    if (!files || files.length === 0) {
      return;
    }

    if (files.length > 1) {
      error = t.onlyOneFileError;
      return;
    }

    const file = files[0] ?? null;
    if (!file) {
      return;
    }

    if (file.size > maxUploadBytes) {
      error = t.fileTooLargeError;
      return;
    }

    setSelectedFile(file);
    error = "";
  }

  function onDrop(event: DragEvent): void {
    event.preventDefault();
    dragging = false;
    applyFiles(event.dataTransfer?.files ?? null);
  }

  function onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input?.files || input.files.length === 0) {
      setSelectedFile(null);
      return;
    }

    applyFiles(input.files);
  }

  function triggerFilePicker(): void {
    if (typeof document === "undefined") {
      return;
    }

    fileInput?.click();
  }

  function onDropZoneKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      triggerFilePicker();
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const units = ["KB", "MB", "GB", "TB"];
    let value = bytes / 1024;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`;
  }

  onMount(() => {
    void getPublicConfig()
      .then((config) => {
        maxUploadBytes = config.certification.maxUploadBytes;
      })
      .catch(() => {
        maxUploadBytes = 25 * 1024 * 1024;
      });
  });

  $: if (inputFiles && inputFiles.length > 0) {
    applyFiles(inputFiles);
    inputFiles = null;
  }

  $: canSubmit = selectedFile !== null && !loading;
</script>

<svelte:head>
  <title>{t.homeTitle}</title>
</svelte:head>

<section class="hero-wrap">
  <div class="hero-copy">
    <span class="eyebrow">{t.heroEyebrow}</span>
    <h1>{t.heroTitle}</h1>
    <p>{t.heroSubtitle}</p>
    <p class="hint hint-strong">{t.heroDropGlobalHint}</p>

    <article class="demo-card" aria-label={t.demoTitle}>
      <h2>{t.demoTitle}</h2>
      <div class="demo-steps">
        <p>{t.demoStep1}</p>
        <p>{t.demoStep2}</p>
        <p>{t.demoStep3}</p>
      </div>
      <p class="hint">
        {#if $language === "es"}
          Flujo real: hash SHA256 -> sello temporal UTC -> enlace verificable con QR.
        {:else}
          Real flow: SHA256 hash -> UTC timestamp -> verifiable URL with QR.
        {/if}
      </p>
    </article>
  </div>

  <div
    role="button"
    tabindex="0"
    aria-label={t.dropZoneAria}
    aria-describedby="dropzone-kbd-hint"
    class={`upload-card ${dragging ? "upload-card-dragging" : ""}`}
    on:dragover|preventDefault={() => (dragging = true)}
    on:dragleave={() => (dragging = false)}
    on:drop={onDrop}
    on:keydown={onDropZoneKeyDown}
  >
    <h2>{t.uploadTitle}</h2>
    <p class="hint">{t.uploadHint}</p>
    <p class="hint">{t.uploadTypes}</p>
    <p id="dropzone-kbd-hint" class="sr-only">{t.dropZoneKeyboardHint}</p>

    <button class="btn btn-solid" type="button" on:click={triggerFilePicker}>{t.selectFile}</button>
    <input
      bind:this={fileInput}
      bind:files={inputFiles}
      id="certificate-file"
      class="sr-only"
      type="file"
      name="certificate-file"
      on:input={onFileInputChange}
      on:change={onFileInputChange}
    />

    {#if selectedFile}
      <div class="file-meta">
        <span class={`file-badge ${isImage ? "file-badge-image" : "file-badge-doc"}`}>
          {isImage ? t.fileBadgeImage : t.fileBadgeDocument}
        </span>
        <p><strong>{t.fileNameLabel}:</strong> {selectedFile.name}</p>
        <p><strong>{t.fileTypeLabel}:</strong> {selectedFile.type || "application/octet-stream"}</p>
        <p><strong>{t.fileSizeLabel}:</strong> {formatBytes(selectedFile.size)}</p>
      </div>

      {#if isImage && imagePreviewUrl}
        <div class="image-preview-wrap">
          <p class="hint"><strong>{t.filePreviewLabel}</strong></p>
          <img src={imagePreviewUrl} alt={selectedFile.name} class="image-preview" width="420" height="220" />
        </div>
      {/if}

      <p class="hint">{t.fileOnlyPolicy}</p>
    {/if}

    <button class="btn btn-solid certify-button" type="button" on:click={submitCertification} disabled={!canSubmit}>
      {#if loading}
        {t.loading}
      {:else}
        {t.certify}
      {/if}
    </button>

    {#if status}
      <p aria-live="polite" class="status-ok">{status}</p>
    {/if}
    {#if error}
      <p aria-live="polite" class="status-error">{error}</p>
    {/if}
  </div>
</section>
