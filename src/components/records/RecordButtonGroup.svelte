<script lang="ts">
  import ConfirmModal from "$components/ConfirmModal.svelte"
  import type { RecordInstance } from "$lib/domain/RecordInstance"
  import { clubRecordStore } from "$lib/stores/ClubRecordStore"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let startEdit: (record: RecordInstance) => Promise<void>
  export let recordInstance: RecordInstance
  export let saving = false
  export let saveError = ""
  let classList = ""
  export { classList as class }

  const confirmModalID = "confirmRecordDelete"
  let showModal = false

  // -- Approve --
  async function approveRecord() {
    saving = true
    saveError = ""
    try {
      await clubRecordStore.approveRecordInstance(recordInstance)
    } catch (error) {
      saveError = handleFirebaseError(error)
    }
    saving = false
  }

  // -- Edit --
  async function startEditWrapper(record: RecordInstance) {
    saving = true
    saveError = ""
    try {
      await startEdit(record)
    } catch (error) {
      saveError = handleFirebaseError(error)
    }
    saving = false
  }

  // -- Delete --
  async function startDelete() {
    showModal = true
  }
  async function deleteRecord() {
    showModal = false
    saving = true
    saveError = ""
    try {
      await clubRecordStore.deleteRecordInstance(recordInstance)
    } catch (error) {
      saveError = handleFirebaseError(error)
    }
    saving = false
  }
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
      on:click={approveRecord}
    >
      <Fa icon={faCheck} />
    </button>
  {/if}
  <button
    type="button"
    class="btn btn-sm btn-outline btn-square btn-error"
    title="Verwijderen"
    on:click={startDelete}
  >
    <Fa icon={faTrash} />
  </button>
  <button
    type="button"
    class="btn btn-sm btn-outline btn-square"
    title="Aanpassen"
    on:click={() => startEditWrapper(recordInstance)}
  >
    <Fa icon={faPen} />
  </button>
</div>

<ConfirmModal {confirmModalID} onConfirm={deleteRecord} bind:showModal>
  Bent u zeker dat u het
  <span class="font-semibold">"{recordInstance.clubRecord?.discipline}"</span>
  record van <span class="font-semibold">"{recordInstance.name}"</span>
  met prestatie <span class="font-semibold">"{recordInstance.result}"</span>
  wilt verwijderen?
</ConfirmModal>
