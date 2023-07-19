<script lang="ts">
  import CustomCarousel from "$components/sponsers/SponserCarousel.svelte";

  const images = [
    {
      name: "Naam sponser 1",
      imageUrl:
        "https://images.unsplash.com/photo-1517355428470-46eef64fc502?ixid=M3wxMTI1OHwwfDF8cmFuZG9tfHx8fHx8fHx8MTY4OTc3NTU3M3w",
      externalLink: "google.com",
    },
    {
      name: "Naam sponser 2",
      imageUrl:
        "https://images.unsplash.com/photo-1467541473380-93479a5a3ffa?ixid=M3wxMTI1OHwwfDF8cmFuZG9tfHx8fHx8fHx8MTY4OTc2MTA4Mnw",
      externalLink: "google.com",
    },
  ];
</script>

<div>
  <h1 class="text-2xl font-bold mb-2">Sponsers</h1>
  {#if images.length > 0}
    <CustomCarousel items={images} loop hideIndicators />
  {/if}
</div>
