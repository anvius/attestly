<script lang="ts">
  import { copy } from "$lib/i18n";
  import { language, ownerData } from "$lib/preferences";

  $: t = copy[$language];
  $: owner = $ownerData;
</script>

<svelte:head>
  <title>DOCCUM | {t.footerLinkHelp || "Ayuda"}</title>
</svelte:head>

<section class="content-page">
  <article class="content-card">
    {#if $language === "es"}
      <h1>Ayuda y Sobre DOCCUM</h1>
      <p>
        <strong>DOCCUM</strong> nace en el entorno competitivo de investigación y desarrollo de la 
        <a href="https://github.com/midudev/hackaton-cubepath-2026" rel="noopener" target="_blank">Hackathon CubePath 2026</a>.
        Su propósito inicial es dotar al usuario de una manera incuestionable, rápida y segura de probar que tenía poder o posesión de una pieza
        de información en un instante exacto de tiempo. Todo de forma completamente anónima.
      </p>

      <h2>Nuestra Visión y Funcionalidad</h2>
      <p>
        En DOCCUM aplicamos la filosofía estricta de diseño regida por Domain-Driven Design (DDD) con <em>Screaming Architecture</em>.
        El latido tecnológico detrás de nuestras estampas de tiempo (timestamps) ancla los registros haciendo uso de la infraestructura inmutable de <strong>cubepath.com</strong>, otorgándole mayor autoridad externa al certificado final e impidiendo que un atacante técnico altere las fechas.
      </p>

      <h2>Preguntas Frecuentes (FAQ)</h2>
      
      <h3>¿DOCCUM guarda mi archivo original?</h3>
      <p>
        En ningún caso. Nos caracterizamos por una estricta <strong>política de privacidad por diseño</strong>. 
        El archivo de entrada se procesa en memoria volátil de forma efímera para calcularle su firma matemática
        (su Hash SHA-256) y es inmediatamente destruido tras concluir. Ningún moderador podrá jamás leer el contenido.
      </p>
      
      <h3>¿Qué tipos de archivos y de qué tamaño acepta la plataforma?</h3>
      <p>
        Aceptamos toda extensión (PDF, JPG, PNG, DOCX, ZIP, etc). Fiel a los requerimientos del 
        despliegue actual, el límite de memoria ronda los 25 MB en instalaciones base para proteger la infraestructura.
      </p>
      
      <h3>¿Cómo interactuamos con el Oráculo?</h3>
      <p>
        Al calcular la firma de tu archivo en el milisegundo exacto, emitimos una petición hacia los
        centinelas de tiempo de CubePath.com para atestiguar independientemente que el proceso ocurrió de verdad en ese instante sin posibilidad de retroactivación matemática.
      </p>

    {:else}
      <h1>Help and About DOCCUM</h1>
      <p>
        <strong>DOCCUM</strong> was born in the competitive research and development context of the 
        <a href="https://github.com/midudev/hackaton-cubepath-2026" rel="noopener" target="_blank">CubePath Hackathon 2026</a>.
        Its primary purpose is to provide the user with an unquestionable, fast, and secure way to prove possession over a piece
        of information at a very exact moment in time. All completely anonymously.
      </p>

      <h2>Our Vision and Functionality</h2>
      <p>
        Within DOCCUM we apply the strict design philosophy ruled by Domain-Driven Design (DDD) and <em>Screaming Architecture</em>.
        The technological heartbeat behind our timestamps anchors records utilizing the immutable infrastructure exposed by <strong>cubepath.com</strong>. This injects greater external authority into the final certificate and securely prevents manipulation.
      </p>

      <h2>Frequently Asked Questions (FAQ)</h2>
      
      <h3>Does DOCCUM store my original file?</h3>
      <p>
        Absolutely not. We stand aggressively by a strict <strong>privacy-by-design policy</strong>. 
        The input file is only processed in ephemeral RAM memory just enough to compute its mathematical fingerprint
        (a SHA-256 Hash) and is instantly wiped right after. No internal moderator will ever access your actual file.
      </p>

      <h3>What file types and sizes are natively supported?</h3>
      <p>
        Virtually any extension is welcome here. However, abiding by current hardware guidelines, the base software size layout stops at 25 MB to defend against heavy memory attacks.
      </p>
      
      <h3>How do we interact with the Oracle?</h3>
      <p>
        Upon forging your file's mathematical digest at the exact given millisecond, our software dispatches an outbound request directed towards CubePath.com's public timestamp oracle. This externally and independently confirms the timing.
      </p>
    {/if}
  </article>
</section>
