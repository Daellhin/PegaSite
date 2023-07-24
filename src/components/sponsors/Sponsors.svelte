<script lang="ts">
  import SponsorCarousel from "$components/sponsors/SponsorCarousel.svelte"
  import { sponsorStore } from "$lib/stores/SponsorStore"

  $: sponsors = $sponsorStore
</script>

<div>
  <h1 class="text-2xl font-bold mb-2">Sponsors</h1>
  {#if sponsors}
    {#if sponsors.length > 0}
      <SponsorCarousel items={sponsors} loop hideIndicators />
    {:else}
      Geen sponsors gevonden
    {/if}
  {:else}
    Loading
  {/if}
</div>
