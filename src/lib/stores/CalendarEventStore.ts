
import { browser } from '$app/environment'
import { EVENTS_JSON } from '$data/CalendarEventsJson'
import { CalendarEvent, calendarEventConverter } from "$lib/domain/CalendarEvent"
import { Collections } from '$lib/firebase/firebase'
import { writable } from 'svelte/store'

function createCalendarEventStore() {
  const store = writable([] as CalendarEvent[], set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const unsubscribe = () => { }

    async function init() {
      if (browser) {
        const events = EVENTS_JSON.map(CalendarEvent.fromJson)
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

    // -- Update event --
    const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const newDocRef = doc(collection(firestore, Collections.CALENDAR_EVENTS)).withConverter(calendarEventConverter)
    newCalendarEvent.id = newDocRef.id
    await setDoc(newDocRef, newCalendarEvent)

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
