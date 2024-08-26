import { CALENDAR_EVENT_JSON } from '$data/CalendarEventsJson'
import { CalendarEvent } from '$lib/domain/CalendarEvent'
import type { Dayjs } from 'dayjs'
import { get, writable } from 'svelte/store'

export function createMockCalendarEventStore() {
    const store = writable<CalendarEvent[]>(CALENDAR_EVENT_JSON.map(CalendarEvent.fromJson))
    const { subscribe, update } = store

    async function createCalendarEvent(newCalendarEvent: CalendarEvent) {
        update((calendarEvents) => {
            return [...calendarEvents, newCalendarEvent].sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1))
        })
    }
    async function getCalendarEventById(id: string) {
        const calendarEvents = get(store)
        return calendarEvents.find((e) => e.id === id)
    }
    async function updateCalendarEvent(newTitle: string, newInfo: string, newDate: Dayjs, newDuration: string, newLocation: string, endDate: Dayjs | undefined, calendarEvent: CalendarEvent) {
        calendarEvent.title = newTitle
        calendarEvent.info = newInfo
        calendarEvent.date = newDate
        calendarEvent.duration = newDuration
        calendarEvent.location = newLocation
        calendarEvent.endDate = endDate
        update((calendarEvents) => [...calendarEvents])
    }
    async function deleteCalendarEvent(calendarEvent: CalendarEvent) {
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
