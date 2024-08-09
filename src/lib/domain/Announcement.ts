import { Timestamp, type FirestoreDataConverter } from "firebase/firestore"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"

export interface AnnouncementJson {
	// id: string // id comes from the firebase Document ID
	createdAt: Timestamp
	title: string
	content: string
	visible: boolean
	dismissible: boolean
}

export class Announcement {
	public searchableString = ""

	constructor(
		public id: string,
		public createdAt: Dayjs,
		public title: string,
		public content: string,
		public visible: boolean,
		public dismissible: boolean
	) {
		this.updateSearchableString()
	}

	updateSearchableString() {
		this.searchableString = `${this.createdAt.format("YYYY-MM-DD HH:mm")} ${this.title.toLowerCase()} ${this.content.toLowerCase()} ${this.visible ? "zichtbaar" : "verborgen"} ${this.dismissible ? "verbergbaar" : "vast"}`
	}

	static fromJson(id: string, json: AnnouncementJson) {
		return new Announcement(id, dayjs(json.createdAt.toMillis()), json.title, json.content, json.visible, json.dismissible)
	}

	toJson() {
		return {
			createdAt: Timestamp.fromDate(this.createdAt.toDate()),
			title: this.title,
			content: this.content,
			visible: this.visible,
			dismissible: this.dismissible
		} as AnnouncementJson
	}

	/**
	 * Checks if Announcemnt matches a search string
	 * - if searchString is undefined, matches all
	 */
	matchesSearchString(searchString: string) {
		if (!searchString) {
			return true
		}
		return !searchString
			.toLowerCase()
			.split(" ")
			.map((keyword) => this.searchableString.includes(keyword))
			.includes(false)
	}

}

/**
 * Firestore data converter
 * */
export const announcementConverter: FirestoreDataConverter<Announcement> = {
	toFirestore: (announcement: Announcement) => announcement.toJson(),
	fromFirestore: (snapshot, options) => Announcement.fromJson(snapshot.id, snapshot.data(options) as AnnouncementJson)
}
