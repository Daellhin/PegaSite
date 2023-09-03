<script lang="ts">
  import SearchInput from "$components/formHelpers/inputs/SearchInput.svelte"
  import SponsorRow from "$components/sponsors/SponsorRow.svelte"
  import SortableTableHeaderRow from "$components/table/SortableTableHeaderRow.svelte"
  import type { Sponsor } from "$lib/domain/Sponsor"
  import { SortOrder } from "$lib/domain/dataClasses/SortOrder"
  import {
    faAnglesLeft,
    faAnglesRight,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let sponsors: Sponsor[]
  export let startEdit: (sponsor: Sponsor) => void

  let searchString = ""
  let sortColumn = ""
  let sortOrder = SortOrder.None

  $: filteredSponsors =
    sponsors?.filter((sponsor) => sponsor.matchesSearchString(searchString)) ||
    []
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
</script>

<SearchInput
  class="mt-2"
  bind:value={searchString}
  placeholder="Zoek een sponsor"
  id="search-sponsor"
/>

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
      <button class="join-item btn btn-sm lin">
        <Fa icon={faAnglesLeft} class="" />
      </button>
      <button class="join-item btn btn-sm btn-active">1</button>
      <button class="join-item btn btn-sm">
        <Fa icon={faAnglesRight} class="" />
      </button>
    </div>
  </div>
</div>
