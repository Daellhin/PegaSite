import type { FirestoreDataConverter } from "firebase/firestore"

export interface SponserJson {
    name: string
    url: string
    imageUrl: string
}

export class Sponser {
    public searchableString: string

    constructor(
        public id: string,
        public name: string,
        public url: string,
        public imageUrl: string,
    ) { 
        this.searchableString = `${name.toLowerCase()} ${url.toLowerCase()}`
    }

    static fromJson(id: string, json: SponserJson) {
        return new Sponser(id, json.name, json.url, json.imageUrl)
    }

    toJson() {
        return {
            name: this.name,
            url: this.url,
            imageUrl: this.imageUrl
        } as SponserJson
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
export const sponserConverter: FirestoreDataConverter<Sponser> = {
    toFirestore: (sponser: Sponser) => sponser.toJson(),
    fromFirestore: (snapshot, options) => Sponser.fromJson(snapshot.id, snapshot.data(options) as SponserJson)
}
