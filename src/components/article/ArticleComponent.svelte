<script lang="ts">
  import { goto } from "$app/navigation"
  import EditDropdown from "$components/EditDropdown.svelte"
  import UserContentRenderer from "$components/UserContentRenderer.svelte"
  import Carousel from "$components/carousel/Carousel.svelte"
  import type { Article } from "$lib/domain/Article"
  import { articleStore } from "$lib/stores/ArticleStore"
  import { authStore } from "$lib/stores/AuthStore"
  import { faCalendar } from "@fortawesome/free-regular-svg-icons"
  import {
    faEyeSlash,
    faPenToSquare,
    faUser,
    faUsers,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"
  import Time from "svelte-time"
    import { writable } from "svelte/store"

  export let article: Article
  export let isPreview = false

  const deleteProgressStore = writable(0)

  async function removeArticle() {
    await articleStore.deleteArticle(article, deleteProgressStore)
    goto("/")
  }
</script>

<!-- Visibility -->
{#if !article.visible}
  <div class="flex items-center gap-2 underline mb-[-6px]">
    <Fa icon={faEyeSlash} class="" /> Dit artikel is niet zichtbaar!
  </div>
{/if}

<!-- Title -->
<div class="flex flex-row items-center">
  <h1 class="text-4xl font-semibold">{article.title || "Geen titel"}</h1>
  {#if !isPreview && $authStore}
    <div class="ml-auto">
      <EditDropdown
        editUrl={"/articles/edit/" + article.id}
        deleteHandler={removeArticle}
      />
    </div>
  {/if}
</div>

<!-- Metadata -->
<div class="flex flex-col gap-1">
  <div class="flex flex-row flex-wrap gap-x-3 ml-1">
    <!-- Last update -->
    {#if article.lastUpdate}
      <div class="flex flex-row gap-1 items-center" title="Laast bijgewerkt op">
        <div class="h-4">
          <Fa icon={faPenToSquare} />
        </div>
        <Time
          class="opacity-60 text-md whitespace-nowrap"
          timestamp={article.lastUpdate}
        />
      </div>
    {/if}
    <!-- Created at -->
    <div class="flex flex-row gap-1 items-center" title="Aangemaakt op">
      <div class="h-4">
        <Fa icon={faCalendar} />
      </div>
      <Time
        class="opacity-60 text-md whitespace-nowrap"
        timestamp={article.createdAt}
      />
    </div>
    <!-- Authors -->
    <div class="flex flex-row gap-1 items-center" title="Auteurs">
      <div class="h-4">
        <Fa icon={article.authors.length === 1 ? faUser : faUsers} />
      </div>
      <span class="opacity-60 text-md">{article.authors.join(", ")}</span>
    </div>
  </div>

  <!-- Tags -->
  <div class="flex flex-row gap-2">
    {#each article.tags as tag}
      <div class="badge badge-primary font-semibold badge-lg">{tag}</div>
    {/each}
  </div>
</div>

<!-- Carousel -->
{#await Promise.all(article.createCarouselImages()) then images}
  {#if images.length > 0}
    <div class="my-2">
      <Carousel {images} />
    </div>
  {/if}
{/await}

<UserContentRenderer content={article.content} showLinks />
