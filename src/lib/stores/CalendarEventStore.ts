
import { browser } from '$app/environment'
import { CalendarEvent } from "$lib/domain/CalendarEvent"
import { writable } from 'svelte/store'
import { EVENTS_JSON } from '$data/CalendarEventsJson'


function createCalendarEventStore() {
  const store = writable([] as CalendarEvent[], set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const unsubscribe = () => { }

    async function init() {
      if (browser) {
        const events = EVENTS_JSON.map(CalendarEvent.fromJSON)
        set(events)
      }
    }
    init()

    return unsubscribe
  })
  const { subscribe, update } = store

  async function addCalendarEvent(newCalendarEvent: CalendarEvent) {
    if (!browser) {
      console.error("Why are you adding an event from the server")
      return
    }

    // -- Update store --
    update((articles) => {
      return [...articles, newCalendarEvent].sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))
    });
  }

  return {
    subscribe,
    addCalendarEvent
  }
}

export const calendarEventStore = createCalendarEventStore()
