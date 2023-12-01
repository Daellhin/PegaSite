<script lang="ts">
  import { goto } from "$app/navigation"
  import Input from "$components/formHelpers/Input.svelte"
  import TablePagination from "$components/table/TableFooter.svelte"
  import TableHeaderRow from "$components/table/TableHeaderRow.svelte"
  import { articleStore } from "$lib/stores/ArticleStore"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { faSearch } from "@fortawesome/free-solid-svg-icons"
  import { load } from "../pages/+page"
  import EditDropdown from "$components/EditDropdown.svelte"

  let searchString = ""
  let saving = false
  let errorMessage = ""

  async function loadMoreArticles() {
    saving = true
    try {
      await articleStore.loadMoreArticles()
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
    saving = false
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Clubrecords beheren")
  articleStore.loadMoreArticles()
</script>

<!-- Title -->
<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold">Berichten beheren</h1>
  <a href="/articles/new" class="btn btn-sm btn-primary">Nieuw Bericht </a>
</div>

<!-- Search -->
<div class="mt-2">
  <Input
    type="text"
    bind:value={searchString}
    placeholder="Zoek een bericht"
    iconLeft={faSearch}
  />
</div>

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
          {#each $articleStore as recordInstance}
            <tr class="border-b border-base-200">
              <td>
                <img
                  src={recordInstance.images[0]}
                  alt="Logo"
                  class="rounded-lg h-20"
                />
              </td>
              <td>{recordInstance.title}</td>
              <td>{recordInstance.authors}</td>
              <td>{recordInstance.createdAt.format("YYYY-MM-DD HH:mm")}</td>
              <td>{recordInstance.tags}</td>
              <td>{recordInstance.lastUpdate?.format("YYYY-MM-DD HH:mm")}</td>
              <td>
                <EditDropdown positionStatic />
              </td>
              <!-- <td class="first-letter:capitalize">
                {recordInstance.clubRecord?.discipline}
              </td>
              <td>{recordInstance.clubRecord?.athleticEvent}</td>
              <td>{recordInstance.clubRecord?.category}</td>
              <td>{recordInstance.clubRecord?.gender}</td>
              <td class="max-w-xs break-words min-w-[15em]">
                {recordInstance.name}
              </td>
              <td>{recordInstance.result}</td>
              <td>{recordInstance.location}</td>
              <td>{recordInstance.formattedDate()}</td> -->
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <TablePagination
      filteredLength={$articleStore.length}
      fullLength={$articleStore.length}
      bind:saving
    />
    {#if errorMessage}
      <p class="text-error">{errorMessage}</p>
    {/if}
  </div>
  <div class="mt-3">
    <button type="button" class="btn btn-primary" on:click={loadMoreArticles}
      >Meer laden</button
    >
  </div>
{/if}
