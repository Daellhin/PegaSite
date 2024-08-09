<script lang="ts">
	import ConfirmModal from "$components/ConfirmModal.svelte"
	import Input from "$components/formHelpers/Input.svelte"
	import InfoCircle from "$components/icons/Flowbite/InfoCircle.svelte"
	import TableFooter from "$components/table/TableFooter.svelte"
	import TableHeaderRow from "$components/table/TableHeaderRow.svelte"
	import type { Announcement } from "$lib/domain/Announcement"
	import { announcementStore } from "$lib/stores/AnnouncementStore"

	import { handleFirebaseError } from "$lib/utils/Firebase"
	import { faSearch } from "@fortawesome/free-solid-svg-icons"
	import AnnouncementRow from "./AnnouncementRow.svelte"
  
	export let startEdit: (announcement: Announcement) => void
  
	const tooltip =
	  "Versleep een aankondiging met het icoontje naast de naam om de volgorde te wijzigen"
	const confirmModalID = "confirm-delete-article"
  
	// -- Drag and drop --
	let savingNewOrder = false
	let dragDisabled = true
	$: dragFullyDisabled = searchString.length > 0
  
	$: dragableAnnouncements = $announcementStore || []
	//.map((e) => e.toDragableItem())
  
	// function handleConsider(event: CustomEvent<DndEvent<any>>) {
	//   dragableSponsors = event.detail.items
	//   dragDisabled = true
	// }
	// async function handleFinalize(event: CustomEvent<DndEvent<any>>) {
	//   savingNewOrder = true
	//   dragableSponsors = event.detail.items
	//   dragDisabled = true
	//   const newSortedIds = dragableSponsors.map((e) => e.value.id)
	//   await announcementStore.updateAnnouncementOrder(newSortedIds)
	//   savingNewOrder = false
	// }
  
	// -- Edit articles --
	let showModal = false
	let announcemntPendingDelete: Announcement | undefined
	$: if (!showModal) announcemntPendingDelete = undefined
  
	async function deleteAnnouncement() {
	  if (!announcemntPendingDelete) return
	  const announcement = announcemntPendingDelete
	  saveWrapper(async () => {
		await announcementStore.deleteAnnouncement(announcement)
	  })
	  showModal = false
	}
	function startDelete(announcement: Announcement) {
	  announcemntPendingDelete = announcement
	  showModal = true
	}
	async function updateVisibility(announcement: Announcement) {
	  saveWrapper(async () => {
		await announcementStore.updateAnnouncementVisibility(announcement)
	  })
	}
  
	// -- Search --
	let searchString = ""
  
	// $: filteredDragableAnnouncements = searchString
	//   ? filterAnnouncements(searchString)
	//   : dragableAnnouncements
	$: filteredDragableAnnouncements = dragableAnnouncements
  
	function filterAnnouncements(searchString: string) {
	  return dragableAnnouncements.filter((announcement) => 
	  true
		//sponsor.value.matchesSearchString(searchString),
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
	  placeholder="Zoek een aankondiging"
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
			  { name: "Titel" },
			  { name: "Inhoud" },
			  { name: "Zichtbaar" },
			  { name: "Minimaliseerbaar" },
			  { name: "" },
			]}
		  />
		</thead>
		<!-- <tbody
		  use:dndzone={{
			items: dragableAnnouncements,
			dragDisabled: dragDisabled,
			flipDurationMs: FLIP_DURATION,
			dropTargetStyle: {},
		  }}
		  on:consider={handleConsider}
		  on:finalize={handleFinalize}
		> -->
		<tbody>
		  {#each filteredDragableAnnouncements as dragable (dragable.id)}
			<AnnouncementRow
			  announcement={dragable}
			  editHandler={startEdit}
			  deleteHandler={startDelete}
			  updateVisibilityHandler={updateVisibility}
			  updateDismissibleHandler={()=>{}}
			  bind:dragDisabled
			  {dragFullyDisabled}
			/>
		  {/each}
		</tbody>
	  </table>
	</div>
	<TableFooter
	  filteredLength={filteredDragableAnnouncements.length}
	  fullLength={dragableAnnouncements.length}
	  saving={savingNewOrder || saving}
	/>
	{#if errorMessage}
	  <p class="text-error">{errorMessage}</p>
	{/if}
  </div>
  
  <ConfirmModal {confirmModalID} onConfirm={deleteAnnouncement} bind:showModal>
	Bent u zeker dat u de aankondiging
	<span class="font-semibold">"{announcemntPendingDelete?.title}"</span>
	wilt verwijderen?
  </ConfirmModal>
  