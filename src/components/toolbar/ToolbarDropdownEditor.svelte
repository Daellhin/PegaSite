<script lang="ts">
  import FormControlSavableText from "$components/FormHelpers/FormControlSavableText.svelte";
  import { Link, type LinkGroup } from "$lib/domain/Link";
  import { navbarStore } from "$lib/stores/NavbarStore";
  import { sleep } from "$lib/utils/Utils";
  import ToolbarDropdownEditorRow from "./ToolbarDropdownEditorRow.svelte";

  export let linkGroup: LinkGroup;
  let title = linkGroup.name;
  $: links = linkGroup.links;

  let tempLink: Link | undefined;

  async function deleteLink(link: Link) {
    await navbarStore.removeLink(link, linkGroup);
  }
  async function updateLink(_link: Link) {
    await sleep(600);
  }
  async function addLink(link: Link) {
    await sleep(600);
    navbarStore.addLink(link, linkGroup);
    tempLink = undefined;
  }
  async function addTempLink() {
    if (tempLink) return;
    tempLink = new Link("", "");
  }
  function deleteTempLink() {
    console.log("removed");
    tempLink = undefined;
  }
  async function updateGroupTitle() {
    await sleep(600);
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
        {#each links as link (link.name)}
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
    <button class="btn btn-primary btn-sm mt-2 max-w-sm normal-case">
      Categorie verwijderen
    </button>
  </div>
</div>
