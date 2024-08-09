<script lang="ts">
  import DndHandle from "$components/DNDHandle.svelte"
  import EditDropdown from "$components/EditDropdown.svelte"
  import Checkbox from "$components/formHelpers/Checkbox.svelte"
  import type { Sponsor } from "$lib/domain/Sponsor"

  export let sponsor: Sponsor
  export let editHandler: (sponser: Sponsor) => Promise<void> | any
  export let deleteHandler: (sponser: Sponsor) => Promise<void> | any
  export let updateVisibilityHandler: (sponser: Sponsor) => Promise<void> | any
  export let dragDisabled: boolean
  export let dragFullyDisabled = false

  function editWrapper() {
    editHandler(sponsor)
  }
  function deleteWrapper() {
    deleteHandler(sponsor)
  }
  function updateVisibilityWrapper() {
    updateVisibilityHandler(sponsor)
  }
</script>

<tr class="hover:bg-base-300 border-b border-base-200">
  {#if !dragFullyDisabled}
    <td class="w-6 pr-1">
      <DndHandle bind:dragDisabled />
    </td>
  {/if}
  <td>{sponsor.name}</td>
  <td><a href={sponsor.url} class="link">{sponsor.url}</a></td>
  <td>
    <img src={sponsor.imageUrl} alt="Logo" class="rounded-lg h-20" />
  </td>
  <td>
    <Checkbox
      bind:value={sponsor.visible}
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
