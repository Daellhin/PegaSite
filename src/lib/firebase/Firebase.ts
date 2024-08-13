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

export const firebaseApp = initializeApp(firebaseConfig)

/**
 * Firebase Collection names
 */
export class Collections {
    static readonly ARTICLES = "articles"
    static readonly CLUB_RECORDS = "club-records"
    static readonly CALENDAR_EVENTS = "calendar-events"
    static readonly PAGES = "pages"
    static readonly USERS = "users"
    static readonly SPONSORS = "sponsors"
	static readonly ORDERINGS = "orderings"
    static readonly PHOTO_ALBUMS = "photo-albums"
    static readonly ANNOUNCEMENTS = "announcements"
}

/**
 * Firebase Storage folder names
 */
export class StorageFolders {
    static readonly ARTICLE_IMAGES = "article-images"
    static readonly PHOTO_ALBUM_IMAGES = "photo-album-images"
    static readonly SPONSOR_IMAGES = "sponsor-images"
    static readonly PAGE_IMAGES = "page-images"
}
