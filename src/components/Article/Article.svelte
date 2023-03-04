<script lang="ts">
  import Time from "svelte-time";
  import FaRegCalendar from "svelte-icons/fa/FaRegCalendar.svelte";
  import FaUser from "svelte-icons/fa/FaUser.svelte";
  import FaPen from "svelte-icons/fa/FaPen.svelte";
  import type { Article } from "$lib/article";
  import { Carousel } from "flowbite-svelte";

  export let article: Article;
</script>

<!-- Title -->
<div class="flex flex-row items-center">
  <h1 class="text-4xl font-semibold">{article.title || "Geen titel"}</h1>
  <a class="ml-auto btn btn-ghost" href="/dashboard">
    <div class="w-5 h-5"><FaPen /></div>
  </a>
</div>

<div class="sm:flex flex-row gap-3 items-center justify">
  <!-- Article data -->
  <div class="flex flex-row gap-3 ml-1">
    <!-- Time -->
    <div class="flex flex-row gap-1 items-center">
      <div class="w-4 h-4">
        <FaRegCalendar />
      </div>
      <Time class="opacity-60 text-md" timestamp={article.timestamp} />
    </div>
    <!-- Metadata -->
    <div class="flex flex-row gap-1 items-center">
      <div class="w-4 h-4">
        <FaUser />
      </div>
      <span class="opacity-60 text-md">{article.author}</span>
    </div>
  </div>
  <!-- Tags -->
  <div class="flex flex-row gap-2">
    {#each article.tags as tag}
      <div class="badge badge-primary badge-lg">{tag}</div>
    {/each}
  </div>
</div>

<!-- Carousel -->
{#await Promise.all(article.createCarouselImages()) then images}
  {#if images.length > 0}
    <div class="bg-base-200 my-2 rounded-lg">
      <div class="max-w-xl mx-auto custom-carousel">
        <Carousel
          {images}
          showCaptions={false}
          showThumbs={false}
          showIndicators={images.length > 1}
          slideControls={images.length > 1}
        />
      </div>
    </div>
  {/if}
{/await}

<!-- Content -->
<div class="usercontent">
  {@html article.content || "Geen inhoud"}
</div>

<style lang="postcss">
  @import "../../css/usercontent.postcss";

  .custom-carousel :global(img) {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    border-radius: 0.5em;
  }
</style>
