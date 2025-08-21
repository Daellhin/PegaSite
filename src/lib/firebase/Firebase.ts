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

export type StorageFolder = {
    IMAGES: string,
    THUMBNAILS: string
}
/**
 * Firebase Storage folder names
 */
export class StorageFolders {
    static readonly ARTICLE: StorageFolder = {
        IMAGES: "article-images",
        THUMBNAILS: "article-thumbnails"
    }
    static readonly PHOTO_ALBUM: StorageFolder = {
        IMAGES: "photo-album-images",
        THUMBNAILS: "photo-album-thumbnails"
    }
    static readonly SPONSOR: StorageFolder = {
        IMAGES: "sponsor-images",
        THUMBNAILS: "sponsor-thumbnails"
    }
    static readonly PAGE: StorageFolder = {
        IMAGES: "page-images",
        THUMBNAILS: "page-thumbnails"
    }
}

export const FIRBASE_STORAGE_URL = "https://firebasestorage.googleapis.com/v0/b/pega-site.appspot.com/o/"

export function createFirebaseStorageUrl(storageFolder: string, fileName: string) {
    return `${FIRBASE_STORAGE_URL}${storageFolder}%2F${fileName}?alt=media`
}
