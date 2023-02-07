import type { Dayjs } from 'dayjs';
import 'dayjs/locale/nl-be';

export interface EventJson {
    date: Dayjs
    duration: string
    title: string
}

export class Event {
    constructor(
        public date: Dayjs,
        public duration: string,
        public title: string
    ) { }

    static fromJSON(json: EventJson) {
        return new Event(
            json.date,
            json.duration,
            json.title
        )
    }

    get formatedMonth() {
        return this.date.locale("nl-be")
            .format("MMM")
            .replace('.', '');
    }
}