<svelte:options runes={false} />

<script lang="ts">
  import { onMount } from "svelte";
  import QRCode from "qrcode";

  export let value: string;
  let dataUrl = "";

  onMount(async () => {
    dataUrl = await QRCode.toDataURL(value, {
      margin: 1,
      width: 220,
      color: {
        dark: "#0b1117",
        light: "#ffffff"
      }
    });
  });
</script>

{#if dataUrl}
  <img class="h-44 w-44 rounded-xl bg-white p-2" src={dataUrl} alt="QR del certificado" />
{/if}
