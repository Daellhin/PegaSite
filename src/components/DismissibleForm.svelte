<script lang="ts">
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { faXmark } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let showForm: boolean
  export let onSubmit: () => Promise<void>
  export let submitLabel: string
  export let errorMessage = ""
  export let onDismiss: () => void = () => {}

  let saving = false

  async function onSubmitWrapper(event: SubmitEvent) {
    event.preventDefault()
    saving = true
    errorMessage = ""
    try {
      await onSubmit()
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
    saving = false
  }
  function dismissForm() {
    showForm = false
    onDismiss()
  }
</script>

<form
  on:submit={onSubmitWrapper}
  class="relative mb-3 border-base-300 bg-base-200 rounded-tr-box min-h-[6rem] min-w-[18rem] border bg-cover bg-top p-4 rounded-box overflow-visible"
>
  <button
    class="btn btn-ghost btn-sm absolute right-2 top-2 font-bold btn-square"
    title="sluiten"
    type="button"
    on:click={dismissForm}
  >
    <Fa icon={faXmark} size="lg" />
  </button>

  <div class="flex flex-wrap gap-2">
    <slot />
  </div>

  <div class="mt-3">
    <div class="w-fit" class:hover:cursor-wait={saving}>
      <button
        class="btn btn-primary mt-2 max-w-xs w-full md:w-auto"
        type="submit"
        disabled={saving}
      >
        {submitLabel}
        <span class="loading loading-ring" class:hidden={!saving} />
      </button>
    </div>
  </div>
  {#if errorMessage}
    <p class="text-error">{errorMessage}</p>
  {/if}
</form>
