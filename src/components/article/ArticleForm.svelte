<script lang="ts">
  import Checkbox from "$components/formHelpers/Checkbox.svelte"
  import CLEditor from "$components/formHelpers/CLEditor.svelte"
  import Dropzone from "$components/formHelpers/Dropzone.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import MultiSelect from "$components/formHelpers/MultiSelect.svelte"
  import { CategoryValues } from "$lib/domain/Category"
  import { handleFirebaseError } from "$lib/utils/Firebase"

  export let title = ""
  export let content = ""
  export let combinedImages: (string | File)[] = []
  export let tags: string[] = []
  export let visible = true

  export let submitLabel: string
  export let onSave: () => Promise<void>

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
    value={title}
    required
  />
  <Checkbox label="Zichtbaar" bind:value={visible} />

  <Dropzone label="Afbeeldingen:" bind:combinedImages />
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
      <span class="loading loading-ring" class:hidden={!saving} />
    </button>
  </div>
  {#if errorMessage}
    <p class="text-error">{errorMessage}</p>
  {/if}
</form>
