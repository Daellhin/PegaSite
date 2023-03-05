<script lang="ts">
  import { EVENTS_JSON } from "../data/eventsJson";
  import { Event } from "./../lib/event";

  export const amountOfEvents = 4;

  const events = EVENTS_JSON.map(Event.fromJSON)
    // .sort((e) => e.date.unix())
    // .reverse()
    .slice(0, amountOfEvents);
</script>

<h1 class="text-2xl font-bold mb-2">Kalender</h1>

<div class="flex flex-col gap-2">
  {#each events as event}
    <a
      href="/"
      class="btn btn-ghost px-4 py-1 h-auto text-start normal-case justify-start bg-base-200 hover:bg-base-300 custom-dark-hover"
    >
      <div class="flex flex-row j">
        <div class="flex flex-col mr-3">
          <div
            class="flex justify-center text-xs font-semibold text-gray-500 uppercase"
          >
            {event.formatedMonth}
          </div>
          <div class="flex justify-center text-2xl font-bold">
            {event.date.date()}
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-xs font-semibold">{event.duration}</div>
          <div class="flex items-center h-full text-lg font-semibold">
            {event.title}
          </div>
        </div>
      </div>
    </a>
  {/each}
</div>

<style>
  @media (prefers-color-scheme: dark) {
    .custom-dark-hover:hover {
      background-color: #313741 !important;
    }
  }
</style>
