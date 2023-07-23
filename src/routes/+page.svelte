<script lang="ts">
  import Card from "$components/article/ArticleCard.svelte";
  import { articleStore, paginationSize } from "$lib/stores/ArticleStore";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import { clamp, sizeOfIncreasingFirstSequence } from "$lib/utils/Utils";
  import {
    faArrowLeftLong,
    faArrowRightLong,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  const minArticlesOnPage = 6;
  let width = 0;
  let pages: number[] = [];
  let articleRefs: HTMLElement[] = Array(paginationSize);

  $: amountOfCardsToShow = width && calculateAmountOfCardsToShow(articleRefs);
  $: hasNextPage = $articleStore
    ? $articleStore.length > articlesOnPreviousPages + amountOfCardsToShow
    : false;
  $: hasPrevPage = pages.length !== 0;
  $: articlesOnPreviousPages = pages.reduce((sum, a) => sum + a, 0);

  async function next() {
    if (hasNextPage) {
      pages.push(amountOfCardsToShow);
      pages = pages;
      await articleStore.loadMoreArticles();
    }
  }
  function previous() {
    if (pages.length > 0) {
      pages.pop();
      pages = pages;
    }
  }
  function calculateAmountOfCardsToShow(articleRefs: any[]) {
    const distancesFromLeft = articleRefs.map(
      (e) => e?.getBoundingClientRect().left || 0
    );
    const maxArticlesToPlaceInRow =
      sizeOfIncreasingFirstSequence(distancesFromLeft) * 2;
    return clamp(maxArticlesToPlaceInRow, minArticlesOnPage, paginationSize);
  }

  // -- Page title --
  pageHeadStore.updatePageTitle("");
</script>

<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold mb-2">Nieuws</h1>
  {#await authStore.known then _}
    {#if $authStore}
      <a class="btn btn-sm capitalize btn-primary" href="/articles/new">
        Nieuw artikel
      </a>
    {/if}
  {/await}
</div>

<!-- Articles -->
<div
  class="flex gap-4 flex-wrap justify-center sm:justify-start"
  bind:clientWidth={width}
>
  {#if $articleStore}
    {#each $articleStore.slice(articlesOnPreviousPages, articlesOnPreviousPages + amountOfCardsToShow) as article, index}
      <div bind:this={articleRefs[index]}>
        <Card {article} />
      </div>
    {:else}
      <div>Geen berichten gevonden</div>
    {/each}
  {:else}
    <div>Loading</div>
  {/if}
</div>

<!-- Pagiation -->
<div class="flex space-x-3 mt-3">
  <button
    class="btn btn-sm btn-outline normal-case items-center"
    on:click={previous}
    disabled={!hasPrevPage}
  >
    <Fa icon={faArrowLeftLong} class="mr-2 text-[16px]" />
    <span>Vorige</span>
  </button>
  <button
    class="btn btn-sm btn-outline normal-case flex items-center"
    on:click={next}
    disabled={!hasNextPage}
  >
    <span>Volgende</span>
    <Fa icon={faArrowRightLong} class="ml-2 text-[16px]" />
  </button>
</div>
