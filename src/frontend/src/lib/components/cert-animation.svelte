<script lang="ts">
  import { onMount } from "svelte";
  import { copy } from "$lib/i18n";
  import { language } from "$lib/preferences";

  let currentTick = $state(0);
  let animationTimer: any = null;
  let t = $derived(copy[$language]);

  function startAnimation() {
    if (animationTimer) return;
    
    currentTick = 1;

    animationTimer = setInterval(() => {
      currentTick += 1;
      
      if (currentTick > 15) { 
        clearInterval(animationTimer);
        animationTimer = null;
        currentTick = 0; 
      }
    }, 300);
  }

  onMount(() => {
    return () => clearInterval(animationTimer);
  });

  const stepsInfo = [
    { label: { es: "Selección", en: "Selection" } },
    { label: { es: "Hashed", en: "Hashed" } },
    { label: { es: "Sellado UTC", en: "UTC Sealed" } },
    { label: { es: "Certificado", en: "Certified" } }
  ];

  /* 
   * Lógica de Ticks en Secuencia:
  */
  const isItemActive = (i: number) => currentTick === i * 3;
  const isItemCompleted = (i: number) => currentTick > i * 3;
  const isLineIlluminating = (i: number) => currentTick >= (i * 3) + 2;
  const isItemPending = (i: number) => currentTick < i * 3;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="animation-container" aria-hidden="true" onmouseenter={startAnimation}>
  <div class="track-layout">
    {#each stepsInfo as step, i}
      <div 
        class="card-wrapper"
        class:is-active={isItemActive(i)}
        class:is-completed={isItemCompleted(i)}
        class:is-pending={isItemPending(i)}
      >
        <!-- The Notification Tick -->
        <div class="bubble-tick">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <!-- The Icon -->
        <div class="card-icon">
          {#if i === 0}
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 4H10a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V10z"/>
              <polyline points="19 4 19 10 25 10"/>
              <line x1="21" y1="16" x2="11" y2="16"/>
              <line x1="21" y1="21" x2="11" y2="21"/>
            </svg>
          {:else if i === 1}
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="4" width="8" height="8" rx="1"/>
              <rect x="20" y="4" width="8" height="8" rx="1"/>
              <rect x="4" y="20" width="8" height="8" rx="1"/>
              <rect x="20" y="20" width="8" height="8" rx="1"/>
              <line x1="12" y1="8" x2="20" y2="8"/>
              <line x1="12" y1="24" x2="20" y2="24"/>
              <line x1="8" y1="12" x2="8" y2="20"/>
              <line x1="24" y1="12" x2="24" y2="20"/>
            </svg>
          {:else if i === 2}
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="6" y="15" width="20" height="12" rx="2"/>
              <path d="M10 15V11a6 6 0 0 1 12 0v4"/>
              <circle cx="16" cy="21" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          {:else}
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 28s10-5 10-13V8l-10-4-10 4v7c0 8 10 13 10 13z"/>
              <polyline points="11 16 14 19 21 12"/>
            </svg>
          {/if}
        </div>

        <div class="card-label">
          {step.label[$language] || step.label.en}
        </div>
      </div>
      
      {#if i < 3}
        <div class="connector-line">
          <div class="connector-fill" class:line-illuminated={isLineIlluminating(i)}></div>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .animation-container {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 3rem 1.5rem;
    margin: 2.5rem auto;
    width: 100%;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    /* Prevent overflow on small screens from breaking the layout */
    overflow-x: auto; 
  }

  .track-layout {
    display: flex;
    align-items: center; 
    justify-content: center;
    gap: 8px;
    min-width: max-content;
  }  /* ---------- THE CARD (2/3 Vertical) ---------- */
  .card-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* Aspect ratio 2/3 */
    width: 60px;
    height: 90px;
    border-radius: 12px;
    border: 2px solid var(--border);
    background: var(--surface);
    gap: 8px; /* reduced gap */
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 2; 
  }

  .card-icon {
    width: 24px;
    height: 24px;
    color: var(--muted);
    transition: all 0.5s ease;
  }
  
  .card-label {
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
    text-align: center;
    transition: all 0.5s ease;
  }

  /* ---------- THE NOTIFICATION BUBBLE TICK ---------- */
  .bubble-tick {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 22px;
    height: 22px;
    background: var(--surface-soft);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--surface);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    z-index: 10;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .bubble-tick svg {
    width: 12px;
    height: 12px;
    stroke: var(--muted);
    transition: stroke 0.4s ease;
  }

  /* ---------- STATES ---------- */

  /* 1. Pending */
  .is-pending {
    opacity: 0.5;
    background: var(--surface-soft);
    transform: scale(0.96);
  }

  /* 2. Active */
  .is-active {
    border-color: var(--accent);
    transform: scale(1.08);
    background: var(--surface);
    z-index: 5;
    animation: activeGlow 1.4s infinite alternate ease-in-out;
  }
  .is-active .card-icon {
    color: var(--accent);
    transform: translateY(-4px); 
  }
  .is-active .card-label {
    color: var(--text);
  }

  /* 3. Completed */
  .is-completed {
    border-color: var(--ok);
    transform: scale(1.02);
    box-shadow: 0 6px 14px color-mix(in srgb, var(--ok) 15%, transparent);
  }
  .is-completed .card-icon {
    color: var(--ok);
  }
  .is-completed .card-label {
    color: var(--text);
  }
  .is-completed .bubble-tick {
    background: var(--ok);
    box-shadow: 0 4px 10px color-mix(in srgb, var(--ok) 40%, transparent);
    animation: tickColorPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .is-completed .bubble-tick svg {
    stroke: white;
  }

  /* ---------- CONNECTOR LINES ---------- */
  .connector-line {
    width: 24px; /* Reduced to fit mobile */
    height: 3px;
    background: var(--surface-soft);
    border-radius: 2px;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .connector-fill {
    position: absolute;
    inset: 0;
    background: var(--ok);
    transition: width 0.85s linear;
    width: 0%; 
  }

  .line-illuminated {
    width: 100%;
    box-shadow: 0 0 10px color-mix(in srgb, var(--ok) 80%, transparent);
  }

  /* ---------- KEYFRAMES ---------- */
  @keyframes activeGlow {
    0% { 
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 30%, transparent);
    }
    100% { 
      box-shadow: 0 0 0 8px color-mix(in srgb, var(--accent) 0%, transparent), 
                  0 8px 18px color-mix(in srgb, var(--accent) 25%, transparent); 
    }
  }

  @keyframes tickColorPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3) rotate(10deg); }
    100% { transform: scale(1) rotate(0); }
  }

  /* Desktop layout tweaks */
  @media (min-width: 640px) {
    .card-wrapper {
      width: 80px;
      height: 120px;
      gap: 12px;
      border-radius: 16px;
    }
    .card-icon { width: 36px; height: 36px; }
    .card-label { font-size: 12px; }
    .connector-line { width: 44px; height: 4px; }
    .bubble-tick {
      width: 26px;
      height: 26px;
      top: -10px;
      right: -10px;
    }
  }
  @media (min-width: 980px) {
    .card-wrapper {
      width: 100px;
      height: 150px;
      border-radius: 18px;
      gap: 16px;
    }
    .card-icon { width: 44px; height: 44px; }
    .card-label { font-size: 14px; }
    .connector-line { width: 70px; height: 4px; }
    .bubble-tick {
      width: 32px;
      height: 32px;
      top: -12px;
      right: -12px;
      border-width: 3px;
    }
    .bubble-tick svg { width: 16px; height: 16px; }
  }
</style>
