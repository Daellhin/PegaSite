<script lang="ts">
  import ConfirmModal from "$components/ConfirmModal.svelte"
  import DndHandle from "$components/DNDHandle.svelte"
  import EditDropdown from "$components/EditDropdown.svelte"
  import SavableInput from "$components/formHelpers/SavableInput.svelte"
  import { Link } from "$lib/domain/Link"

  export let link: Link
  export let disabled = true
  export let deleteLink: (link: Link) => Promise<void> | any
  export let saveLink: (newTitle: string, link: Link) => Promise<void>
  export let dragDisabled: boolean

  const confirmModalID = "confirmLinkDelete"
  let showModal = false

  let linkTitle = link.title
  $: linkUrl = Link.normaliseUrl(linkTitle)

  async function saveLinkWrapper() {
    linkTitle = linkTitle.trim()
    await saveLink(linkTitle, link)
  }
  async function deleteLinkAndPageWrapper() {
    showModal = false
    await deleteLink(link)
  }
</script>

<div class="flex flex-col sm:flex-row sm:items-center sm:gap-2 bg-base-100 rounded-lg">
  <DndHandle bind:dragDisabled />
  <div class="italic w-72 overflow-hidden text-ellipsis">
    {#if link.customUrl}
      {link.customUrl}
    {:else}
      {linkUrl}
    {/if}
  </div>
  <div class="flex gap-2 w-full max-w-lg">
    <SavableInput
      type="text"
      bind:value={linkTitle}
      placeholder="Titel"
      save={saveLinkWrapper}
      disabled={!disabled || link.customUrl != undefined}
    />
    <EditDropdown
      editUrl={link.getUrl(true)}
      deleteHandler={() => (showModal = true)}
      disabled={link.customUrl != undefined}
      editPrompt="Pagina aanpassen"
    />
  </div>
</div>

<ConfirmModal
  {confirmModalID}
  onConfirm={deleteLinkAndPageWrapper}
  bind:showModal
>
  Bent u zeker dat u de <span class="font-semibold">"{link.title}"</span>
  navigatie link en geasocierde
  <span class="font-semibold">"{linkUrl}"</span> pagina wilt verwijderen?
</ConfirmModal>

<style lang="postcss">
  :global(#dnd-action-dragged-el) {
    @apply border-2 !important;
  }
</style>
