import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import { Timestamp } from "firebase/firestore"
import type { ClubRecord } from "./ClubRecord"

export interface RecordInstanceJson {
	name: string
	result: string
	location: string
	date: Timestamp | null
	checked: boolean
}

export class RecordInstance {
	public searchableString: string
	public clubRecord: ClubRecord | undefined
	public extendedSearchableString: string | undefined

	constructor(
		public name: string,
		public result: string,
		public location: string,
		public date?: Dayjs,
		public checked: boolean = false
	) {
		this.searchableString = `${name} ${result} ${location} ${date?.format("DD/MM/YYYY")}`.toLowerCase()
	}

	linkClubrecord(clubRecord: ClubRecord) {
		this.clubRecord = clubRecord
		this.extendedSearchableString = `${clubRecord.discipline.getAllNames().join("")} ${clubRecord.category.getAllNames().join("")} ${clubRecord.gender.getAllNames().join("")} ${clubRecord.athleticEvent} ${this.name} ${this.result} ${this.location} ${this.date?.format("DD/MM/YYYY")}`.toLowerCase()
	}

	formattedDate() {
		return this.date ? this.date.format("DD/MM/YYYY") : "???"
	}

	/**
	 * Checks if recordInstance matches a search string
	 * !!! recordInstance must be linked to a clubrecord
	 * - if searchString is undefined, matches all
	 */
	matchesSearchString(searchString: string) {
		if (!this.extendedSearchableString) throw new Error("RecordInstance must be linked to a clubrecord")
		if (!searchString) return true
		return !searchString
			.toLowerCase()
			.split(" ")
			.map((keyword) => this.extendedSearchableString!.includes(keyword))
			.includes(false)
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
