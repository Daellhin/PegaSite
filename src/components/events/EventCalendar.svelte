<script lang="ts">
  import { calendarEventStore } from "$lib/stores/CalendarEventStore"

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
        <a
          href="/events#{event.id}"
          class="btn btn-ghost px-4 py-1 h-auto text-start normal-case justify-start bg-base-200 hover:bg-base-300 custom-dark-hover"
        >
          <div class="flex flex-row">
            <div class="flex flex-col mr-3">
              <div
                class="flex justify-center text-xs font-semibold text-gray-500 uppercase"
              >
                {event.abbreviatedMonth}
              </div>
              <div class="flex justify-center text-2xl font-bold">
                {event.date.date()}
              </div>
            </div>
            <div class="flex flex-col">
              <div class="text-xs font-semibold">
                {event.date.locale("nl-be").format("DD/MM")}
                {#if event.endDate}
                  tot
                  {event.endDate.locale("nl-be").format("DD/MM")}
                {/if}
                <span class="font-bold">|</span>
                {event.formattedDuration}
              </div>
              <div class="flex items-center h-full text-lg font-semibold">
                {event.title}
              </div>
            </div>
          </div>
        </a>
      {:else}
        Geen events gepland
      {/each}
    {:else}
      Loading
    {/if}
  </div>
</div>

<style>
  @media (prefers-color-scheme: dark) {
    .custom-dark-hover:hover {
      background-color: #313741 !important;
    }
  }
</style>
