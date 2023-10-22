<script lang="ts">
  import CLEditor from "$components/formHelpers/CLEditor.svelte"
  import FullDuration from "$components/formHelpers/FullDuration.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import GeoAutoComplete from "$components/formHelpers/GeoAutoComplete.svelte"
  import Checkbox from "$components/formHelpers/Checkbox.svelte"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import type { Dayjs } from "dayjs"

  export let title = ""
  export let info = ""
  export let date: Dayjs
  export let endDate: Dayjs | undefined
  export let duration = ""
  export let location = ""

  export let submitLabel: string
  export let onSave: () => Promise<void>

  let multiDay = endDate !== undefined
  let endDateInner = endDate || date
  let saving = false
  let formError = ""

  $: endDate = multiDay ? endDateInner : undefined

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
    label="Titel van event:"
    placeholder="Titel"
    bind:value={title}
    required
  />
  <Input
    type="date"
    label={multiDay ? "Startdatum van event:" : "Datum van event:"}
    bind:value={date}
    required
  />
  <Checkbox label="Meerdaags event" bind:value={multiDay} />
  {#if multiDay}
    <Input
      type="date"
      label="Einddatum van event:"
      bind:value={endDateInner}
      required
    />
  {/if}
  <FullDuration
    label="Duur van event:"
    bind:value={duration}
    required
  />
  <GeoAutoComplete label="Locatie van event:" bind:value={location} />
  <CLEditor label="Info over event:" bind:value={info} />

  <button class="btn btn-primary mt-2 max-w-sm" type="submit" disabled={saving}>
    {submitLabel}
    <span class="loading loading-ring" class:hidden={!saving} />
  </button>
  <p class="text-error">{formError}</p>
</form>
