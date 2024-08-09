<script lang="ts">
	import DndHandle from "$components/DNDHandle.svelte"
	import EditDropdown from "$components/EditDropdown.svelte"
	import Checkbox from "$components/formHelpers/Checkbox.svelte"
	import type { Announcement } from "$lib/domain/Announcement"
  
	export let announcement: Announcement
	export let editHandler: (announcement: Announcement) => Promise<void> | any
	export let deleteHandler: (announcement: Announcement) => Promise<void> | any
	export let updateVisibilityHandler: (announcement: Announcement) => Promise<void> | any
	export let updateDismissibleHandler: (announcement: Announcement) => Promise<void> | any

	export let dragDisabled: boolean
	export let dragFullyDisabled = false
  
	function editWrapper() {
	  editHandler(announcement)
	}
	function deleteWrapper() {
	  deleteHandler(announcement)
	}
	function updateVisibilityWrapper() {
	  updateVisibilityHandler(announcement)
	}
	function updateDismissibleWrapper() {
		updateDismissibleHandler(announcement)
	}
  </script>
  
  <tr class="hover:bg-base-300 border-b border-base-200">
	{#if !dragFullyDisabled}
	  <td class="w-6 pr-1">
		<DndHandle bind:dragDisabled />
	  </td>
	{/if}
	<td>{announcement.title}</td>
	<td class="text-nowrap text-ellipsis max-w-[20ch] sm:max-w-[50ch] overflow-hidden">{announcement.content}</td>
	<td>
	  <Checkbox
		bind:value={announcement.visible}
		onInput={updateVisibilityWrapper}
		inputClass="mx-auto"
	  />
	</td>
	<td>
		<Checkbox
		  bind:value={announcement.dismissible}
		  onInput={updateVisibilityWrapper}
		  inputClass="mx-auto"
		/>
	  </td>
	<td>
	  <EditDropdown
		editHandler={editWrapper}
		deleteHandler={deleteWrapper}
		positionStatic
	  />
	</td>
  </tr>
  
  <style lang="postcss">
	:global(#dnd-action-dragged-el) {
	  @apply table;
	}
  </style>
  