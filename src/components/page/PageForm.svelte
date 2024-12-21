<script lang="ts">
  import CLEditor from "$components/formHelpers/CLEditor.svelte"
  import Dropzone from "$components/formHelpers/Dropzone.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import type { UploadProgress } from "$lib/utils/UploadProgress"

  export let title = ""
  export let content = ""
  export let combinedImages: (string | File)[] = []

  export let submitLabel: string
  export let onSave: () => Promise<void>
  export let progress: UploadProgress[]

  let saving = false
  let errorMessage = ""

  async function onSubmitWrapper(event: SubmitEvent) {
    event.preventDefault()
    saving = true
    try {
      await onSave()
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
    saving = false
  }
</script>

<form class="flex flex-col gap-2" on:submit={onSubmitWrapper}>
  <Input
    type="text"
    label="Titel van pagina:"
    placeholder="Titel"
    value={title}
    required
  />
  <Dropzone label="Afbeeldingen:" bind:combinedImages {progress} />
  <CLEditor label="Inhoud van bericht:" bind:value={content} />

  <div class="w-fit" class:hover:cursor-wait={saving}>
    <button
      class="btn btn-primary mt-2 max-w-sm"
      type="submit"
      disabled={saving}
    >
      {submitLabel}
      <span class="loading loading-ring" class:hidden={!saving} />
    </button>
  </div>
  {#if errorMessage}
    <p class="text-error">{errorMessage}</p>
  {/if}
</form>
