<script lang="ts">
  import Input from "$components/formHelpers/Input.svelte"
  import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"
  import SponsorRow from "$components/sponsors/SponsorRow.svelte"
  import TablePagination from "$components/table/TableFooter.svelte"
  import TableHeaderRow from "$components/table/TableHeaderRow.svelte"
  import type { Sponsor } from "$lib/domain/Sponsor"
  import { sponsorStore } from "$lib/stores/SponsorStore"
  import { FLIP_DURATION } from "$lib/utils/Constants"
  import { faSearch } from "@fortawesome/free-solid-svg-icons"
  import { dndzone } from "svelte-dnd-action"

  export let startEdit: (sponsor: Sponsor) => void

  const tooltip =
    "Versleep een sponsor met het icoontje naast de naam om de volgorde te wijzigen"

  // -- Drag and drop --
  let savingNewOrder = false
  let dragDisabled = true
  $: dragFullyDisabled = searchString.length > 0

  $: dragableSponsors = $sponsorStore.map((e) => e.toDragableItem())

  function handleConsider(event: CustomEvent<DndEvent<any>>) {
    dragableSponsors = event.detail.items
    dragDisabled = true
  }
  async function handleFinalize(event: CustomEvent<DndEvent<any>>) {
    savingNewOrder = true
    dragableSponsors = event.detail.items
    dragDisabled = true
    const newSortedIds = dragableSponsors.map((e) => e.value.id)
    await sponsorStore.updateSponsorsOrder(newSortedIds)
    savingNewOrder = false
  }

  // -- Search --
  let searchString = ""

  $: filteredDragableSponsors = searchString
    ? filterSponsors(searchString)
    : dragableSponsors

  function filterSponsors(searchString: string) {
    return dragableSponsors.filter((sponsor) =>
      sponsor.value.matchesSearchString(searchString)
    )
  }
</script>

<div class="mt-2">
  <Input
    type="text"
    bind:value={searchString}
    placeholder="Zoek een sponsor"
	iconLeft={faSearch}
  />
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
    <table class="table static table-xs sm:table-sm md:table-md">
      <thead class="bg-base-200">
        <TableHeaderRow
          columns={[
            { name: "", hidden: dragFullyDisabled },
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
        {#each filteredDragableSponsors as dragable (dragable.id)}
          <SponsorRow
            sponsor={dragable.value}
            editHandler={startEdit}
            bind:dragDisabled
            {dragFullyDisabled}
          />
        {/each}
      </tbody>
    </table>
  </div>
  <TablePagination
    filteredLength={filteredDragableSponsors.length}
    fullLength={dragableSponsors.length}
    saving={savingNewOrder}
  />
</div>
