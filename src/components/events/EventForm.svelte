<script lang="ts">
  import FormControlDate from "$components/formHelpers/FormControlDate.svelte";
  import FormControlEditor from "$components/formHelpers/FormControlEditor.svelte";
  import FormControlFullDuration from "$components/formHelpers/FormControlFullDuration.svelte";
  import FormControlText from "$components/formHelpers/FormControlText.svelte";
  import InputCheckbox from "$components/formHelpers/inputs/InputCheckbox.svelte";
  import type { Dayjs } from "dayjs";

  export let buttonTitle: string;

  export let title = "";
  export let info = "";
  export let date: Dayjs;
  export let endDate: Dayjs | undefined;
  export let duration = "";
  export let location = "";
  export let onSave: () => void;

  let multiDay = endDate !== undefined;
  let endDateInner = endDate || date;

  $: endDate = multiDay ? endDateInner : undefined;
</script>

<form class="flex flex-col gap-2" on:submit={onSave}>
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

  <FormControlText
    label="Locatie van event:"
    placeholder="Blauwenhoek 76, 1840 Londerzeel"
    bind:value={location}
  />
  <FormControlEditor label="Info over event:" bind:value={info} />

  <button class="btn btn-primary btn-md mt-2 max-w-sm">{buttonTitle}</button>
</form>
