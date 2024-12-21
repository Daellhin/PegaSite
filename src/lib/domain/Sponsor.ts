import { createFirebaseStorageUrl, StorageFolders } from "$lib/firebase/Firebase"
import type { DragableItem } from "$lib/utils/Types"
import type { FirestoreDataConverter } from "firebase/firestore"


export interface SponsorJson {
	// id: string // id comes from the firebase Document ID
	name: string
	url: string
	imageUrl: string
	visible: boolean
}

export class Sponsor {
	public searchableString = ""

	constructor(
		public id: string,
		public name: string,
		public url: string,
		public imageUrl: string,
		public visible: boolean
	) {
		this.updateSearchableString()
	}

	updateSearchableString() {
		this.searchableString = `${this.name.toLowerCase()} ${this.url.toLowerCase()} ${this.visible ? "zichtbaar" : "verborgen"}`
	}

	static clone(sponsor: Sponsor) {
		return new Sponsor(
			sponsor.id,
			sponsor.name,
			sponsor.url,
			sponsor.imageUrl,
			sponsor.visible
		)
	}

	getImageUrl() {
		return createFirebaseStorageUrl(StorageFolders.SPONSOR.IMAGES, this.imageUrl)
	}

	getThumbnailUrl() {
		return createFirebaseStorageUrl(StorageFolders.SPONSOR.THUMBNAILS, this.imageUrl)
	}

	static fromJson(id: string, json: SponsorJson) {
		return new Sponsor(id, json.name, json.url, json.imageUrl, json.visible)
	}

	toJson() {
		return {
			name: this.name,
			url: this.url,
			imageUrl: this.imageUrl,
			visible: this.visible
		} as SponsorJson
	}

	toDragableItem() {
		return {
			id: this.id,
			value: this
		} as DragableItem<Sponsor>
	}

	/**
	 * Checks if DbUser matches a search string
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
export const sponsorConverter: FirestoreDataConverter<Sponsor> = {
	toFirestore: (sponsor: Sponsor) => sponsor.toJson(),
	fromFirestore: (snapshot, options) => Sponsor.fromJson(snapshot.id, snapshot.data(options) as SponsorJson)
}
