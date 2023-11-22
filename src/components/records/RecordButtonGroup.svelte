<script lang="ts">
  import type { RecordInstance } from "$lib/domain/RecordInstance"
  import { faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let startEdit: (record: RecordInstance) => void
  export let recordInstance: RecordInstance
  let classList = ""
  export { classList as class }
</script>

<div class={"gap-2 items-center " + classList}>
  {#if recordInstance.checked}
    <div class="flex text-success items-center gap-1">
      <Fa icon={faCheck} />
      OK
    </div>
  {:else}
    <button
      type="button"
      class="btn btn-sm btn-outline btn-square btn-success"
      title="Goedkeuren"
    >
      <Fa icon={faCheck} />
    </button>
  {/if}
  <button
    type="button"
    class="btn btn-sm btn-outline btn-square btn-error"
    title="Verwijderen"
  >
    <Fa icon={faTrash} />
  </button>
  <button
    type="button"
    class="btn btn-sm btn-outline btn-square"
    title="Aanpassen"
    on:click={() => startEdit(recordInstance)}
  >
    <Fa icon={faPen} />
  </button>
</div>
