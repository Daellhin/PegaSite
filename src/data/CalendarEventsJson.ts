import type { CalendarEventJson } from '$lib/domain/CalendarEvent'
import { Timestamp } from 'firebase/firestore'

export const CALENDAR_EVENT: CalendarEventJson = {
    id: "0",
    date: Timestamp.fromDate(new Date("2023-03-19")),
    duration: "10:30 - 12:00",
    location: "Blauwenhoek 76, 1840 Londerzeel",
    title: "Thematraining- Spurt",
    info: "",
    endDate: undefined
}


export const CALENDAR_EVENTS_JSON: CalendarEventJson[] = Array(5).fill(CALENDAR_EVENT)
    .map((e: CalendarEventJson) => {
        const newObj = Object.assign({}, e)
        newObj.id += 1
        return newObj
    })
    