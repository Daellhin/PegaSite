<script lang="ts">
  import ConfirmModal from "$components/ConfirmModal.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"
  import SponsorRow from "$components/sponsors/SponsorRow.svelte"
  import TableFooter from "$components/table/TableFooter.svelte"
  import TableHeaderRow from "$components/table/TableHeaderRow.svelte"
  import type { Sponsor } from "$lib/domain/Sponsor"
  import { sponsorStore } from "$lib/stores/SponsorStore"
  import { FLIP_DURATION } from "$lib/utils/Constants"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { faSearch } from "@fortawesome/free-solid-svg-icons"
  import { dndzone } from "svelte-dnd-action"
  import { writable } from "svelte/store"

  export let startEdit: (sponsor: Sponsor) => void

  const deleteProgressStore = writable(0)

  const tooltip =
    "Versleep een sponsor met het icoontje naast de naam om de volgorde te wijzigen"
  const confirmModalID = "confirm-delete-article"

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

  // -- Edit articles --
  let showModal = false
  let sponsorPendingDelete: Sponsor | undefined
  $: if (!showModal) sponsorPendingDelete = undefined

  async function deleteSponsor() {
    if (!sponsorPendingDelete) return
    const sponsor = sponsorPendingDelete
    saveWrapper(async () => {
      await sponsorStore.deleteSponsor(sponsor, deleteProgressStore)
    })
    showModal = false
  }
  function startDelete(sponsor: Sponsor) {
    sponsorPendingDelete = sponsor
    showModal = true
  }
  async function updateVisibility(sponsor: Sponsor) {
    saveWrapper(async () => {
      await sponsorStore.updateVisibility(sponsor)
    })
  }

  // -- Search --
  let searchString = ""

  $: filteredDragableSponsors = searchString
    ? filterSponsors(searchString)
    : dragableSponsors

  function filterSponsors(searchString: string) {
    return dragableSponsors.filter((sponsor) =>
      sponsor.value.matchesSearchString(searchString),
    )
  }

  // -- Util --
  let saving = false
  let errorMessage = ""

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
            { name: "Zichtbaar" },
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
            deleteHandler={startDelete}
            updateVisibilityHandler={updateVisibility}
            bind:dragDisabled
            {dragFullyDisabled}
          />
        {/each}
      </tbody>
    </table>
  </div>
  <TableFooter
    filteredLength={filteredDragableSponsors.length}
    fullLength={dragableSponsors.length}
    saving={savingNewOrder || saving}
  />
  {#if errorMessage}
    <p class="text-error">{errorMessage}</p>
  {/if}
</div>

<ConfirmModal {confirmModalID} onConfirm={deleteSponsor} bind:showModal>
  Bent u zeker dat u de sponsor
  <span class="font-semibold">"{sponsorPendingDelete?.name}"</span>
  wilt verwijderen?
</ConfirmModal>
