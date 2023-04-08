import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/nl-be'
import { Timestamp, type FirestoreDataConverter } from 'firebase/firestore'

export interface CalendarEventJson {
    id: string
    date: Timestamp
    duration: string
    location: string
    title: string
    info: string
}

export class CalendarEvent {
    constructor(
        public id: string,
        public date: Dayjs,
        public duration: string,
        public location: string,
        public title: string,
        public info: string
    ) { }

    // https://day.js.org/docs/en/display/format
    get abbreviatedMonth() {
        return this.date.locale("nl-be")
            .format("MMM")
            .replace('.', '')
    }
    get fullMonth() {
        return this.date.locale("nl-be")
            .format("MMMM")
            .replace('.', '')
    }
    get shortDay() {
        return this.date.locale("nl-be")
            .format("ddd")
            .replace('.', '')
    }

    static fromJson(json: CalendarEventJson) {
        return new CalendarEvent(
            json.id,
            dayjs(json.date.toMillis()),
            json.duration,
            json.location,
            json.title,
            json.info
        )
    }

    toJson() {
        return {
            id: this.id,
            date: Timestamp.fromDate(this.date.toDate()),
            duration: this.duration,
            location: this.location,
            title: this.title,
            info: this.info
        } as CalendarEventJson
    }
}

/**
 * Firestore data converter
 * */
export const calendarEventConverter: FirestoreDataConverter<CalendarEvent> = {
    toFirestore: (article: CalendarEvent) => article.toJson(),
    fromFirestore: (snapshot, options) => CalendarEvent.fromJson(snapshot.data(options) as CalendarEventJson)
}