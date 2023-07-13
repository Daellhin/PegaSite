<script lang="ts">
  import FormControlDate from "$components/formHelpers/FormControlDate.svelte";
  import FormControlEditor from "$components/formHelpers/FormControlEditor.svelte";
  import FormControlText from "$components/formHelpers/FormControlText.svelte";
  import type { Dayjs } from "dayjs";

  export let buttonTitle: string;

  export let title = "";
  export let info = "";
  export let date: Dayjs;
  export let duration = "";
  export let location = "";
  export let onSave: () => void;
</script>

<form class="flex flex-col gap-2" on:submit={onSave}>
  <FormControlText
    label="Titel van event:"
    placeholder="Titel"
    bind:value={title}
    required
  />
  <FormControlDate label="Datum van event:" bind:value={date} required />
  <FormControlText
    label="Duur van event:"
    placeholder="00:00 - 00:00"
    bind:value={duration}
  />
  <FormControlText
    label="Locatie van event:"
    placeholder="Blauwenhoek 76, 1840 Londerzeel"
    bind:value={location}
  />
  <FormControlEditor label="Info over event:" bind:value={info} />

  <button class="btn btn-primary btn-md mt-2 max-w-sm">{buttonTitle}</button>
</form>
