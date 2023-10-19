<script lang="ts">
  import Dropzone from "$components/formHelpers/Dropzone.svelte"
  import CLEditor from "$components/formHelpers/CLEditor.svelte"
  import Input from "$components/formHelpers/Input.svelte"

  export let title = ""
  export let content = ""
  export let combinedImages: (string | File)[] = []

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
  <Input
    type="text"
    label="Titel van pagina:"
    placeholder="Titel"
    value={title}
    required
  />
  <Dropzone label="Afbeeldingen:" bind:combinedImages />
  <CLEditor label="Inhoud van bericht:" bind:value={content} />

  <button class="btn btn-primary mt-2 max-w-sm" type="submit" disabled={saving}>
    {submitLabel}
    <span class="loading loading-dots" class:hidden={!saving} />
  </button>
</form>
