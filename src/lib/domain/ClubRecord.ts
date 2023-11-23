import { AthleticEvent } from './dataClasses/AthleticEvent'
import { Category } from './dataClasses/Category'
import { Discipline } from './dataClasses/Discipline'
import { Gender } from './dataClasses/Gender'
import { RecordInstance, type RecordInstanceJson } from './RecordInstance'

export interface ClubRecordJson {
	discipline: string
	category: string
	gender: string
	athleticEvent: string
	records: RecordInstanceJson[]
}

export class ClubRecord {
	public searchableString: string

	constructor(
		public discipline: Discipline,
		public category: Category,
		public gender: Gender,
		public athleticEvent: AthleticEvent,
		public records: RecordInstance[]
	) {
		records.sort((a, b) => (a.date?.isBefore(b.date) ? 1 : -1))
		this.searchableString = `${discipline.getAllNames().join("")} ${category.getAllNames().join("")} ${gender.getAllNames().join("")} ${athleticEvent} ${records.map((e) => e.searchableString)}`.toLowerCase()
	}

	hasPreviousRecords() {
		return this.records.length > 1
	}

	/**
	 * Checks if clubrecords matches a search string
	 * - if searchString is undefined, matches all
	 */
	matchesSearchString(searchString: string) {
		if (!searchString) return true
		return !searchString
			.toLowerCase()
			.split(" ")
			.map((keyword) => this.searchableString.includes(keyword))
			.includes(false)
	}

	isOfType(discipline: Discipline, category: Category, gender: Gender, athleticEvent: AthleticEvent) {
		return this.discipline === discipline &&
			this.category === category &&
			this.gender === gender &&
			this.athleticEvent === athleticEvent
	}

	static fromJSON(json: ClubRecordJson): ClubRecord {
		try {
			return new ClubRecord(
				Discipline.match(json.discipline),
				Category.match(json.category),
				Gender.match(json.gender),
				AthleticEvent.match(json.athleticEvent),
				json.records.map(RecordInstance.fromJSON)
			)
		} catch (error) {
			console.error("Error while convertering json", json)
			throw error
		}
	}

	static fromFirebaseData(toMap: any) {
		const json = Object.keys(toMap).flatMap((gender) => {
			return Object.keys(toMap[gender]).flatMap((athleticEvent) => {
				return Object.keys(toMap[gender][athleticEvent]).flatMap((discipline) => {
					return Object.keys(toMap[gender][athleticEvent][discipline]).flatMap((category) => {
						const records = toMap[gender][athleticEvent][discipline][category] as RecordInstanceJson[]
						return { discipline, category, gender, athleticEvent, records } as ClubRecordJson
					})
				})
			})
		})
		return json.map(this.fromJSON)
	}
}

export function filterRecordsWithType(clubRecords: ClubRecord[], category: Category, gender: Gender, athleticEvent: AthleticEvent) {
	return clubRecords.filter((e) =>
		e.category === category &&
		e.gender === gender &&
		e.athleticEvent === athleticEvent
	)
}

export function constructMapWithCategory(clubRecords: ClubRecord[], category: Category) {
	if (!clubRecords) {
		return undefined
	}
	return new Map([
		["Vrouwen indoor", filterRecordsWithType(clubRecords, category, Gender.Female, AthleticEvent.Indoor)],
		["Mannen indoor", filterRecordsWithType(clubRecords, category, Gender.Male, AthleticEvent.Indoor)],
		["Vrouwen outdoor", filterRecordsWithType(clubRecords, category, Gender.Female, AthleticEvent.Outdoor)],
		["Mannen outdoor", filterRecordsWithType(clubRecords, category, Gender.Male, AthleticEvent.Outdoor)],
	])
}
