<script lang="ts">
  import { goto } from "$app/navigation";
  import EventForm from "$components/events/EventForm.svelte";
  import { CalendarEvent } from "$lib/domain/CalendarEvent";
  import { authStore } from "$lib/stores/AuthStore";
  import { calendarEventStore } from "$lib/stores/CalendarEventStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import type { Dayjs } from "dayjs";

  let title = "";
  let info = "";
  let date: Dayjs;
  let duration = "";
  let location = "";

  async function saveEvent() {
    const newCalendarEvent = new CalendarEvent(
      "-1",
      date,
      duration,
      location,
      title,
      info
    );
    await calendarEventStore.createCalendarEvent(newCalendarEvent);
    pushCreatedToast("Event aangemaakt", {
      gotoUrl: `/events#${newCalendarEvent.id}`,
    });
  }

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // Page title
  pageHeadStore.updatePageTitle("Nieuw event");
</script>

<h1 class="text-2xl font-bold">Nieuw event</h1>

<EventForm
  bind:title
  bind:info
  bind:date
  bind:duration
  bind:location
  onSave={saveEvent}
  buttonTitle="Event aanmaken"
/>
