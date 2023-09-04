<script lang="ts">
  import SearchInput from "$components/formHelpers/inputs/SearchInput.svelte"
  import SponsorRow from "$components/sponsors/SponsorRow.svelte"
  import TablePagination from "$components/table/TableFooter.svelte"
  import TableHeaderRow from "$components/table/TableHeaderRow.svelte"
  import type { Sponsor } from "$lib/domain/Sponsor"
  import { sponsorStore } from "$lib/stores/SponsorStore"
  import { FLIP_DURATION } from "$lib/utils/Constants"
  import { dndzone } from "svelte-dnd-action"

  export let startEdit: (sponsor: Sponsor) => void

  // -- Drag and drop --
  let dragDisabled = false

  $: dragableSponsors = $sponsorStore.map((e) => e.toDragableSponsor())

  function handleConsider(event: CustomEvent<DndEvent<any>>) {
    dragableSponsors = event.detail.items
    dragDisabled = true
  }
  function handleFinalize(event: CustomEvent<DndEvent<any>>) {
    dragableSponsors = event.detail.items
    dragDisabled = true
  }

  // -- Search --
  let searchString = ""

  $: filteredSponsors = searchString
    ? filterSponsors(searchString)
    : dragableSponsors

  function filterSponsors(searchString: string) {
    return dragableSponsors.filter((sponsor) =>
      sponsor.sponsor.matchesSearchString(searchString)
    )
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
    <table class="table static table-xs sm:table-sm md:table-md">
      <thead class="bg-base-200">
        <TableHeaderRow
          columns={[
            { name: "", hidden: searchString.length > 0 },
            { name: "Naam" },
            { name: "Website" },
            { name: "Afbeelding" },
            { name: "" },
          ]}
        />
      </thead>
      <tbody
        use:dndzone={{
          items: dragableSponsors,
          dragDisabled: dragDisabled,
          flipDurationMs: FLIP_DURATION,
          dropTargetStyle: {},
        }}
        on:consider={handleConsider}
        on:finalize={handleFinalize}
      >
        {#each filteredSponsors as sponsor, n (sponsor.id)}
          <SponsorRow
            sponsor={sponsor.sponsor}
            editHandler={startEdit}
            bind:dragDisabled
            dragFullyDisabled={searchString.length > 0}
          />
        {/each}
      </tbody>
    </table>
  </div>
  <TablePagination
    filteredLength={filteredSponsors.length}
    fullLength={dragableSponsors.length}
  />
</div>
