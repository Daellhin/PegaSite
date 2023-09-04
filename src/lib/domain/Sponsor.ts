import type { FirestoreDataConverter } from "firebase/firestore"

/*** 
 * Using wrapper interface tot fix problem with svelte-dnd-action.
 * Dndzone removes class methods when elements are dragged
 * */
export interface DragableSponsor {
	id: string
	sponsor: Sponsor
}

export interface SponsorJson {
	name: string
	url: string
	imageUrl: string
}

export class Sponsor {
	public searchableString: string

	constructor(
		public id: string,
		public name: string,
		public url: string,
		public imageUrl: string,
	) {
		this.searchableString = `${name.toLowerCase()} ${url.toLowerCase()}`
	}

	static clone(sponsor: Sponsor) {
		return new Sponsor(
			sponsor.id,
			sponsor.name,
			sponsor.url,
			sponsor.imageUrl
		)
	}

	static fromJson(id: string, json: SponsorJson) {
		return new Sponsor(id, json.name, json.url, json.imageUrl)
	}

	toJson() {
		return {
			name: this.name,
			url: this.url,
			imageUrl: this.imageUrl
		} as SponsorJson
	}

	toDragableSponsor() {
		return {
			id: this.id,
			sponsor: this
		} as DragableSponsor
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
