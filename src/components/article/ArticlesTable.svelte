<script lang="ts">
  import ConfirmModal from "$components/ConfirmModal.svelte"
  import EditDropdown from "$components/EditDropdown.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import TableFooter from "$components/table/TableFooter.svelte"
  import TableHeaderRow from "$components/table/TableHeaderRow.svelte"
  import type { Article } from "$lib/domain/Article"
  import {
    articleStore,
    setGlobalPaginationSize,
  } from "$lib/stores/ArticleStore"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { faSearch } from "@fortawesome/free-solid-svg-icons"

  const confirmModalID = "confirm-delete-article"
  const paginationSize = 10

  export let articles: Article[]

  let showModal = false
  let searchString = ""
  let saving = false
  let errorMessage = ""

  // -- Pagination --
  let page = 0
  $: previousArticles = page * paginationSize

  $: visibleArticles = articles?.slice(
    previousArticles,
    previousArticles + paginationSize,
  )
  $: hasNextPage = $articleStore?.length > previousArticles + paginationSize
  $: hasPreviousPage = page > 0

  function previous() {
    if (hasPreviousPage) page--
  }
  async function next() {
    if (hasNextPage) {
      saving = true
      errorMessage = ""
      try {
        await articleStore.loadMoreArticles()
        page++
      } catch (error) {
        errorMessage = handleFirebaseError(error)
      }
      saving = false
    }
  }

  // -- Edit articles --
  let articlePendingDelete: Article | undefined
  $: if (!showModal) articlePendingDelete = undefined

  async function deleteArticle() {
    console.log("deleteArticle")
    saving = true
    errorMessage = ""

    saving = false
  }
  function startDelete(article: Article) {
    articlePendingDelete = article
    showModal = true
  }

  // -- Initialisation --
  let initialised = false
  $: if (!initialised && $articleStore) init()

  async function init() {
    initialised = true
    setGlobalPaginationSize(10)
    if ($articleStore.length < (page + 1) * paginationSize) {
      saving = true
      errorMessage = ""
      try {
        await articleStore.loadMoreArticles()
        articlePendingDelete = undefined
      } catch (error) {
        errorMessage = handleFirebaseError(error)
      }
      saving = false
    }
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

<div class="grid relative mt-2">
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
            { name: "" },
          ]}
        />
      </thead>
      <tbody>
        {#each visibleArticles as article}
          <tr class="border-b border-base-200">
            <td>
              <img src={article.images[0]} alt="Logo" class="rounded-lg h-20" />
            </td>
            <td>{article.title}</td>
            <td>{article.authors}</td>
            <td>{article.createdAt.format("YYYY-MM-DD HH:mm")}</td>
            <td>{article.tags}</td>
            <td>{article.lastUpdate?.format("YYYY-MM-DD HH:mm")}</td>
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
    fullLength={$articleStore.length}
    bind:saving
    pagination
    bind:hasPrevious={hasPreviousPage}
    bind:hasNext={hasNextPage}
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
