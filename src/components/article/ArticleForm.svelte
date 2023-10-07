<script lang="ts">
  import FormControlDropzone from "$components/formHelpers/FormControlDropzone.svelte"
  import FormControlEditor from "$components/formHelpers/FormControlEditor.svelte"
  import FormControlMultiSelect from "$components/formHelpers/FormControlMultiSelect.svelte"
  import FormControlText from "$components/formHelpers/FormControlText.svelte"
  import { CategoryValues } from "$lib/domain/Category"

  export let title = ""
  export let content = ""
  export let combinedImages: (string | File)[] = []
  export let tags: string[] = []

  export let submitLabel: string
  export let onSave: () => Promise<void>

  let saving = false

  async function onSubmitWrapper(event: SubmitEvent) {
    event.preventDefault()
    saving = true
    await onSave()
    saving = false
  }
</script>

<form class="flex flex-col gap-2" on:submit={onSubmitWrapper}>
  <FormControlText
    label="Titel van bericht:"
    placeholder="Titel"
    value={title}
    required
  />
  <FormControlDropzone label="Afbeeldingen:" bind:values={combinedImages} />
  <FormControlMultiSelect
    label="Categorieën:"
    bind:values={tags}
    options={CategoryValues}
  />
  <FormControlEditor label="Inhoud van artikel:" bind:value={content} />

  <button class="btn btn-primary mt-2 max-w-sm" type="submit" disabled={saving}>
    {submitLabel}
    <span class="loading loading-ring" class:hidden={!saving} />
  </button>
</form>
