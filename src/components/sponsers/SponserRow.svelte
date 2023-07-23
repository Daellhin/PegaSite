<script lang="ts">
  import EditDropdown from "$components/EditDropdown.svelte"
  import type { Sponser } from "$lib/domain/Sponser"
  import { sponserStore } from "$lib/stores/SponserStore"

  export let index: number
  export let sponser: Sponser
  export let editHandler: (sponer: Sponser) => Promise<void> | any

  function editWrapper() {
    editHandler(sponser)
  }
  async function deleteSponser() {
    await sponserStore.deleteSponser(sponser)
  }
</script>

<tr class="hover:bg-base-300 border-b border-base-200">
  <th>{index + 1}</th>
  <td>{sponser.name}</td>
  <td><a href={sponser.url} class="link">{sponser.url}</a></td>
  <td>
    <img src={sponser.imageUrl} alt="Logo" class="rounded-lg h-20" />
  </td>
  <td>
    <EditDropdown
      editHandler={editWrapper}
      deleteHandler={deleteSponser}
      positionStatic
    />
  </td>
</tr>
