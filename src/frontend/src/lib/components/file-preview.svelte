<script lang="ts">
  import { formatBytes } from "$lib/utils/format";

  export let selectedFile: File;
  export let imagePreviewUrl: string;
  export let isImage: boolean;
  export let t: Record<string, string>;
</script>

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
