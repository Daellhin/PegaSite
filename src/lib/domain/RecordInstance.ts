import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import { Timestamp } from "firebase/firestore"

export interface RecordInstanceJson {
    name: string
    result: string
    location: string
    date: Timestamp | null
    checked: boolean
}

export class RecordInstance {
    public searchableString: string

    constructor(
        public name: string,
        public result: string,
        public location: string,
        public date?: Dayjs,
        public checked: boolean = false
    ) {
        this.searchableString = `${name.toLowerCase()} ${result.toLowerCase()} ${location.toLowerCase()} ${date?.format("DD/MM/YYYY").toLowerCase()}`
    }

    static fromJSON(json: RecordInstanceJson): RecordInstance {
        return new RecordInstance(
            json.name,
            json.result,
            json.location,
            json.date ? dayjs(json.date.toMillis()) : undefined,
            json.checked
        )
    }

    toJSON(): RecordInstanceJson {
        return {
            name: this.name,
            result: this.result,
            location: this.location,
            date: this.date ? Timestamp.fromDate(this.date.toDate()) : null,
            checked: this.checked
        } as RecordInstanceJson
    }
}
