
import { browser } from '$app/environment'
import { CalendarEvent, calendarEventConverter } from '$lib/domain/CalendarEvent'
import { Collections } from '$lib/firebase/firebase'
import dayjs from 'dayjs'
import { writable } from 'svelte/store'

function createCalendarEventStore() {
  const store = writable<CalendarEvent[]>(undefined, set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const unsubscribe = () => { }

    async function init() {
      if (browser) {
        // const calendarEvents = EVENTS_JSON.map(CalendarEvent.fromJson)

        // -- Load CalendarEvents --
        const { firebaseApp } = await import('$lib/firebase/firebase')
        const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore')
        const firestore = getFirestore(firebaseApp)

        const queryResult = query(
          collection(firestore, Collections.CALENDAR_EVENTS),
          where("date", ">=", dayjs().startOf('day').toDate())
        ).withConverter(calendarEventConverter)
        const snapshot = await getDocs(queryResult)

        // -- Set store --
        const calendarEvents = snapshot.docs.map(e => e.data())
        set(calendarEvents)
      }
    }
    init()

    return unsubscribe
  })
  const { subscribe, update } = store

  async function addCalendarEvent(newCalendarEvent: CalendarEvent) {
    if (!browser) {
      console.error("Why are you adding a calendarEvent from the server")
      return
    }

    // -- Update event --
    const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const newDocRef = doc(
      collection(firestore, Collections.CALENDAR_EVENTS)
    ).withConverter(calendarEventConverter)
    newCalendarEvent.id = newDocRef.id
    await setDoc(newDocRef, newCalendarEvent)

    // -- Update store --
    update((articles) => {
      return [...articles, newCalendarEvent].sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))
    });
  }

  async function removeCalendarEvent(calendarEvent: CalendarEvent) {
    if (!browser) {
      console.error("Why are you removing a calendarEvent from the server")
      return
    }
    // -- Remove article --
    const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    await deleteDoc(doc(firestore, Collections.CALENDAR_EVENTS, calendarEvent.id))

    // -- Remove from store --
    update((articles) => (articles.filter((e) => e.id !== calendarEvent.id)))
  }

  return {
    subscribe,
    addCalendarEvent,
    removeCalendarEvent
  }
}

export const calendarEventStore = createCalendarEventStore()
