<script lang="ts">
  import { eventStore } from "$lib/stores/event-store";
  import { groupBy } from "$lib/utils/utils";
  import InlineEvent from "../../components/Events/InlineEvent.svelte";

  $: groupedEvents = groupBy(
    $eventStore,
    (event) => `${event.date.year()}${event.date.month()}`
  );
</script>

<h1 class="text-2xl font-bold mb-2">Events</h1>

<div class="sm:mx-10">
  {#each [...groupedEvents] as [_key, events]}
    <div class="mb-4">
      <div class="flex">
        <div class="min-w-fit font-semibold">
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
  {/each}
</div>
