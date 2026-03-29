
<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { certifyFile, certifyText, getCertificateCount, getLatestCertificateId, getPublicConfig } from "$lib/api";
  import { language, brandedT } from "$lib/preferences";
  import { formatBytes } from "$lib/utils/format";
  import Hero from "$lib/components/hero.svelte";
  import FilePreview from "$lib/components/file-preview.svelte";

  let selectedFile: File | null = null;
  let imagePreviewUrl = "";
  let dragging = false;
  let loading = false;
  let status = "";
  let error = "";
  let maxUploadBytes = 25 * 1024 * 1024;
  let fileInput: HTMLInputElement | null = null;
  let inputFiles: FileList | null = null;
  let activeTab: "file" | "text" = "file";
  let textInput = "";
  let certCount: number | null = null;
  let exampleCertId: string | null = null;

  $: t = $brandedT;
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

  async function submitTextCertification(): Promise<void> {
    if (!textInput.trim()) return;

    try {
      error = "";
      loading = true;
      status = t.loading;

      const result = await certifyText(textInput);

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

  function handleWindowDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.types?.includes("Files") || event.dataTransfer?.types?.includes("application/x-moz-file")) {
      dragging = true;
    }
  }

  function handleOverlayDragLeave(event: DragEvent): void {
    event.preventDefault();
    dragging = false;
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



  onMount(() => {
    void getPublicConfig()
      .then((config) => {
        maxUploadBytes = config.certification.maxUploadBytes;
      })
      .catch(() => {
        maxUploadBytes = 25 * 1024 * 1024;
      });

    void getCertificateCount()
      .then((c) => {
        certCount = c.total;
      })
      .catch(() => {});

    void getLatestCertificateId()
      .then((id) => {
        exampleCertId = id;
      })
      .catch(() => {});
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

<svelte:window on:dragover={handleWindowDragOver} />

{#if dragging}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="global-dropzone"
    on:dragleave={handleOverlayDragLeave}
    on:drop={onDrop}
    on:dragover|preventDefault
  >
    <div class="global-dropzone-content">
      <h2>{t.uploadTitle || "Suelta tu archivo aquí"}</h2>
      <p class="hint">{t.uploadHint || "Certifica arrastrando en cualquier lugar"}</p>
    </div>
  </div>
{/if}

<section class="hero-wrap">
  <Hero />

  <div
    class="upload-card"
  >
    <h2>{t.uploadTitle}</h2>
    <p class="hint">{t.uploadHint}</p>
    <p class="hint">{t.uploadTypes}</p>
    <p id="dropzone-kbd-hint" class="sr-only">{t.dropZoneKeyboardHint}</p>

    {#if certCount !== null && certCount > 0}
      <div class="cert-counter">
        <span class="cert-counter-number">{certCount.toLocaleString()}</span>
        <span class="cert-counter-label">{t.counterLabel}</span>
      </div>
    {/if}

    <div class="tab-bar" role="tablist">
      <button
        class="tab-btn"
        class:tab-active={activeTab === "file"}
        type="button"
        role="tab"
        aria-selected={activeTab === "file"}
        on:click={() => (activeTab = "file")}
      >
        {t.tabFile}
      </button>
      <button
        class="tab-btn"
        class:tab-active={activeTab === "text"}
        type="button"
        role="tab"
        aria-selected={activeTab === "text"}
        on:click={() => (activeTab = "text")}
      >
        {t.tabText}
      </button>
    </div>

    {#if activeTab === "file"}
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
        <FilePreview
          {selectedFile}
          {imagePreviewUrl}
          {isImage}
          {t}
        />
      {/if}

      {#if selectedFile}
        <button class="btn btn-solid certify-button" type="button" on:click={submitCertification} disabled={!canSubmit}>
          {#if loading}
            {t.loading}
          {:else}
            {t.certify}
          {/if}
        </button>
      {/if}
    {:else}
      <textarea
        class="text-certify-input"
        bind:value={textInput}
        placeholder={t.textPlaceholder}
        rows="6"
      ></textarea>

      <button
        class="btn btn-solid certify-button"
        type="button"
        disabled={!textInput.trim() || loading}
        on:click={submitTextCertification}
      >
        {#if loading}
          {t.loading}
        {:else}
          {t.certifyText}
        {/if}
      </button>
    {/if}

    {#if status}
      <p aria-live="polite" class="status-ok">{status}</p>
    {/if}
    {#if error}
      <p aria-live="polite" class="status-error">{error}</p>
    {/if}

    {#if exampleCertId}
      <a class="see-example-link" href="/cert/{exampleCertId}">
        {t.seeExample} →
      </a>
    {/if}
  </div>
</section>
