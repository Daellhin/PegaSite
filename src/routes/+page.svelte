<script lang="ts">
  import AnnouncementViewer from "$components/announcements/AnnouncementViewer.svelte"
  import Card from "$components/article/ArticleCard.svelte"
  import LoadingCard from "$components/article/LoadingCard.svelte"
  import {
    articleStore,
    globalPaginationSize,
    setGlobalPaginationSize,
  } from "$lib/stores/ArticleStore"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { clamp, sizeOfIncreasingFirstSequence } from "$lib/utils/Utils"
  import {
    faArrowLeftLong,
    faArrowRightLong,
  } from "@fortawesome/free-solid-svg-icons"
  import { onMount } from "svelte"
  import Fa from "svelte-fa"
  import { get } from "svelte/store"

  onMount(async () => {
    setGlobalPaginationSize(8)
    await articleStore.known
    if (get(articleStore).length < 8) {
      articleStore.loadMoreArticles()
    }
  })

  const minArticlesOnPage = 6
  let width = 0
  let pages: number[] = []
  let articleRefs: HTMLElement[] = Array(globalPaginationSize)

  $: visibleArticles = $articleStore?.filter((e) => e.visible) || []
  $: amountOfCardsToShow = width && calculateAmountOfCardsToShow(articleRefs)
  $: hasNextPage = visibleArticles
    ? visibleArticles.length > articlesOnPreviousPages + amountOfCardsToShow
    : false
  $: hasPrevPage = pages.length !== 0
  $: articlesOnPreviousPages = pages.reduce((sum, a) => sum + a, 0)
  $: articlesOnPage =
    visibleArticles.slice(
      articlesOnPreviousPages,
      articlesOnPreviousPages + amountOfCardsToShow,
    ) || []

  async function next() {
    if (hasNextPage) {
      pages.push(amountOfCardsToShow)
      pages = pages
      await articleStore.loadMoreArticles()
    }
  }
  function previous() {
    if (pages.length > 0) {
      pages.pop()
      pages = pages
    }
  }
  function calculateAmountOfCardsToShow(articleRefs: any[]) {
    const distancesFromLeft = articleRefs.map(
      (e) => e?.getBoundingClientRect().left || 0,
    )
    const maxArticlesToPlaceInRow =
      sizeOfIncreasingFirstSequence(distancesFromLeft) * 2
    return clamp(
      maxArticlesToPlaceInRow,
      minArticlesOnPage,
      globalPaginationSize,
    )
  }

  // -- Page title --
  pageHeadStore.updatePageTitle("")
</script>

<!-- Title -->
<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold mb-1">Nieuws</h1>
  {#await authStore.known then _}
    {#if $authStore}
      <a class="btn btn-sm btn-primary" href="/articles/new"> Nieuw artikel </a>
    {/if}
  {/await}
</div>

<!-- Announcements -->
<div class="mb-3">
  <AnnouncementViewer />
</div>

<!-- Articles or loading -->
<div
  class="flex gap-4 flex-wrap sm:justify-start justify-center"
  bind:clientWidth={width}
>
  {#each articlesOnPage as article, index}
    <div bind:this={articleRefs[index]}>
      <Card {article} />
    </div>
  {:else}
    {#each Array(globalPaginationSize) as _}
      <LoadingCard />
    {/each}
  {/each}
</div>

<!-- Pagination or error -->
{#if articlesOnPage}
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
{:else}
  <div>Geen berichten gevonden</div>
{/if}
