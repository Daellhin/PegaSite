<script lang="ts">
  import Dropzone from "$components/formHelpers/Dropzone.svelte"
  import CLEditor from "$components/formHelpers/CLEditor.svelte"
  import MultiSelect from "$components/formHelpers/MultiSelect.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import { CategoryValues } from "$lib/domain/Category"
  import { handleFirebaseError } from "$lib/utils/Firebase"

  export let title = ""
  export let content = ""
  export let combinedImages: (string | File)[] = []
  export let tags: string[] = []

  export let submitLabel: string
  export let onSave: () => Promise<void>

  let saving = false
  let formError = ""

  async function onSubmitWrapper(event: SubmitEvent) {
    event.preventDefault()
    saving = true
    formError = ""
    try {
      await onSave()
    } catch (error) {
      formError = handleFirebaseError(error)
    }
    saving = false
  }
</script>

<form class="flex flex-col gap-2" on:submit={onSubmitWrapper}>
  <Input
    type="text"
    label="Titel van bericht:"
    placeholder="Titel"
    value={title}
    required
  />
  <Dropzone label="Afbeeldingen:" bind:combinedImages />
  <MultiSelect
    label="Categorieën:"
    bind:values={tags}
    options={CategoryValues}
  />
  <CLEditor label="Inhoud van artikel:" bind:value={content} />

  <button class="btn btn-primary mt-2 max-w-sm" type="submit" disabled={saving}>
    {submitLabel}
    <span class="loading loading-ring" class:hidden={!saving} />
  </button>
  {#if formError}
    <p class="text-error">{formError}</p>
  {/if}
</form>
