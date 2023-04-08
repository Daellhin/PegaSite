<script lang="ts">
  import FormControlSavableText from "$components/FormHelpers/FormControlSavableText.svelte";
  import type { Link, LinkGroup } from "$lib/domain/Link";
  import { navbarStore } from "$lib/stores/NavbarStore";
  import ToolbarDropdownEditorRow from "./ToolbarDropdownEditorRow.svelte";

  export let linkGroup: LinkGroup;
  $: title = linkGroup.name;

  async function deleteLink(link: Link) {
    await navbarStore.removeLink(link, linkGroup);
  }
</script>

<div>
  <div class="max-w-xs mb-2">
    <div class="flex items-center">
      <FormControlSavableText
        bind:value={title}
        placeholder="Titel"
        save={async () => {}}
        inputStyling="text-2xl font-bold"
        transparent
      />
    </div>
  </div>
  <div class="flex flex-col gap-2">
    {#if linkGroup.links.length === 1}
      <ToolbarDropdownEditorRow
        link={linkGroup.links[0]}
        isEditable={false}
        {deleteLink}
      />
    {:else}
      {#each linkGroup.links as link (link.name)}
        <ToolbarDropdownEditorRow bind:link {deleteLink} />
      {/each}
    {/if}
  </div>
  <button class="btn btn-primary btn-sm mt-2 max-w-sm normal-case ml-3">
    Link toevoegen
  </button>
</div>
