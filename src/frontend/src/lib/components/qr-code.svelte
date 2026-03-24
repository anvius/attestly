
<script lang="ts">
  import { onMount } from "svelte";
  import QRCode from "qrcode";

  export let value: string;
  let dataUrl = "";
  let fallbackUrl = "";
  let previousValue = "";

  async function rebuildQr(): Promise<void> {
    if (!value) {
      dataUrl = "";
      fallbackUrl = "";
      return;
    }

    try {
      dataUrl = await QRCode.toDataURL(value, {
        margin: 1,
        width: 220,
        color: {
          dark: "#0b1117",
          light: "#ffffff"
        }
      });
      fallbackUrl = "";
    } catch {
      dataUrl = "";
      fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(value)}`;
    }
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
{:else if fallbackUrl}
  <img class="h-44 w-44 rounded-xl bg-white p-2" src={fallbackUrl} alt="QR code for the certificate URL" width="176" height="176" loading="lazy" />
{:else}
  <div class="h-44 w-44 rounded-xl border p-2 text-center text-xs" style="border-color: var(--border); color: var(--muted);">Preparing QR...</div>
{/if}
