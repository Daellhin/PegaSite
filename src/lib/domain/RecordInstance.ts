import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import { Timestamp } from "firebase/firestore"
import customParseFormat  from "dayjs/plugin/customParseFormat"

export interface RecordInstanceJson {
    name: string
    result: string
    location: string
    date: Timestamp
    checked?: boolean
}

export class RecordInstance {
    public searchAbleString: string

    constructor(
        public name: string,
        public result: string,
        public location: string,
        public date: Dayjs,
        public checked: boolean = false
    ) {
        this.searchAbleString = `${name.toLowerCase()} ${result.toLowerCase()} ${location.toLowerCase()} ${date.format("DD/MM/YYYY").toLowerCase()}`
    }

    static fromJSON(json: RecordInstanceJson): RecordInstance {
        dayjs.extend(customParseFormat)
        let convertedDate = null;
        if (typeof(json.date) === "string") {
            convertedDate = dayjs(json.date, "DD/MM/YYYY")
        }else {
            convertedDate = dayjs(json.date.toMillis())
        }

        return new RecordInstance(
            json.name,
            json.result,
            json.location,
           convertedDate,
            json.checked || false
        );
    }

    toJSON(): RecordInstanceJson {
        return {
            name: this.name,
            result: this.result,
            location: this.location,
            date: Timestamp.fromDate(this.date.toDate()),
            checked: this.checked
        } as RecordInstanceJson;
    }
}
