<script lang="ts">
  import Checkbox from "$components/formHelpers/Checkbox.svelte"
  import CLEditor from "$components/formHelpers/CLEditor.svelte"
  import Dropzone from "$components/formHelpers/Dropzone.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import MultiSelect from "$components/formHelpers/MultiSelect.svelte"
  import { CategoryValues } from "$lib/domain/Category"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import type { UploadProgress } from "$lib/utils/UploadProgress"

  export let title = ""
  export let visible = true
  export let combinedImages: (string | File)[] = []
  export let tags: string[] = []
  export let content = ""

  export let submitLabel: string
  export let onSave: () => Promise<void>
  export let progress: UploadProgress[]
  export let newArticle: boolean

  let saving = false
  let errorMessage = ""

  async function onSubmitWrapper(event: SubmitEvent) {
    event.preventDefault()
    saving = true
    errorMessage = ""
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
    label="Titel van bericht:"
    placeholder="Titel"
    bind:value={title}
    required
  />
  <Checkbox label="Zichtbaar" bind:value={visible} />

  <Dropzone
    label="Afbeeldingen:"
    bind:combinedImages
    showDiskSize={newArticle}
    {progress}
  />
  <MultiSelect
    label="Categorieën:"
    bind:values={tags}
    options={CategoryValues}
  />
  <CLEditor label="Inhoud van artikel:" bind:value={content} />

  <div class="w-fit" class:hover:cursor-wait={saving}>
    <button
      class="btn btn-primary mt-2 max-w-sm"
      type="submit"
      disabled={saving}
    >
      {submitLabel}
      <span class="loading loading-ring" class:hidden={!saving}></span>
    </button>
  </div>
  {#if errorMessage}
    <p class="text-error">{errorMessage}</p>
  {/if}
</form>
