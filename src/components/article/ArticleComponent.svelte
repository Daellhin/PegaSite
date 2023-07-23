<script lang="ts">
  import { goto } from "$app/navigation";
  import EditDropdown from "$components/EditDropdown.svelte";
  import UserContentRenderer from "$components/UserContentRenderer.svelte";
  import type { Article } from "$lib/domain/Article";
  import { articleStore } from "$lib/stores/ArticleStore";
  import { authStore } from "$lib/stores/AuthStore";
  import { faCalendar } from "@fortawesome/free-regular-svg-icons";
  import {
    faPenToSquare,
    faUser,
    faUsers,
  } from "@fortawesome/free-solid-svg-icons";
  import { Carousel } from "flowbite-svelte";
  import Fa from "svelte-fa";
  import Time from "svelte-time";

  export let article: Article;
  export let isPreview = false;

  async function removeArticle() {
    await articleStore.deleteArticle(article);
    goto("/");
  }
</script>

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

<div class="sm:flex flex-row gap-3 items-center justify flex-wrap">
  <!-- Article data -->
  <div class="flex flex-row gap-3 ml-1">
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
      <div class="badge badge-primary badge-lg">{tag}</div>
    {/each}
  </div>
</div>

<!-- Carousel -->
{#await Promise.all(article.createCarouselImages()) then images}
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

<UserContentRenderer content={article.content} showLinks />

<style lang="postcss">
  .custom-carousel :global(img) {
    @apply h-auto w-auto max-h-[27.5rem] max-w-[27.5rem] rounded-lg my-auto;
  }
</style>
