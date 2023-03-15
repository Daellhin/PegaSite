<script lang="ts">
  import {
    articleStore,
    paginationSize,
  } from "$lib/stores/firebase-article-store";
  import { clamp, sizeOfIncreasingFirstSequence } from "$lib/utils/utils";
  import Card from "../components/Card.svelte";
  import ArrowLeft from "../components/Icons/ArrowLeft.svelte";
  import ArrowRight from "../components/Icons/ArrowRight.svelte";

  const minArticlesOnPage = 6;
  let width = 0;
  let pages: number[] = [];
  let articleRefs: HTMLElement[] = Array(paginationSize);

  $: amountOfCardsToShow = width && calculateAmountOfCardsToShow(articleRefs);
  $: hasNextPage =
    $articleStore.length > pages.length + 1 * amountOfCardsToShow;
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
</script>

<h1 class="text-2xl font-bold mb-2">Nieuws</h1>

<div />
<!-- Articles -->
<div class="flex gap-4 flex-wrap" bind:clientWidth={width}>
  {#each $articleStore.slice(articlesOnPreviousPages, articlesOnPreviousPages + amountOfCardsToShow) as article, index}
    <div bind:this={articleRefs[index]}>
      <Card {article} />
    </div>
  {:else}
    <div>loading</div>
  {/each}
</div>

<!-- Pagiation -->
<div class="flex space-x-3 mt-3">
  <button
    class="btn btn-sm btn-outline normal-case"
    on:click={previous}
    disabled={!hasPrevPage}
  >
    <div class="mr-2 w-5 h-5">
      <ArrowLeft />
    </div>
    Vorige
  </button>
  <button
    class="btn btn-sm btn-outline normal-case"
    on:click={next}
    disabled={!hasNextPage}
  >
    Volgende
    <div class="ml-2 w-5 h-5">
      <ArrowRight />
    </div>
  </button>
</div>
