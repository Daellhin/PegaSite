<script lang="ts">
  import FormControlSavableText from "$components/FormHelpers/FormControlSavableText.svelte";
  import { Link, type LinkGroup } from "$lib/domain/Link";
  import { navbarStore } from "$lib/stores/NavbarStore";
  import ToolbarDropdownEditorRow from "./ToolbarDropdownEditorRow.svelte";

  export let linkGroup: LinkGroup;

  let title = linkGroup.name;
  let tempLink: Link | undefined;

  $: links = linkGroup.links;

  async function deleteLink(link: Link) {
    await navbarStore.removeLink(link, linkGroup);
  }
  async function updateLink(link: Link) {
    navbarStore.updateLink(link, linkGroup);
  }
  async function addLink(link: Link) {
    navbarStore.addLink(link, linkGroup);
    tempLink = undefined;
  }
  async function addTempLink() {
    if (tempLink) return;
    tempLink = new Link("", links.length);
  }
  function deleteTempLink() {
    tempLink = undefined;
  }
  async function updateGroupTitle() {
    navbarStore.updateGroupTitle(title, linkGroup);
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
          saveLink={updateLink}
        />
      {:else}
        {#each links as link (link.title)}
          <ToolbarDropdownEditorRow {link} {deleteLink} saveLink={updateLink} />
        {/each}
      {/if}
      {#if tempLink}
        <ToolbarDropdownEditorRow
          link={tempLink}
          deleteLink={deleteTempLink}
          saveLink={addLink}
        />
      {/if}
    </div>
    <button
      class="btn btn-primary btn-sm mt-2 max-w-sm normal-case"
      on:click={addTempLink}
    >
      Link toevoegen
    </button>
  </div>
</div>
