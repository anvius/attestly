<script lang="ts">
  import { goto } from "$app/navigation";
  import { certifyFile, certifyText } from "$lib/api";

  let text = "";
  let selectedFile: File | null = null;
  let dragging = false;
  let loading = false;
  let status = "";
  let error = "";

  async function submitCertification(): Promise<void> {
    try {
      error = "";
      loading = true;
      status = "Calculating Hash...";

      const result = selectedFile
        ? await certifyFile(selectedFile)
        : await certifyText(text);

      status = "Certificate generated";
      await goto(`/cert/${result.id}`);
    } catch {
      error = "No fue posible certificar el contenido. Intenta nuevamente.";
      status = "";
    } finally {
      loading = false;
    }
  }

  function onDrop(event: DragEvent): void {
    event.preventDefault();
    dragging = false;
    const file = event.dataTransfer?.files?.[0] ?? null;
    selectedFile = file;
    text = "";
  }

  function onFileInputChange(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    selectedFile = input.files?.[0] ?? null;
    text = "";
  }

  $: canSubmit = (text.trim().length > 0 || selectedFile !== null) && !loading;
</script>

<main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
  <section class="glass-card fade-in rounded-3xl p-8 shadow-2xl shadow-black/30 sm:p-12">
    <p class="text-sm uppercase tracking-[0.25em] text-trust-400">DocCum</p>
    <h1 class="mt-4 text-4xl font-bold leading-tight sm:text-6xl">
      Certifica archivos y texto en segundos
    </h1>
    <p class="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
      Genera una prueba criptografica de existencia con hash SHA256 y timestamp UTC de servidor.
      Limpio, rapido y verificable por URL publica.
    </p>

    <div class="mt-10 grid gap-6 lg:grid-cols-2">
      <button
        type="button"
        class={`rise rounded-2xl border-2 border-dashed p-8 text-left transition ${dragging ? "border-trust-400 bg-trust-500/10" : "border-slate-400/40 bg-slate-950/30"}`}
        on:dragover|preventDefault={() => (dragging = true)}
        on:dragleave={() => (dragging = false)}
        on:drop={onDrop}
      >
        <p class="text-xs uppercase tracking-[0.24em] text-slate-400">Archivo</p>
        <p class="mt-3 text-xl font-medium">Arrastra y suelta aqui</p>
        <p class="mt-2 text-sm text-slate-300">o selecciona un archivo desde tu dispositivo</p>

        <label class="mt-5 inline-flex cursor-pointer items-center rounded-xl bg-trust-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-trust-400">
          Seleccionar archivo
          <input class="hidden" type="file" on:change={onFileInputChange} />
        </label>

        {#if selectedFile}
          <p class="mt-4 break-all rounded-lg bg-slate-900/70 px-3 py-2 text-sm text-slate-200">
            {selectedFile.name}
          </p>
        {/if}
      </button>

      <div class="rise rounded-2xl border border-slate-400/30 bg-slate-950/35 p-6">
        <p class="text-xs uppercase tracking-[0.24em] text-slate-400">Texto</p>
        <label class="mt-3 block text-sm text-slate-300" for="content-text">
          Pega aqui el contenido a certificar
        </label>
        <textarea
          id="content-text"
          class="mt-2 h-44 w-full rounded-xl border border-slate-500/40 bg-slate-900/70 p-3 text-sm text-slate-100 outline-none transition focus:border-trust-400"
          bind:value={text}
          placeholder="Escribe o pega el texto..."
          on:input={() => (selectedFile = null)}
        ></textarea>

        <button
          class="mt-4 inline-flex items-center rounded-xl bg-trust-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-trust-400 disabled:cursor-not-allowed disabled:opacity-60"
          on:click={submitCertification}
          disabled={!canSubmit}
        >
          {#if loading}
            Calculando Hash...
          {:else}
            Certificar Contenido
          {/if}
        </button>

        {#if status}
          <p class="mt-3 text-sm text-trust-400">{status}</p>
        {/if}
        {#if error}
          <p class="mt-3 text-sm text-rose-300">{error}</p>
        {/if}
      </div>
    </div>
  </section>
</main>
