<script lang="ts">
  import AutoplayCarousel from "$components/carousel/AutoplayCarousel.svelte"
  import LoadingAutoplayCarousel from "$components/carousel/LoadingAutoplayCarousel.svelte"
  import { sponsorStore } from "$lib/stores/SponsorStore"

  $: items = $sponsorStore?.filter((e) => e.visible === true).map((e) =>({
    name: e.name,
    url: e.url,
    imageUrl: e.getImageUrl()
  }))

</script>

<div>
  <h1 class="text-2xl font-bold mb-2">Sponsors</h1>
  {#if items}
    {#if items.length > 0}
      <AutoplayCarousel items={items} loop />
    {:else}
      Geen sponsors gevonden
    {/if}
  {:else}
    <LoadingAutoplayCarousel loop />
  {/if}
</div>
