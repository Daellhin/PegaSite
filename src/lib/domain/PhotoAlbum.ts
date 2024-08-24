import { StorageFolders } from "$lib/firebase/Firebase"
import dayjs, { type Dayjs } from "dayjs"
import { Timestamp, type FirestoreDataConverter } from "firebase/firestore"

export interface PhotoAlbumJson {
    // id: string // id comes from the firebase Document ID
    createdAt: Timestamp
    date: Timestamp
    author: string
    authorUrl: string
    title: string
    imageIds: string[]
    visible: boolean
}

export class PhotoAlbum {
    public searchableString = ""

    constructor(
        public id: string,
        public createdAt: Dayjs,
        public date: Dayjs,
        public author: string,
        public authorUrl: string,
        public title: string,
        public imageIds: string[],
        public visible: boolean
    ) {
        this.updateSearchableString()
    }

    updateSearchableString() {
        //this.searchableString = `${this.title} ${this.tags.join(" ")} ${this.authors.join(" ")} ${this.createdAt.format("YYYY-MM-DD HH:mm")} ${this.lastUpdate?.format("YYYY-MM-DD HH:mm")}`.toLowerCase()
    }

    /**
     * Checks if article matches a search string
     * - if searchString is undefined, matches all
     */
    matchesSearchString(searchString: string) {
        if (!searchString) return true
        return !searchString
            .toLowerCase()
            .split(" ")
            .map((keyword) => this.searchableString.includes(keyword))
            .includes(false)
    }

    getImageUrls() {
        const firebaseStorageUrl = "https://firebasestorage.googleapis.com/v0/b/pega-site.appspot.com/o/"
        return this.imageIds.map((e) => `${firebaseStorageUrl}${StorageFolders.PHOTO_ALBUM_IMAGES}%2F${e}?alt=media`)
    }

    getThumbnailUrls() {
        const firebaseStorageUrl = "https://firebasestorage.googleapis.com/v0/b/pega-site.appspot.com/o/"
        return this.imageIds.map((e) => `${firebaseStorageUrl}${StorageFolders.PHOTO_ALBUM_THUMBNAILS}%2F${e}?alt=media`)
    }

    static fromJson(id: string, json: PhotoAlbumJson) {
        return new PhotoAlbum(
            id,
            dayjs(json.createdAt.toMillis()),
            dayjs(json.date.toMillis()),
            json.author,
            json.authorUrl,
            json.title,
            json.imageIds,
            json.visible
        )
    }
    toJson() {
        return {
            createdAt: Timestamp.fromDate(this.createdAt.toDate()),
            date: Timestamp.fromDate(this.date.toDate()),
            author: this.author,
            authorUrl: this.authorUrl,
            title: this.title,
            imageIds: this.imageIds,
            visible: this.visible,
        } as PhotoAlbumJson
    }
}

/**
 * Firestore data converter
 * */
export const photoAlbumConverter: FirestoreDataConverter<PhotoAlbum> = {
    toFirestore: (photoAlbum: PhotoAlbum) => photoAlbum.toJson(),
    fromFirestore: (snapshot, options) => PhotoAlbum.fromJson(snapshot.id, snapshot.data(options) as PhotoAlbumJson)
}
