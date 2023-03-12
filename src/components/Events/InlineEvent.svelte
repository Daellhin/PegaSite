<script lang="ts">
  import type { Event } from "$lib/event";
  import MdLocationOn from "svelte-icons/md/MdLocationOn.svelte";

  export let event: Event;
</script>

<div class="flex flex-col gap-6 sm:ml-5" id={event.id}>
  <div class="flex">
    <div class="flex flex-col items-center sm:mr-10 mr-4">
      <div class="text-sm font-semibold text-gray-500 uppercase">
        {event.shortDay}
      </div>
      <div class="text-3xl font-bold w-9 text-center">{event.date.date()}</div>
    </div>
    <div class="flex flex-col">
      <div class="text-sm font-semibold">{event.duration}</div>
      <div class="sm:text-3xl text-2xl font-semibold text-primary">
        {event.title}
      </div>
      {#if event.location}
        <div class="flex items-center">
          <div class="w-5 h-5"><MdLocationOn /></div>
          <div class="font-semibold text-sm sm:text-md">{event.location}</div>
        </div>
      {/if}
      {#if event.info}
        <div class="max-w-xl mt-1.5">{event.info}</div>
      {/if}
    </div>
  </div>
</div>
