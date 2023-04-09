<script lang="ts">
  import FormControlSavableText from "$components/FormHelpers/FormControlSavableText.svelte";
  import { Link, type LinkGroup } from "$lib/domain/Link";
  import { navbarStore } from "$lib/stores/NavbarStore";
  import ToolbarDropdownEditorRow from "./ToolbarDropdownEditorRow.svelte";

  export let linkGroup: LinkGroup;

  let title = linkGroup.name;
  let tempLink: Link | undefined;

  $: links = linkGroup.links;

  async function createLink(newTitle: string, link: Link) {
    link.title = newTitle;
    await navbarStore.createLink(link, linkGroup);
    tempLink = undefined;
  }
  async function updateLinkTitle(newTitle: string, link: Link) {
    await navbarStore.updateLinkTitle(newTitle, link, linkGroup);
  }
  async function deleteLink(link: Link) {
    await navbarStore.deleteLink(link, linkGroup);
  }
  async function createTempLink() {
    if (tempLink) return;
    tempLink = new Link("", links.length);
  }
  function deleteTempLink() {
    tempLink = undefined;
  }
  async function updateGroupTitle() {
    await navbarStore.updateGroupTitle(title, linkGroup);
  }
</script>

<div>
  <div class="mb-2 max-w-xs">
    <FormControlSavableText
      bind:value={title}
      placeholder="Titel"
      save={updateGroupTitle}
      inputStyling="text-2xl font-bold"
      transparent
    />
  </div>
  <div class="ml-2">
    <div class="flex flex-col gap-2">
      {#if linkGroup.links.length === 1}
        <ToolbarDropdownEditorRow
          link={linkGroup.links[0]}
          isEditable={false}
          {deleteLink}
          saveLink={updateLinkTitle}
        />
      {:else}
        {#each links as link (link.title)}
          <ToolbarDropdownEditorRow
            {link}
            {deleteLink}
            saveLink={updateLinkTitle}
          />
        {/each}
      {/if}
      {#if tempLink}
        <ToolbarDropdownEditorRow
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
