<script lang="ts">
  import { page } from "$app/stores";
</script>

<main class="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-12">
  <article class="glass-card w-full rounded-3xl p-8 shadow-2xl shadow-black/30 sm:p-12">
    <p class="text-sm uppercase tracking-[0.22em] text-trust-400">Certificate Preview</p>
    <h1 class="mt-3 text-3xl font-semibold">Certificado publico</h1>

    <dl class="mt-8 grid gap-4 text-sm text-slate-200">
      <div class="rounded-xl border border-slate-500/30 bg-slate-950/40 p-4">
        <dt class="text-slate-400">Certificate ID</dt>
        <dd class="mt-1 break-all font-mono">{$page.params.id ?? "pending"}</dd>
      </div>
      <div class="rounded-xl border border-slate-500/30 bg-slate-950/40 p-4">
        <dt class="text-slate-400">Hash</dt>
        <dd class="mt-1 font-mono text-xs sm:text-sm">to-be-generated</dd>
      </div>
      <div class="rounded-xl border border-slate-500/30 bg-slate-950/40 p-4">
        <dt class="text-slate-400">Timestamp</dt>
        <dd class="mt-1">to-be-generated</dd>
      </div>
    </dl>
  </article>
</main>
