<script lang="ts">
  import Checkbox from "$components/formHelpers/Checkbox.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import TableFooter from "$components/table/TableFooter.svelte"
  import TableHeaderRow from "$components/table/TableHeaderRow.svelte"
  import type { RecordInstance } from "$lib/domain/RecordInstance"
  import { clubRecordStore } from "$lib/stores/ClubRecordStore"
  import { faSearch } from "@fortawesome/free-solid-svg-icons"
  import RecordButtonGroup from "./RecordButtonGroup.svelte"

  export let startEdit: (record: RecordInstance) => void

  let saving = false
  let errorMessage = ""

  $: allRecords = $clubRecordStore?.flatMap((e) => {
    e.records.forEach((f) => f.linkClubrecord(e))
    return e.records
  })
  $: filteredRecords = allRecords
    .filter((e) => approvedFilter(e, showApproved, showNotApproved))
    .filter((e) => e.matchesSearchString(searchString))

  // -- Filters --
  let showNotApproved = true
  let showApproved = false

  function approvedFilter(
    record: RecordInstance,
    showApproved: boolean,
    showNotApproved: boolean,
  ) {
    if (showApproved && showNotApproved) return true
    if (showApproved && !showNotApproved) return record.checked
    if (!showApproved && showNotApproved) return !record.checked
    return true
  }

  // -- Search --
  let searchString = ""
</script>

<div class="mt-2">
  <Input
    type="text"
    bind:value={searchString}
    placeholder="Zoek een clubrecord"
    iconLeft={faSearch}
  />
</div>

<div class="mt-2 flex gap-2 items-center w-full">
  <span class="font-bold">Filters: </span>
  <div class="flex gap-1 whitespace-nowrap">
    <Checkbox bind:value={showNotApproved} />
    Niet goedgekeurd
  </div>
  <div class="flex gap-1">
    <Checkbox bind:value={showApproved} />
    Goedgekeurd
  </div>
</div>

<div class="grid relative mt-2">
  <div class="overflow-x-auto rounded-t-lg">
    <table class="table static table-xs sm:table-sm md:table-md mb-3 xl:mb-0">
      <thead class="bg-base-200">
        <TableHeaderRow
          columns={[
            { name: "Status", class: "xl:hidden" },
            { name: "Disipline" },
            { name: "In/outdoor" },
            { name: "Categorie" },
            { name: "Geslacht" },
            { name: "Naam" },
            { name: "Prestatie" },
            { name: "Locatie" },
            { name: "Datum" },
            { name: "Status", class: "hidden xl:block" },
          ]}
        />
      </thead>
      <tbody>
        {#each filteredRecords as recordInstance}
          <tr class="border-b border-base-200">
            <td class="xl:hidden">
              <RecordButtonGroup
                class="flex xl:hidden"
                {recordInstance}
                {startEdit}
                bind:saving
                bind:saveError={errorMessage}
              />
            </td>
            <td class="first-letter:capitalize">
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
            <td>{recordInstance.formattedDate()}</td>
            <td class="hidden xl:table-cell">
              <RecordButtonGroup
                class="hidden xl:flex"
                {recordInstance}
                {startEdit}
                bind:saving
                bind:saveError={errorMessage}
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <TableFooter
    filteredLength={filteredRecords.length}
    fullLength={allRecords.length}
    bind:saving
  />
  {#if errorMessage}
    <p class="text-error">{errorMessage}</p>
  {/if}
</div>
