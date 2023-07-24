<script lang="ts">
  import InlineEvent from "$components/events/InlineEvent.svelte"
  import { authStore } from "$lib/stores/AuthStore"
  import { calendarEventStore } from "$lib/stores/CalendarEventStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { groupBy } from "$lib/utils/Utils"

  $: groupedEvents = groupBy(
    $calendarEventStore,
    (event) => `${event.date.year()}${event.date.month()}`
  )

  // -- Page title --
  pageHeadStore.updatePageTitle("Events")
</script>

<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold">Events</h1>
  {#await authStore.known then _}
    {#if $authStore}
      <a class="btn btn-sm capitalize btn-primary" href="/events/new">
        Nieuw event
      </a>
    {/if}
  {/await}
</div>

<div class="sm:mx-10">
  {#if groupedEvents}
    {#each [...groupedEvents] as [_, events]}
      <div class="mb-4">
        <div class="flex">
          <div class="min-w-fit font-semibold text-xl">
            <span class="capitalize">{events[0].fullMonth}</span>
            {events[0].date.year()}
          </div>
          <hr class="my-auto ml-3 w-full h-[1.5px] bg-gray-200" />
        </div>
        <div class="flex flex-col gap-4 mt-2">
          {#each events as event}
            <InlineEvent {event} />
          {/each}
        </div>
      </div>
    {:else}
      Geen events gepland
    {/each}
  {:else}
    Loading
  {/if}
</div>
