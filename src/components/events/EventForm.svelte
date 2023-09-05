<script lang="ts">
  import FormControlDate from "$components/formHelpers/FormControlDate.svelte"
  import FormControlEditor from "$components/formHelpers/FormControlEditor.svelte"
  import FormControlFullDuration from "$components/formHelpers/FormControlFullDuration.svelte"
  import FormControlText from "$components/formHelpers/FormControlText.svelte"
  import GeoAutoComplete from "$components/formHelpers/inputs/GeoAutoComplete.svelte"
  import InputCheckbox from "$components/formHelpers/inputs/InputCheckbox.svelte"
  import type { Dayjs } from "dayjs"

  export let submitLabel: string

  export let title = ""
  export let info = ""
  export let date: Dayjs
  export let endDate: Dayjs | undefined
  export let duration = ""
  export let location = ""
  export let onSave: () => Promise<void>

  let multiDay = endDate !== undefined
  let endDateInner = endDate || date
  let saving = false

  $: endDate = multiDay ? endDateInner : undefined

  async function onSubmitWrapper(event: SubmitEvent) {
    event.preventDefault()
    saving = true
    await onSave()
    saving = false
  }
</script>

<form class="flex flex-col gap-2" on:submit={onSubmitWrapper}>
  <FormControlText
    label="Titel van event:"
    placeholder="Titel"
    bind:value={title}
    required
  />
  <FormControlDate
    label={multiDay ? "Startdatum van event:" : "Datum van event:"}
    bind:value={date}
    required
  />
  <InputCheckbox label="Meerdaags event" bind:value={multiDay} />
  {#if multiDay}
    <FormControlDate
      label="Enddatum van event:"
      bind:value={endDateInner}
      required
    />
  {/if}
  <FormControlFullDuration
    label="Duur van event:"
    bind:value={duration}
    required
  />
  <GeoAutoComplete label="Locatie van event:" bind:value={location} />
  <FormControlEditor label="Info over event:" bind:value={info} />

  <button class="btn btn-primary mt-2 max-w-sm" type="submit" disabled={saving}>
	{submitLabel}
	<span class="loading loading-ring" class:hidden={!saving} />
  </button>
</form>
