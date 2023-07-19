<script lang="ts">
  import Collapse from "$components/Collapse.svelte";
  import EditDropdown from "$components/EditDropdown.svelte";
  import UserContentRenderer from "$components/UserContentRenderer.svelte";
  import type { CalendarEvent } from "$lib/domain/CalendarEvent";
  import { authStore } from "$lib/stores/AuthStore";
  import { calendarEventStore } from "$lib/stores/CalendarEventStore";
  import { faLocationDot, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";
  import MdLocationOn from "svelte-icons/md/MdLocationOn.svelte";

  export let event: CalendarEvent;

  async function removeCalendarEvent() {
    await calendarEventStore.deleteCalendarEvent(event);
  }
</script>

<div class="flex sm:ml-5" id={event.id}>
  <!-- Left column -->
  <div class="flex flex-col items-center sm:mr-10 mr-4">
    <div class="text-sm font-semibold text-gray-500 uppercase">
      {event.shortDay}
    </div>
    <div class="text-3xl font-bold w-9 text-center">
      {event.date.date()}
    </div>
  </div>

  <!-- Middle column -->
  <div class="flex flex-col w-full">
    <div class="text-sm font-semibold mb-[-6px]">
      {event.date.locale("nl-be").format("D MMMM")}
      {#if event.endDate}
        tot
        {event.endDate.locale("nl-be").format("D MMMM")}
      {/if}
      <span class="font-bold">|</span>
      {event.formattedDuration}
    </div>
    <div class="flex w-full items-center">
      <div class="sm:text-3xl text-2xl font-semibold text-primary">
        {event.title}
      </div>
      {#if $authStore}
        <div class="ml-auto">
          <EditDropdown
            editUrl={`/events/edit/${event.id}`}
            deleteHandler={removeCalendarEvent}
          />
        </div>
      {/if}
    </div>
    {#if event.info}
      <UserContentRenderer
        content={event.info}
        class="max-w-xl mb-1"
        placeHolder=""
        showLinks
      />
    {/if}

    {#if event.location}
      <Collapse>
        <div slot="title" class="flex flex-col text-start">
          <div class="font-semibold text-sm sm:text-md">
            {event.location}
          </div>
          <div class="flex items-center gap-1 text-xs">
            <Fa icon={faMapLocationDot} class="" />
            <div class="">Toon in Google Maps</div>
          </div>
        </div>
        <iframe
          src={`https://maps.google.com/maps?q=${event.location}&output=embed`}
          class="w-full"
          height="300"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Google Maps"
        />
      </Collapse>
    {/if}
  </div>
</div>
