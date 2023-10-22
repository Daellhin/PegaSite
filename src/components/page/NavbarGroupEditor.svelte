<script lang="ts">
  import SavableInput from "$components/formHelpers/SavableInput.svelte"
  import NavbarLinkEditor from "$components/page/NavbarLinkEditor.svelte"
  import { Link, type LinkGroup } from "$lib/domain/Link"
  import { navbarStore } from "$lib/stores/NavbarStore"

  export let linkGroup: LinkGroup

  let title = linkGroup.name
  let tempLink: Link | undefined

  $: links = linkGroup.links

  async function createLink(newTitle: string, link: Link) {
    link.title = newTitle
    await navbarStore.createLink(link, linkGroup)
    tempLink = undefined
  }
  async function updateLinkTitle(newTitle: string, link: Link) {
    await navbarStore.updateLinkTitle(newTitle, link, linkGroup)
  }
  async function deleteLink(link: Link) {
    await navbarStore.deleteLink(link, linkGroup)
  }
  async function createTempLink() {
    if (tempLink) return
    tempLink = new Link("", links.length)
  }
  function deleteTempLink() {
    tempLink = undefined
  }
  async function updateGroupTitle() {
    await navbarStore.updateGroupTitle(title, linkGroup)
  }
  function validate(inner_value: string) {
    const pattern = /^[a-zA-Z0-9- ]*$/g
    if (!inner_value || !inner_value.trim()) return "Titel moet ingevuld zijn"
    if (!inner_value.match(pattern))
      return "Titel mag enkel cijfers, letters, spaties, - bevatten"
    return undefined
  }
</script>

<div>
  <div class="mb-2 max-w-xs">
    <SavableInput
      type="text"
      bind:value={title}
      placeholder="Titel"
      save={updateGroupTitle}
      {validate}
      inputStyling="text-2xl font-bold"
      transparent
    />
  </div>
  <div class="ml-2">
    <div class="flex flex-col gap-2">
      {#if linkGroup.links.length === 1}
        <NavbarLinkEditor
          link={linkGroup.links[0]}
          isEditable={false}
          {deleteLink}
          saveLink={updateLinkTitle}
        />
      {:else}
        {#each links as link (link.title)}
          <NavbarLinkEditor {link} {deleteLink} saveLink={updateLinkTitle} />
        {/each}
      {/if}
      {#if tempLink}
        <NavbarLinkEditor
          link={tempLink}
          deleteLink={deleteTempLink}
          saveLink={createLink}
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
