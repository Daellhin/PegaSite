<script lang="ts">
  import { goto } from "$app/navigation"
  import EditDropdown from "$components/EditDropdown.svelte"
  import TableFooter from "$components/table/TableFooter.svelte"
  import TableHeaderRow from "$components/table/TableHeaderRow.svelte"
  import type { Article } from "$lib/domain/Article"
  import {
    articleStore,
    setGlobalPaginationSize,
  } from "$lib/stores/ArticleStore"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import ConfirmModal from "$components/ConfirmModal.svelte"

  const confirmModalID = "confirm-delete-article"
  let initialised = false
  $: if (!initialised && $articleStore) init()

  function init() {
    initialised = true
    setGlobalPaginationSize(10)
    if ($articleStore.length < (page + 1) * paginationSize) {
      saving = true
      articleStore.loadMoreArticles()
      saving = false
    }
  }
  let showModal = false
  let searchString = ""
  let saving = false
  let errorMessage = ""
  let paginationSize = 10
  let page = 0

  $: articles = $articleStore
  $: visibleArticles = articles?.slice(
    page * paginationSize,
    (page + 1) * paginationSize,
  )
  $: if (!showModal) articlePendingDelete = undefined

  $: hasNextPage = $articleStore
    ? $articleStore.length > page * paginationSize + paginationSize
    : false
  $: hasPreviousPage = page > 0

  async function previous() {
    if (hasPreviousPage) page--
  }

  async function next() {
    if (hasNextPage) saving = true
    try {
      await articleStore.loadMoreArticles()
      page++
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
    saving = false
  }

  let articlePendingDelete: Article | undefined
  async function deleteArticle() {
    saving = true
    errorMessage = ""
    try {
      await articleStore.deleteArticle(articlePendingDelete!)
      articlePendingDelete = undefined
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
    saving = false
  }
  function startDelete(article: Article) {
    articlePendingDelete = article
    showModal = true
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Clubrecords beheren")
</script>

<!-- Title -->
<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold">Berichten beheren</h1>
  <a href="/articles/new" class="btn btn-sm btn-primary">Nieuw Bericht</a>
</div>

<!-- Search -->

{#if $articleStore}
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
                <img
                  src={article.images[0]}
                  alt="Logo"
                  class="rounded-lg h-20"
                />
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
{/if}

<ConfirmModal {confirmModalID} onConfirm={deleteArticle} bind:showModal>
  Bent u zeker dat u het bericht
  <span class="font-semibold">"{articlePendingDelete?.title}"</span>
  wilt verwijderen?
</ConfirmModal>
