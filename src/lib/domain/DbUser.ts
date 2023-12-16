import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import type { FirestoreDataConverter } from "firebase/firestore"

export type DbUserRole = "admin" | "editor"
function getRoleValue(role: DbUserRole) {
	switch (role) {
		case "admin": return 2
		case "editor": return 1
		default: throw new Error(`Unknown role: ${role}`)
	}
}

export interface DbUserJson {
	roles: DbUserRole[]
	email: string
	displayName: string
	creationTimestamp: string
}

export class DbUser {
	public searchableString = ""

	constructor(
		public uid: string,
		public roles: DbUserRole[],
		public email: string,
		public displayName: string,
		public creationTimestamp: Dayjs
	) {
		this.updateSearchableString()
	}

	updateSearchableString() {
		this.searchableString = `${this.roles.join(" ")} ${this.email} ${this.displayName} ${this.creationTimestamp.format("DD-MM-YYYY")}`.toLowerCase()
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

	getHighestRole() {
		return this.roles
			.reduce((previous, current) => (getRoleValue(previous) > getRoleValue(current) ? previous : current))
	}

	isAdmin() {
		return this.roles.includes("admin")
	}

	static getAplicableRoles(role: string): DbUserRole[] {
		switch (role) {
			case "admin": return ["admin", "editor"]
			case "editor": return ["editor"]
			default: throw new Error(`Unknown role: ${role}`)
		}
	}

	static fromJson(uid: string, json: DbUserJson) {
		return new DbUser(
			uid,
			json.roles,
			json.email,
			json.displayName,
			dayjs(Number(json.creationTimestamp))
		)
	}

	toJson() {
		return {
			roles: this.roles,
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