<script lang="ts">
  import FormControlDropzoneOld from "$components/formHelpers/FormControlDropzoneOld.svelte"
  import FormControlEditor from "$components/formHelpers/FormControlEditor.svelte"
  import FormControlText from "$components/formHelpers/FormControlText.svelte"

  export let title = ""
  export let content = ""
  export let uploadedImages: File[] = []
  export let existingImages: string[]

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
    label="Titel van pagina:"
    placeholder="Titel"
    value={title}
    required
  />
  <FormControlDropzoneOld
    label="Afbeeldingen:"
    bind:uploadedImages
    bind:existingImages
  />
  <FormControlEditor label="Inhoud van bericht:" bind:value={content} />

  <button class="btn btn-primary mt-2 max-w-sm" type="submit" disabled={saving}>
    {submitLabel}
    <span class="loading loading-dots" class:hidden={!saving} />
  </button>
</form>
