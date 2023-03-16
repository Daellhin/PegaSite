import { browser } from '$app/environment'
import { CalendarEvent } from "$lib/calendar-event"
import { writable } from 'svelte/store'
import { EVENTS_JSON } from '../../data/calendarEventsJson'

function createEventStore() {
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

  return { subscribe }
}

export const eventStore = createEventStore()
