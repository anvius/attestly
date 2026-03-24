<svelte:options runes={false} />

<script lang="ts">
  import { onMount } from "svelte";
  import QRCode from "qrcode";

  export let value: string;
  let dataUrl = "";
  let previousValue = "";

  async function rebuildQr(): Promise<void> {
    if (!value) {
      dataUrl = "";
      return;
    }

    dataUrl = await QRCode.toDataURL(value, {
      margin: 1,
      width: 220,
      color: {
        dark: "#0b1117",
        light: "#ffffff"
      }
    });
  }

  onMount(async () => {
    await rebuildQr();
  });

  $: if (value !== previousValue) {
    previousValue = value;
    void rebuildQr();
  }
</script>

{#if dataUrl}
  <img class="h-44 w-44 rounded-xl bg-white p-2" src={dataUrl} alt="QR code for the certificate URL" width="176" height="176" />
{:else}
  <div class="h-44 w-44 rounded-xl border p-2 text-center text-xs" style="border-color: var(--border); color: var(--muted);">Preparing QR...</div>
{/if}
