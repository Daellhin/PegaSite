import type { Dayjs } from 'dayjs';
import 'dayjs/locale/nl-be';

export interface CalendarEventJson {
    id: string
    date: Dayjs
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

    static fromJSON(json: CalendarEventJson) {
        return new CalendarEvent(
            json.id,
            json.date,
            json.duration,
            json.location,
            json.title,
            json.info
        )
    }

    // https://day.js.org/docs/en/display/format
    get abbreviatedMonth() {
        return this.date.locale("nl-be")
            .format("MMM")
            .replace('.', '');
    }
    get fullMonth() {
        return this.date.locale("nl-be")
            .format("MMMM")
            .replace('.', '');
    }
    get shortDay() {
        return this.date.locale("nl-be")
            .format("ddd")
            .replace('.', '');
    }
}