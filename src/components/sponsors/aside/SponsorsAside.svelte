<script lang="ts">
  import AutoplayCarousel from "$components/carousel/AutoplayCarousel.svelte"
  import LoadingAutoplayCarousel from "$components/carousel/LoadingAutoplayCarousel.svelte"
  import { sponsorStore } from "$lib/stores/SponsorStore"

  $: sponsors = $sponsorStore?.filter((e) => e.visible === true)
</script>

<div>
  <h1 class="text-2xl font-bold mb-2">Sponsors</h1>
  {#if sponsors}
    {#if sponsors.length > 0}
      <AutoplayCarousel items={sponsors} loop />
    {:else}
      Geen sponsors gevonden
    {/if}
  {:else}
    <LoadingAutoplayCarousel loop />
  {/if}
</div>
