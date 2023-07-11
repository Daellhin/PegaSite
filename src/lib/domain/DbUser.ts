import type { FirestoreDataConverter } from "firebase/firestore";

export interface DbUserJson {
    role: string;
}

export class DbUser {
    constructor(
        public uid: string,
        public role: string,
    ) { }

    static fromJson(uid: string, json: DbUserJson) {
        return new DbUser(
            uid,
            json.role
        )
    }

    toJson() {
        return {
            role: this.role,
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