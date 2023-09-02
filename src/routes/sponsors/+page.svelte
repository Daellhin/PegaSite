<script lang="ts">
  import { goto } from "$app/navigation"
  import SearchInput from "$components/formHelpers/inputs/SearchInput.svelte"
  import SponsorForm from "$components/sponsors/SponsorForm.svelte"
  import SponsorRow from "$components/sponsors/SponsorRow.svelte"
  import SortableTableHeaderRow from "$components/table/SortableTableHeaderRow.svelte"
  import type { Sponsor } from "$lib/domain/Sponsor"
  import { SortOrder } from "$lib/domain/dataClasses/SortOrder"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { sponsorStore } from "$lib/stores/SponsorStore"

  let showForm = false
  let searchString = ""
  let sortColumn = ""
  let sortOrder = SortOrder.None

  let editSponsor: Sponsor | undefined = undefined

  $: filteredSponsors =
    $sponsorStore?.filter((sponsor) =>
      sponsor.matchesSearchString(searchString)
    ) || []
  $: sortedSponsors = sort(filteredSponsors, sortColumn, sortOrder)

  function sort(sponsors: Sponsor[], sortColumn: string, sortOrder: SortOrder) {
    if (sortOrder.isNone) return [...sponsors]
    const newArray = [...sponsors]
    switch (sortColumn) {
      case "Naam":
        newArray.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "Website":
        newArray.sort((a, b) => a.url.localeCompare(b.url))
        break
    }
    if (sortOrder.isDesc) newArray.reverse()
    return newArray
  }

  function startEdit(sponsor: Sponsor) {
    showForm = true
    editSponsor = sponsor
  }
  function dismisForm() {
    showForm = false
    editSponsor = undefined
  }
  function showFormHandler() {
    showForm = true
    editSponsor = undefined
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Sponsors wijzigen")
</script>

<div class="flex gap-3">
  <h1 class="text-2xl font-bold mb-1">Sponsors wijzigen</h1>
  <button class="btn btn-sm capitalize btn-primary" on:click={showFormHandler}>
    Nieuwe Sponsor
  </button>
</div>

{#if showForm}
  <div class="mt-2">
    <SponsorForm bind:showForm bind:editSponsor onDismiss={dismisForm} />
  </div>
{/if}

<SearchInput
  class="mt-2"
  bind:value={searchString}
  placeholder="Zoek een sponsor"
  id="search-sponsor"
/>

{#if $sponsorStore}
  <div class="mt-3 grid relative">
    <div class="overflow-x-auto rounded-t-lg">
      <table class="table static">
        <thead class="bg-base-200">
          <SortableTableHeaderRow
            columns={[
              { name: "Nr", dontSort: true },
              { name: "Naam" },
              { name: "Website" },
              { name: "Afbeelding", dontSort: true },
              { name: "", dontSort: true },
            ]}
            bind:sortColumn
            bind:sortOrder
          />
        </thead>
        <tbody>
          {#each sortedSponsors as sponsor, n}
            <SponsorRow {sponsor} index={n} editHandler={startEdit} />
          {/each}
        </tbody>
      </table>
    </div>
    <div class="flex items-center justify-between mt-4">
      <div class="opacity-80">
        Weergegeven
        <span class="font-bold opacity-100">{filteredSponsors.length}</span>
        van
        <span class="font-bold opacity-100">{filteredSponsors.length}</span>
      </div>
      <div class="join">
        <button class="join-item btn btn-sm">«</button>
        <button class="join-item btn btn-sm btn-active">1</button>
        <button class="join-item btn btn-sm">»</button>
      </div>
    </div>
  </div>
{:else}
  Loading
{/if}
