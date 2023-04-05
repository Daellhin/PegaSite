import { browser } from '$app/environment'
import { EVENTS_JSON } from '$data/CalendarEventsJson'
import { CalendarEvent, calendarEventConverter } from '$lib/domain/CalendarEvent'
import { Collections } from '$lib/firebase/firebase'
import { convertStringToBool } from '$lib/utils/Utils'
import dayjs from 'dayjs'
import { writable } from 'svelte/store'

function createMockCalendarEventStore() {
  const store = writable<CalendarEvent[]>(undefined, set => {
    const calendarEvents = EVENTS_JSON.map(CalendarEvent.fromJson)
    set(calendarEvents)
  })
  const { subscribe, update } = store

  async function addCalendarEvent(newCalendarEvent: CalendarEvent) {
    update((calendarEvents) => {
      return [...calendarEvents, newCalendarEvent].sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))
    });
  }
  async function removeCalendarEvent(calendarEvent: CalendarEvent) {
    update((calendarEvents) => (calendarEvents.filter((e) => e.id !== calendarEvent.id)))
  }

  return {
    subscribe,
    addCalendarEvent,
    removeCalendarEvent
  }
}

function createCalendarEventStore() {
  const store = writable<CalendarEvent[]>(undefined, set => {
    async function init() {
      if (!browser) return

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
    init()
  })
  const { subscribe, update } = store

  async function addCalendarEvent(newCalendarEvent: CalendarEvent) {
      if (!browser) return

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
    update((calendarEvents) => {
      return [...calendarEvents, newCalendarEvent].sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))
    });
  }

  async function removeCalendarEvent(calendarEvent: CalendarEvent) {
    if (!browser) return

    // -- Remove article --
    const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    await deleteDoc(doc(firestore, Collections.CALENDAR_EVENTS, calendarEvent.id))

    // -- Remove from store --
    update((calendarEvents) => (calendarEvents.filter((e) => e.id !== calendarEvent.id)))
  }

  return {
    subscribe,
    addCalendarEvent,
    removeCalendarEvent
  }
}

const useMock: boolean = convertStringToBool(import.meta.env.VITE_USEMOCKING);
export const calendarEventStore = useMock ?
  createMockCalendarEventStore :
  createCalendarEventStore()
