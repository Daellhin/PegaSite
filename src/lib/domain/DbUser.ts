import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { FirestoreDataConverter } from "firebase/firestore";

export interface DbUserJson {
    role: string
    email: string
    displayName: string
    creationTimestamp: string
}

export class DbUser {
    public searchableString: string

    constructor(
        public uid: string,
        public role: string,
        public email: string,
        public displayName: string,
        public creationTimestamp: Dayjs
    ) {
        this.searchableString = `${role.toLowerCase()} ${email.toLowerCase()} ${displayName.toLowerCase()} ${creationTimestamp.format("DD-MM-YYYY")}`
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

    static fromJson(uid: string, json: DbUserJson) {
        return new DbUser(
            uid,
            json.role,
            json.email,
            json.displayName,
            dayjs(Number(json.creationTimestamp))
        )
    }

    toJson() {
        return {
            role: this.role,
            email: this.email,
            displayName: this.displayName,
            creationTimestamp: String(this.creationTimestamp.unix())
        } as DbUserJson
    }
}

/**
 * Firestore data converter
 * */
export const dbUserConverter: FirestoreDataConverter<DbUser> = {
    toFirestore: (user: DbUser) => user.toJson(),
    fromFirestore: (snapshot, options) => DbUser.fromJson(snapshot.id, snapshot.data(options) as DbUserJson)
}