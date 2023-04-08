<script lang="ts">
  import FormControlSavableText from "$components/FormHelpers/FormControlSavableText.svelte";
  import type { LinkGroup } from "$lib/domain/Link";
  import ToolbarDropdownEditorRow from "./ToolbarDropdownEditorRow.svelte";

  export let linkGroup: LinkGroup;
  let title: string = linkGroup.name;
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
      <ToolbarDropdownEditorRow link={linkGroup.links[0]} isEditable={false} bind:linkTitle={title} />
    {:else}
      {#each linkGroup.links as link}
        <ToolbarDropdownEditorRow {link} />
      {/each}
    {/if}
  </div>
  <button class="btn btn-primary btn-sm mt-2 max-w-sm normal-case ml-3">
    Link toevoegen
  </button>
</div>
