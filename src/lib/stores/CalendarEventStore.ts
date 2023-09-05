import { browser } from '$app/environment'
import { CalendarEvent, calendarEventConverter } from '$lib/domain/CalendarEvent'
import { Collections } from '$lib/firebase/Firebase'
import { convertStringToBool } from '$lib/utils/Utils'
import dayjs, { Dayjs } from 'dayjs'
import { get, writable } from 'svelte/store'
import { createMockCalendarEventStore } from './mocks/MockCalendarEventStore'

function createCalendarEventStore() {
	const store = writable<CalendarEvent[]>(undefined, set => {
		async function init() {
			if (!browser) return

			// -- Load calendarEvents --
			const { firebaseApp } = await import('$lib/firebase/Firebase')
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

	async function createCalendarEvent(newCalendarEvent: CalendarEvent) {
		if (!browser) return

		// -- Update event --
		const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const newDocRef = doc(
			collection(firestore, Collections.CALENDAR_EVENTS)
		).withConverter(calendarEventConverter)
		newCalendarEvent.id = newDocRef.id
		await setDoc(newDocRef, newCalendarEvent)

		// -- Update store --
		update((calendarEvents) => {
			return [...calendarEvents, newCalendarEvent].sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))
		})
	}

	function getCalendarEventById(id: string) {
		if (!browser) return

		// -- Get calendarEvent --
		const calendarEvents = get(store)
		return calendarEvents.find((e) => e.id === id)
	}

	async function updateCalendarEvent(newTitle: string, newInfo: string, newDate: Dayjs, newDuration: string, newLocation: string, endDate: Dayjs | undefined, calendarEvent: CalendarEvent) {
		if (!browser) return

		// -- Update calendarEvent --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const calendarEventRef = doc(firestore, Collections.CALENDAR_EVENTS, calendarEvent.id)
		await updateDoc(calendarEventRef, {
			title: newTitle,
			info: newInfo,
			date: newDate.toDate(),
			duration: newDuration,
			location: newLocation,
			endDate: endDate ? endDate.toDate() : null
		})

		// -- Update store --
		calendarEvent.title = newTitle
		calendarEvent.info = newInfo
		calendarEvent.date = newDate
		calendarEvent.duration = newDuration
		calendarEvent.location = newLocation
		update((calendarEvents) => [...calendarEvents])
	}

	async function deleteCalendarEvent(calendarEvent: CalendarEvent) {
		if (!browser) return

		// -- Remove calendarEvent --
		const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		await deleteDoc(doc(firestore, Collections.CALENDAR_EVENTS, calendarEvent.id))

		// -- Remove from store --
		update((calendarEvents) => (calendarEvents.filter((e) => e.id !== calendarEvent.id)))
	}

	return {
		subscribe,
		createCalendarEvent,
		getCalendarEventById,
		updateCalendarEvent,
		deleteCalendarEvent,
	}
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
export const calendarEventStore = useMock ?
	createMockCalendarEventStore() :
	createCalendarEventStore()
