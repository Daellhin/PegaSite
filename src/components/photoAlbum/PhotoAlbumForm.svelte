<script lang="ts">
  import Checkbox from "$components/formHelpers/Checkbox.svelte"
  import Dropzone from "$components/formHelpers/Dropzone.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import InfoCard from "$components/alerts/InfoCard.svelte"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import type { UploadProgress } from "$lib/utils/UploadProgress"
  import type { Dayjs } from "dayjs"
  import { onMount } from "svelte"
    import SuccesCard from "$components/alerts/SuccesCard.svelte"

  export let title = ""
  export let combinedImages: (string | File)[] = []
  export let visible = true
  export let author = ""
  export let authorUrl = ""
  export let date: Dayjs

  export let submitLabel: string
  export let onSave: () => Promise<void>
  export let progress: UploadProgress[]
  export let stopAfterSave = false
  export let savedMessage = ""

  let saving = false
  let errorMessage = ""
  let amountSaved = 0

  async function onSubmitWrapper(event: SubmitEvent) {
    event.preventDefault()
    saving = true
    errorMessage = ""
    try {
      await onSave()
      amountSaved++
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
    saving = false
  }

  // -- Prevent user accidentally leaving page when form is saving --
  onMount(() => {
    window.addEventListener("beforeunload", (e) => {
      if (saving) {
        e.preventDefault()
      }
    })
  })
</script>

<form class="flex flex-col gap-2" on:submit={onSubmitWrapper}>
  <Input
    type="text"
    label="Titel van album:"
    placeholder="Titel"
    bind:value={title}
    required
  />
  <Checkbox label="Zichtbaar" bind:value={visible} />
  <Input type="date" label="Datum van album:" bind:value={date} required />

  <Input
    type="text"
    label="Naam van fotograaf:"
    placeholder="Naam"
    bind:value={author}
  />
  <Input
    type="text"
    label="Link van fotograaf:"
    placeholder="Link"
    bind:value={authorUrl}
  />

  <Dropzone
    label="Afbeeldingen:"
    bind:combinedImages
    required
    disablePreviews
    {progress}
    saving={saving || (stopAfterSave && amountSaved >= 1)}
  />

  {#if stopAfterSave && amountSaved >= 1}
    <SuccesCard class="w-auto max-w-sm mt-2">
      {savedMessage}
    </SuccesCard>
  {:else}
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
  {/if}

  {#if errorMessage}
    <p class="text-error">{errorMessage}</p>
  {/if}
</form>
