<script lang="ts">
  import ConfirmModal from "$components/ConfirmModal.svelte"
  import EditDropdown from "$components/EditDropdown.svelte"
  import Checkbox from "$components/formHelpers/Checkbox.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"
  import TableFooter from "$components/table/TableFooter.svelte"
  import TableHeaderRow from "$components/table/TableHeaderRow.svelte"
  import type { Article } from "$lib/domain/Article"
  import {
    articleStore,
    setGlobalPaginationSize,
  } from "$lib/stores/ArticleStore"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { faSearch } from "@fortawesome/free-solid-svg-icons"
  import { writable } from "svelte/store"

  const tooltip = "De zoekfunctie doorzoekt enkel de laatste 100 berichten."
  const confirmModalID = "confirm-delete-article"
  const paginationSize = 10
  const deleteProgressStore = writable(0)

  export let articles: Article[]

  let showModal = false
  let searchString = ""
  let saving = false
  let errorMessage = ""

  // -- Pagination --
  let page = 0
  $: previousArticles = page * paginationSize

  $: visibleArticles = articles
    ?.filter((e) => visibleFilter(e, showVisible, showHidden))
    .filter((e) => e.matchesSearchString(searchString))
    .slice(previousArticles, previousArticles + paginationSize)
  $: allArticles = articles

  $: hasNextPage = $articleStore?.length > previousArticles + paginationSize
  $: hasPreviousPage = page > 0

  function previous() {
    if (hasPreviousPage) page--
  }
  async function next() {
    if (!hasNextPage) return
    saveWrapper(async () => {
      await articleStore.loadMoreArticles()
      page++
    })
  }

  // -- Filters --
  let showHidden = true
  let showVisible = true

  function visibleFilter(
    article: Article,
    showVisible: boolean,
    showHidden: boolean,
  ) {
    if (showVisible && showHidden) return true
    if (showVisible && !showHidden) return article.visible
    if (!showVisible && showHidden) return !article.visible
    return true
  }

  // -- Edit articles --
  let articlePendingDelete: Article | undefined
  $: if (!showModal) articlePendingDelete = undefined

  async function deleteArticle() {
    if (!articlePendingDelete) return
    const article = articlePendingDelete
    saveWrapper(async () => {
      await articleStore.deleteArticle(article, deleteProgressStore)
    })
  }
  function startDelete(article: Article) {
    articlePendingDelete = article
    showModal = true
  }
  async function updateVisibility(article: Article) {
    saveWrapper(async () => {
      await articleStore.updateVisibility(article)
    })
  }

  // -- Initialisation --
  let initialised = false
  let searchInitialized = false
  $: if (!initialised && $articleStore) init()
  $: if (!searchInitialized && searchString) initSearch()

  async function init() {
    initialised = true
    setGlobalPaginationSize(10)
    if ($articleStore.length < (page + 1) * paginationSize) return
    saveWrapper(async () => {
      await articleStore.loadMoreArticles()
      articlePendingDelete = undefined
    })
  }

  // Load all articles when the search string is initialised
  async function initSearch() {
    saveWrapper(async () => {
      searchInitialized = true
      await articleStore.loadMoreArticles(100)
      articlePendingDelete = undefined
    })
  }

  // -- Util --
  async function saveWrapper(func: () => Promise<void>) {
    saving = true
    errorMessage = ""
    try {
      await func()
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
    saving = false
  }
</script>

<!-- Search -->
<div class="mt-2">
  <Input
    type="text"
    bind:value={searchString}
    placeholder="Zoek een bericht"
    iconLeft={faSearch}
  />
</div>

<!-- Filters -->
<div class="mt-2 flex gap-2 items-center w-full">
  <span class="font-bold">Filters: </span>
  <div class="flex gap-1 whitespace-nowrap">
    <Checkbox bind:value={showVisible} />
    Zichtbaar
  </div>
  <div class="flex gap-1">
    <Checkbox bind:value={showHidden} />
    Verborgen
  </div>
</div>

<div class="grid relative">
  <div
    class="tooltip ml-auto tooltip-left sm:tooltip-bottom"
    data-tip={tooltip}
  >
    <button class="btn btn-ghost btn-xs btn-circle">
      <InfoCircle class="" />
    </button>
  </div>
  <div class="overflow-x-auto rounded-t-lg">
    <table class="table static table-xs sm:table-sm md:table-md mb-3 xl:mb-0">
      <thead class="bg-base-200">
        <TableHeaderRow
          columns={[
            { name: "Afbeelding" },
            { name: "Titel" },
            { name: "Auteurs" },
            { name: "Angemaakt" },
            { name: "Tags" },
            { name: "Gewijzigd" },
            { name: "Zichtbaar" },
            { name: "" },
          ]}
        />
      </thead>
      <tbody>
        {#each visibleArticles as article}
          <tr class="border-b border-base-200">
            <td>
              <img
                src={article.imageIds[0]}
                alt="Logo"
                class="rounded-lg h-20"
              />
            </td>
            <td>
              <a href="/articles/{article.id}" class="link">{article.title}</a>
            </td>
            <td>{article.authors}</td>
            <td>{article.createdAt.format("YYYY-MM-DD HH:mm")}</td>
            <td>
              <div class="flex gap-1 flex-wrap my-auto h-full">
                {#each article.tags as tag}
                  <div
                    class="badge badge-primary font-semibold whitespace-nowrap"
                  >
                    {tag}
                  </div>
                {/each}
              </div>
            </td>
            <td>{article.lastUpdate?.format("YYYY-MM-DD HH:mm")}</td>
            <td>
              <Checkbox
                bind:value={article.visible}
                onInput={() => updateVisibility(article)}
                inputClass="mx-auto"
              />
            </td>
            <td>
              <EditDropdown
                positionStatic
                editUrl={"articles/edit/" + article.id}
                deleteHandler={() => startDelete(article)}
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <TableFooter
    filteredLength={visibleArticles.length}
    fullLength={allArticles.length}
    {saving}
    pagination
    hasPrevious={hasPreviousPage}
    hasNext={hasNextPage}
    {previous}
    {next}
  />
  {#if errorMessage}
    <p class="text-error">{errorMessage}</p>
  {/if}
</div>

<ConfirmModal {confirmModalID} onConfirm={deleteArticle} bind:showModal>
  Bent u zeker dat u het bericht
  <span class="font-semibold">"{articlePendingDelete?.title}"</span>
  wilt verwijderen?
</ConfirmModal>
