<svelte:options runes={false} />

<script lang="ts">
  import { onMount } from "svelte";
  import QrCode from "$lib/components/qr-code.svelte";
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";

  export let data: {
    certificate: {
      id: string;
      hash: string;
      timestamp: string;
      fileName: string | null;
      contentType: string | null;
      originalContentPreview: string | null;
      chainIndex: number;
      previousCertificateDigest: string;
      certificateDigest: string;
      cubepathUnixTimeCheckedAt: string | null;
      cubepathUnixTimeSourceHash: string | null;
      cubepathStatusCheckedAt: string | null;
      cubepathStatusSourceHash: string | null;
      storesFileName: boolean;
      storesOriginalContent: boolean;
    };
  };

  let copiedHash = false;
  let copiedUrl = false;
  let certUrl = "";

  $: t = copy[$language];
  $: privacyText = t.certPrivacyBlock
    .replace("{storesOriginalContent}", String(data.certificate.storesOriginalContent))
    .replace("{storesFileName}", String(data.certificate.storesFileName));

  onMount(() => {
    certUrl = window.location.href;
  });

  async function copyHash(): Promise<void> {
    await navigator.clipboard.writeText(data.certificate.hash);
    copiedHash = true;
    setTimeout(() => (copiedHash = false), 1200);
  }

  async function copyUrl(): Promise<void> {
    if (!certUrl) {
      certUrl = `${window.location.origin}/cert/${data.certificate.id}`;
    }

    await navigator.clipboard.writeText(certUrl);
    copiedUrl = true;
    setTimeout(() => (copiedUrl = false), 1200);
  }
</script>

<svelte:head>
  <title>{t.certTitle} | DocCum</title>
</svelte:head>

<section class="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
  <article class="glass-card fade-in w-full rounded-3xl p-8 shadow-2xl shadow-black/30 sm:p-12">
    <p class="txt-muted text-sm uppercase tracking-[0.22em]">{t.certPublicLabel}</p>
    <h1 class="badge-gradient mt-3 text-3xl font-semibold">{t.certTitle}</h1>

    <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
      <dl class="grid gap-4 text-sm">
        <div class="rounded-xl border p-4" style="border-color: var(--border); background: var(--surface-strong);">
          <dt class="txt-muted">{t.certId}</dt>
          <dd class="mt-1 break-all font-mono">{data.certificate.id}</dd>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--border); background: var(--surface-strong);">
          <dt class="txt-muted">{t.certHash}</dt>
          <dd class="mt-1 break-all font-mono text-xs sm:text-sm" data-testid="cert-hash">
            {data.certificate.hash}
          </dd>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--border); background: var(--surface-strong);">
          <dt class="txt-muted">{t.certChainIndex}</dt>
          <dd class="mt-1 status-number">{data.certificate.chainIndex}</dd>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--border); background: var(--surface-strong);">
          <dt class="txt-muted">{t.certDigest}</dt>
          <dd class="mt-1 break-all font-mono text-xs sm:text-sm">{data.certificate.certificateDigest}</dd>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--border); background: var(--surface-strong);">
          <dt class="txt-muted">{t.certPrevDigest}</dt>
          <dd class="mt-1 break-all font-mono text-xs sm:text-sm">{data.certificate.previousCertificateDigest}</dd>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--border); background: var(--surface-strong);">
          <dt class="txt-muted">{t.certTimestamp}</dt>
          <dd class="mt-1">{data.certificate.timestamp}</dd>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--border); background: var(--surface-strong);">
          <dt class="txt-muted">{t.certPreview}</dt>
          <dd class="mt-1 break-all">{data.certificate.originalContentPreview ?? "-"}</dd>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--border); background: var(--surface-strong);">
          <dt class="txt-muted">{t.certEvidence}</dt>
          <dd class="mt-1 text-xs leading-relaxed">
            {t.certUnixCheckedAt}: {data.certificate.cubepathUnixTimeCheckedAt ?? t.certNotAvailable}<br />
            {t.certUnixHash}: {data.certificate.cubepathUnixTimeSourceHash ?? t.certNotAvailable}<br />
            {t.certStatusCheckedAt}: {data.certificate.cubepathStatusCheckedAt ?? t.certNotAvailable}<br />
            {t.certStatusHash}: {data.certificate.cubepathStatusSourceHash ?? t.certNotAvailable}
          </dd>
        </div>
        <div class="rounded-xl border p-4 text-xs" style="border-color: color-mix(in srgb, var(--accent-b) 45%, var(--border)); background: color-mix(in srgb, var(--accent-b) 10%, var(--surface-strong));">
          {privacyText}
        </div>

        <div class="flex flex-wrap gap-3">
          <button aria-live="polite" class="btn-primary rounded-xl px-4 py-2 text-sm font-semibold" on:click={copyHash}>
            {copiedHash ? t.certCopied : t.certCopyHash}
          </button>
          <button aria-live="polite" class="btn-secondary rounded-xl px-4 py-2 text-sm" on:click={copyUrl}>
            {copiedUrl ? t.certCopied : t.certCopyUrl}
          </button>
        </div>
      </dl>

      <div class="flex items-center justify-center rounded-2xl border p-4" style="border-color: var(--border); background: var(--surface-strong);">
        <div class="space-y-3">
          <QrCode value={certUrl} />
          <p class="txt-muted max-w-44 text-center text-xs">{t.certVerifyQr}</p>
        </div>
      </div>
    </div>
  </article>
</section>
