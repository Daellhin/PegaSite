<script lang="ts">
  import EditDropdown from "$components/EditDropdown.svelte";
  import type { Page } from "$lib/domain/Page";
  import { authStore } from "$lib/stores/AuthStore";
  import { Carousel } from "flowbite-svelte";

  export let isPreview = false;

  export let page: Page;
</script>

<!-- Title -->
<div class="flex flex-row items-center">
  <h1 class="text-4xl font-semibold">Hi {page.title || "Geen titel"}</h1>
  {#if !isPreview && $authStore}
    <div class="ml-auto">
      <EditDropdown
        editUrl={`/pages/edit/${page.id}`}
        hasDelete={false}
        width="w-60"
      >
        <li><a href="/pages/navbar">Navigatiebalk&nbsp;aanpassen</a></li>
      </EditDropdown>
    </div>
  {/if}
</div>


<!-- Carousel -->
{#await Promise.all(page.createCarouselImages()) then images}
  {#if images.length > 0}
    <div class="bg-base-200 my-2 rounded-lg">
      <div class="mx-auto custom-carousel w-fit">
        <Carousel
          divClass=""
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
  {@html page.content || "Geen inhoud"}
</div>

<style lang="postcss">
  @import "../../css/usercontent.postcss";

  .custom-carousel :global(img) {
    @apply h-auto w-auto max-h-[27.5rem] max-w-[27.5rem] rounded-lg my-auto;
  }
</style>

