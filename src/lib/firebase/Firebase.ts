import { initializeApp } from 'firebase/app'

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENTID,
}

export const firebaseApp = initializeApp(firebaseConfig, "primary")

/**
 * Firebase Collection names
 */
export class Collections {
    static ARTICLES = "articles"
    static CLUB_RECORDS = "club-records"
    static CALENDAR_EVENTS = "calendar-events"
    static PAGES = "pages"
    static USERS = "users"
}