<script lang="ts">
  import CustomCarousel from "$components/sponsers/SponserCarousel.svelte"
  import { sponserStore } from "$lib/stores/SponserStore"

  $: sponsers = $sponserStore
</script>

<div>
  <h1 class="text-2xl font-bold mb-2">Sponsers</h1>
  {#if sponsers}
    <CustomCarousel items={sponsers} loop hideIndicators />
  {:else}
    Loading
  {/if}
</div>
