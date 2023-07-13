<script lang="ts">
  import { goto } from "$app/navigation";
  import EventForm from "$components/events/EventForm.svelte";
  import type { CalendarEvent } from "$lib/domain/CalendarEvent";
  import { authStore } from "$lib/stores/AuthStore";
  import { calendarEventStore } from "$lib/stores/CalendarEventStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import type { Dayjs } from "dayjs";
  import type { PageData } from "./$types";

  export let data: PageData;

  let title = "";
  let info = "";
  let date: Dayjs;
  let duration = "";
  let location = "";

  let calendarEvent: CalendarEvent | undefined | null;

  async function saveEvent() {
    await calendarEventStore.editCalendarEvent(
      title,
      info,
      date,
      duration,
      location,
      calendarEvent!
    );
    pushCreatedToast("Event aangepast", {
      gotoUrl: `/events#${calendarEvent!.id}`,
    });
  }

  // -- Data loading --
  let haveValuesBeenSet = false;
  $: $calendarEventStore && loadCalendarEvent(data);
  $: if (!haveValuesBeenSet && calendarEvent) setValues(calendarEvent);

  async function loadCalendarEvent(data: PageData) {
    calendarEvent = calendarEventStore.getCalendarEventById(data.id);
  }
  function setValues(calendarEvent: CalendarEvent) {
    title = calendarEvent.title;
    info = calendarEvent.info;
    date = calendarEvent.date;
    duration = calendarEvent.duration;
    location = calendarEvent.location;
    haveValuesBeenSet = true;
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // -- Page title --
  pageHeadStore.updatePageTitle("Event aanpassen");
</script>

<h1 class="text-2xl font-bold">Event aanpassen</h1>

{#if calendarEvent}
  <EventForm
    bind:title
    bind:info
    bind:date
    bind:duration
    bind:location
    buttonTitle="Event aanpassen"
    onSave={saveEvent}
  />
{/if}
