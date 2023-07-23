<script lang="ts">
  export let confirmModalID = "confirmModalID"
  export let showModal = false
  export let onConfirm: () => void
</script>

<input
  type="checkbox"
  id={confirmModalID}
  bind:checked={showModal}
  class="modal-toggle"
/>
<label for={confirmModalID} class="modal cursor-pointer">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Bevestigen</h3>
    <p class="py-4">
      <slot />
    </p>
    <div class="modal-action">
      <button class="btn btn-primary" on:click={onConfirm}>Verwijderen</button>
      <button class="btn" on:click={() => (showModal = false)}>
        Annuleren
      </button>
    </div>
  </div>
</label>
