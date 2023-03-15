import { browser } from '$app/environment'
import { Event } from "$lib/event"
import { writable } from 'svelte/store'
import { EVENTS_JSON } from '../../data/eventsJson'

function createEventStore() {
  const store = writable([] as Event[], set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const unsubscribe = () => { }

    async function init() {
      if (browser) {
        const events = EVENTS_JSON.map(Event.fromJSON)
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