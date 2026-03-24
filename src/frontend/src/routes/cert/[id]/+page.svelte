<svelte:options runes={false} />

<script lang="ts">
  import QrCode from "$lib/components/qr-code.svelte";

  export let data: {
    certificate: {
      id: string;
      hash: string;
      timestamp: string;
      fileName: string | null;
      contentType: string | null;
      originalContentPreview: string | null;
    };
  };

  let copiedHash = false;
  let copiedUrl = false;
  const certUrl = typeof window !== "undefined" ? window.location.href : "";

  async function copyHash(): Promise<void> {
    await navigator.clipboard.writeText(data.certificate.hash);
    copiedHash = true;
    setTimeout(() => (copiedHash = false), 1200);
  }

  async function copyUrl(): Promise<void> {
    await navigator.clipboard.writeText(certUrl);
    copiedUrl = true;
    setTimeout(() => (copiedUrl = false), 1200);
  }
</script>

<main class="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
  <article class="glass-card fade-in w-full rounded-3xl p-8 shadow-2xl shadow-black/30 sm:p-12">
    <p class="text-sm uppercase tracking-[0.22em] text-trust-400">Public Certificate</p>
    <h1 class="mt-3 text-3xl font-semibold">Certificado de Existencia</h1>

    <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
      <dl class="grid gap-4 text-sm text-slate-200">
        <div class="rounded-xl border border-slate-500/30 bg-slate-950/45 p-4">
          <dt class="text-slate-400">Certificate ID</dt>
          <dd class="mt-1 break-all font-mono">{data.certificate.id}</dd>
        </div>
        <div class="rounded-xl border border-slate-500/30 bg-slate-950/45 p-4">
          <dt class="text-slate-400">Hash SHA256</dt>
          <dd class="mt-1 break-all font-mono text-xs sm:text-sm" data-testid="cert-hash">
            {data.certificate.hash}
          </dd>
        </div>
        <div class="rounded-xl border border-slate-500/30 bg-slate-950/45 p-4">
          <dt class="text-slate-400">Timestamp UTC</dt>
          <dd class="mt-1">{data.certificate.timestamp}</dd>
        </div>
        <div class="rounded-xl border border-slate-500/30 bg-slate-950/45 p-4">
          <dt class="text-slate-400">Preview</dt>
          <dd class="mt-1 break-all">{data.certificate.originalContentPreview ?? "-"}</dd>
        </div>

        <div class="flex flex-wrap gap-3">
          <button class="rounded-xl bg-trust-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-trust-400" on:click={copyHash}>
            {copiedHash ? "Copiado!" : "Copiar Hash"}
          </button>
          <button class="rounded-xl border border-slate-400/40 px-4 py-2 text-sm text-slate-100 hover:border-trust-400" on:click={copyUrl}>
            {copiedUrl ? "Copiado!" : "Copiar URL"}
          </button>
        </div>
      </dl>

      <div class="flex items-center justify-center rounded-2xl border border-slate-500/30 bg-slate-950/55 p-4">
        <QrCode value={certUrl} />
      </div>
    </div>
  </article>
</main>
