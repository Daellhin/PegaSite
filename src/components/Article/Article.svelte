<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Article } from "$lib/domain/Article";
  import { articleStore } from "$lib/stores/ArticleStore";
  import { authStore } from "$lib/stores/AuthStore";
  import { Carousel } from "flowbite-svelte";
  import FaChevronDown from "svelte-icons/fa/FaChevronDown.svelte";
  import FaPen from "svelte-icons/fa/FaPen.svelte";
  import FaRegCalendar from "svelte-icons/fa/FaRegCalendar.svelte";
  import FaRegTrashAlt from "svelte-icons/fa/FaRegTrashAlt.svelte";
  import FaUser from "svelte-icons/fa/FaUser.svelte";
  import Time from "svelte-time";

  export let article: Article;
  export let isPreview = false;

  async function removeArticle() {
    await articleStore.removeArticle(article);
    goto("/");
  }
</script>

<!-- Title -->
<div class="flex flex-row items-center">
  <h1 class="text-4xl font-semibold">{article.title || "Geen titel"}</h1>
  {#if !isPreview && $authStore}
    <div title="Aanpassen" class="dropdown dropdown-end ml-auto">
      <button tabindex="0" class="btn btn-ghost gap-2 normal-case">
        <div class="w-5 h-5"><FaPen /></div>
        <div class="w-4 h-4 text-gray-500"><FaChevronDown /></div>
      </button>
      <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        <li><a href="/dashboard">Aanpassen</a></li>
        <li class="flex flex-row gap-1">
          <button on:click={removeArticle} class="w-full">
            <div class="w-5 h-5"><FaRegTrashAlt /></div>
            Verwijderen
          </button>
        </li>
      </ul>
    </div>
  {/if}
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
  {@html article.content || "Geen inhoud"}
</div>

<style lang="postcss">
  @import "../../css/usercontent.postcss";

  .custom-carousel :global(img) {
    @apply h-auto w-auto max-h-[27.5rem] max-w-[27.5rem] rounded-lg my-auto;
  }
</style>
