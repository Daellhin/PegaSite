<script lang="ts">
  import { goto } from "$app/navigation";
  import FormControlDate from "$components/formHelpers/FormControlDate.svelte";
  import FormControlEditor from "$components/formHelpers/FormControlEditor.svelte";
  import FormControlText from "$components/formHelpers/FormControlText.svelte";
  import { CalendarEvent } from "$lib/domain/CalendarEvent";
  import { authStore } from "$lib/stores/AuthStore";
  import { calendarEventStore } from "$lib/stores/CalendarEventStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import dayjs from "dayjs";

  let title = "";
  let info = "";
  let date: Date;
  let duration = "";
  let location = "";

  async function saveEvent() {
    const newCalendarEvent = new CalendarEvent(
      "-1",
      dayjs(date),
      duration,
      location,
      title,
      info
    );
    await calendarEventStore.addCalendarEvent(newCalendarEvent);
    pushCreatedToast("Event aangemaakt", {gotoUrl:`/events#${newCalendarEvent.id}`});
  }

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // Page title
  pageHeadStore.updatePageTitle("Nieuw event");
</script>

<h1 class="text-2xl font-bold">Nieuw event</h1>

<form class="flex flex-col gap-2" on:submit={saveEvent}>
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
    required
  />

  <FormControlText
    label="Locatie van event:"
    placeholder="Blauwenhoek 76, 1840 Londerzeel"
    bind:value={location}
    required
  />

  <FormControlEditor label="Info over event:" bind:value={info} />

  <button class="btn btn-primary btn-md mt-2 max-w-sm"> Event aanmaken </button>
</form>
