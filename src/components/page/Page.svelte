<script lang="ts">
  import EditDropdown from "$components/EditDropdown.svelte"
  import UserContentRenderer from "$components/UserContentRenderer.svelte"
  import Carousel from "$components/carousel/Carousel.svelte"
  import type { Page } from "$lib/domain/Page"
  import { authStore } from "$lib/stores/AuthStore"

  export let isPreview = false

  export let page: Page
</script>

<!-- Title -->
<div class="flex flex-row items-center">
  <h1 class="text-4xl font-semibold">{page.title || "Geen titel"}</h1>
  {#if !isPreview && $authStore}
    <div class="ml-auto">
      <EditDropdown editUrl={`/pages/edit/${page.id}`} width="w-60">
        <li><a href="/pages/navbar">Navigatiebalk&nbsp;aanpassen</a></li>
      </EditDropdown>
    </div>
  {/if}
</div>

<!-- Carousel -->
{#await Promise.all(page.createCarouselImages()) then images}
  {#if images.length > 0}
    <div class="my-2">
      <Carousel {images} />
    </div>
  {/if}
{/await}
<UserContentRenderer content={page.content} showLinks />
