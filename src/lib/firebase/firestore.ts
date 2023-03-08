import type { FirebaseApp } from '@firebase/app'
import type { Firestore } from "@firebase/firestore/lite"
import { getFirestore } from "@firebase/firestore/lite"

let db: Firestore

/**
 * Should only be used on the client. I think?
 */
export function firestore(firebaseApp: FirebaseApp) {
    if (db) {
        return db
    }
    db = getFirestore(firebaseApp)
    return db
}

export class Collections {
    static ARTICLES = "articles";
}