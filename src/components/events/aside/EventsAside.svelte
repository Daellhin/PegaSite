<script lang="ts">
  import { calendarEventStore } from "$lib/stores/CalendarEventStore"
  import EventsAsideRow from "./EventsAsideRow.svelte"
  import LoadingEventsAside from "./LoadingEventsAside.svelte"

  export const amountOfEvents = 4
</script>

<div>
  <div class="flex">
    <h1 class="text-2xl font-bold mb-2">Kalender</h1>
    <a class="ml-auto hover:link h-fit mt-auto mb-3 text-primary" href="/events"
      >Toon alle events</a
    >
  </div>
  <div class="flex flex-col gap-2">
    {#if $calendarEventStore}
      {#each $calendarEventStore.slice(0, amountOfEvents) as event}
        <EventsAsideRow {event} />
      {:else}
        Geen events gepland
      {/each}
    {:else}
      {#each Array(amountOfEvents) as _}
        <LoadingEventsAside />
      {/each}
    {/if}
  </div>
</div>
