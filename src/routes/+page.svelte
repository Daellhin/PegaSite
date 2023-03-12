<script lang="ts">
  import {
    articleStore,
    paginationSize,
  } from "$lib/stores/firebase-article-store";
  import Card from "../components/Card.svelte";
  import ArrowLeft from "../components/Icons/ArrowLeft.svelte";
  import ArrowRight from "../components/Icons/ArrowRight.svelte";

  let page = 0;
  $: hasNextPage = $articleStore.length > (page + 1) * paginationSize;
  $: hasPrevPage = page !== 0;

  async function next() {
    if (hasNextPage) {
      page++;
      await articleStore.loadMoreArticles();
    }
  }
  function previous() {
    if (page > 0) page--;
  }
</script>

<h1 class="text-2xl font-bold mb-2">Nieuws</h1>

<!-- Articles -->
<div class="flex gap-4 flex-wrap">
  {#each $articleStore.slice(page * paginationSize, (page + 1) * paginationSize) as article}
    <Card {article} />
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
