<script lang="ts">
  import DndHandle from "$components/DNDHandle.svelte"
  import SavableInput from "$components/formHelpers/SavableInput.svelte"
  import NavbarLinkEditor from "$components/page/NavbarLinkEditor.svelte"
  import { Link, type LinkGroup } from "$lib/domain/Link"
  import { navbarStore } from "$lib/stores/NavbarStore"
  import { FLIP_DURATION } from "$lib/utils/Constants"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { dndzone } from "svelte-dnd-action"

  export let linkGroup: LinkGroup
  export let dragDisabled: boolean
  export let savingNewOrder = false

  // -- Link group --
  let linkGroupName = linkGroup.name

  async function updateGroupTitle() {
    await navbarStore.updateGroupTitle(linkGroupName, linkGroup)
  }
  function validateGroupTitle(inner_value: string) {
    const pattern = /^[a-zA-Z0-9- ]*$/g
    if (!inner_value || !inner_value.trim()) return "Titel moet ingevuld zijn"
    if (!inner_value.match(pattern))
      return "Titel mag enkel cijfers, letters, spaties, - bevatten"
    return undefined
  }

  // -- Link --
  let tempLink: Link | undefined

  async function updateLink(newTitle: string, link: Link) {
    await navbarStore.updateLinkTitle(newTitle, link, linkGroup)
  }
  async function deleteLink(link: Link) {
    await navbarStore.deleteLink(link, linkGroup)
  }
  async function createTempLink() {
    if (tempLink) return
    tempLink = new Link("", linkGroup.links.length)
  }
  function deleteTempLink() {
    tempLink = undefined
  }
  async function createLink(newTitle: string, link: Link) {
    link.title = newTitle
    await navbarStore.createLink(link, linkGroup)
    tempLink = undefined
  }

  // -- Drag and drop(Links) --
  let reorderError = ""
  $: dragableLinks = linkGroup.links.map((e) => e.toDragableDragableItem())

  function handleConsider(event: CustomEvent<DndEvent<any>>) {
    dragableLinks = event.detail.items
    dragDisabled = true
  }
  async function handleFinalize(event: CustomEvent<DndEvent<any>>) {
    savingNewOrder = true
    dragDisabled = true
    reorderError = ""
    try {
      dragableLinks = event.detail.items
      const newSortedLinks = dragableLinks.map((e) => e.value)
      await navbarStore.updateLinkOrder(linkGroup, newSortedLinks)
    } catch (error) {
      reorderError = handleFirebaseError(error)
    }
    savingNewOrder = false
  }
</script>

<div class="bg-base-100 rounded-lg sm:px-2 py-2">
  <div class="mb-2 max-w-xs flex gap-2">
    <DndHandle bind:dragDisabled />
    <SavableInput
      type="text"
      bind:value={linkGroupName}
      placeholder="Titel"
      save={updateGroupTitle}
      validate={validateGroupTitle}
      inputStyling="text-2xl font-bold"
    />
  </div>
  <div class="ml-2">
    <div
      class="flex flex-col"
      use:dndzone={{
        items: dragableLinks,
        dragDisabled: dragDisabled,
        flipDurationMs: FLIP_DURATION,
        dropTargetStyle: {},
        type: "NavbarLink",
      }}
      on:consider={handleConsider}
      on:finalize={handleFinalize}
    >
      {#each dragableLinks as dragable (dragable.id)}
        <NavbarLinkEditor
          link={dragable.value}
          disabled={linkGroup.links.length > 1}
          {deleteLink}
          saveLink={updateLink}
          bind:dragDisabled
        />
      {/each}
      {#if tempLink}
        <NavbarLinkEditor
          link={tempLink}
          deleteLink={deleteTempLink}
          saveLink={createLink}
          dragDisabled={true}
        />
      {/if}
    </div>
    <button
      class="btn btn-primary btn-sm mt-2 max-w-sm normal-case"
      on:click={createTempLink}
    >
      Link toevoegen
    </button>
  </div>
</div>

<style lang="postcss">
  :global(#dnd-action-dragged-el) {
    @apply border-2 !important;
  }
</style>
