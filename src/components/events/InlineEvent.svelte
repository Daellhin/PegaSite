<script lang="ts">
  import EditDropdown from "$components/EditDropdown.svelte";
  import type { CalendarEvent } from "$lib/domain/CalendarEvent";
  import { authStore } from "$lib/stores/AuthStore";
  import { calendarEventStore } from "$lib/stores/CalendarEventStore";
  import MdLocationOn from "svelte-icons/md/MdLocationOn.svelte";

  export let event: CalendarEvent;

  async function removeCalendarEvent() {
    await calendarEventStore.removeCalendarEvent(event);
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
    <div class="text-sm font-semibold">{event.duration}</div>
    <div class="flex w-full">
      <div class="sm:text-3xl text-2xl font-semibold text-primary">
        {event.title}
      </div>
      {#if $authStore}
        <div class="ml-auto">
          <EditDropdown editUrl="/todo" deleteHandler={removeCalendarEvent} />
        </div>
      {/if}
    </div>

    {#if event.location}
      <div class="flex items-center">
        <div class="w-5 h-5"><MdLocationOn /></div>
        <div class="font-semibold text-sm sm:text-md">{event.location}</div>
      </div>
    {/if}
    {#if event.info}
      <div class="max-w-xl mt-1.5">{@html event.info}</div>
    {/if}
  </div>
</div>

<style lang="postcss">
  @import "../../css/usercontent.postcss";
</style>
