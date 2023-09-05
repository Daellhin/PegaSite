<script lang="ts">
  import DndHandle from "$components/DNDHandle.svelte"
  import EditDropdown from "$components/EditDropdown.svelte"
  import type { Sponsor } from "$lib/domain/Sponsor"
  import { sponsorStore } from "$lib/stores/SponsorStore"

  export let sponsor: Sponsor
  export let editHandler: (sponer: Sponsor) => Promise<void> | any
  export let dragDisabled: boolean
  export let dragFullyDisabled = false

  function editWrapper() {
    editHandler(sponsor)
  }
  async function deleteSponsor() {
    await sponsorStore.deleteSponsor(sponsor)
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
    <EditDropdown
      editHandler={editWrapper}
      deleteHandler={deleteSponsor}
      positionStatic
    />
  </td>
</tr>

<style lang="postcss">
  :global(#dnd-action-dragged-el) {
    @apply table;
  }
</style>
