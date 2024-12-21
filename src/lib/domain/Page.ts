import { createFirebaseStorageUrl, StorageFolders } from "$lib/firebase/Firebase"
import dayjs, { type Dayjs } from "dayjs"
import { Timestamp, type FirestoreDataConverter } from "firebase/firestore"
import { Link } from "./Link"

export interface PageJson {
    id: string
    lastEdited: Timestamp
    title: string
    images: string[]
    content: string
}

export class Page {
    constructor(
        public id: string,
        public lastEdited: Dayjs,
        public title: string,
        public images: string[],
        public content: string
    ) { }

    getUrl(edit = false) {
        return Link.normaliseUrl(this.id, edit)
    }

    getImageUrls() {
        return this.images.map((e) => createFirebaseStorageUrl(StorageFolders.PAGE.IMAGES, e))
    }

    getThumbnailUrls() {
        return this.images.map((e) => createFirebaseStorageUrl(StorageFolders.PAGE.THUMBNAILS, e))
    }

    static fromJson(json: PageJson) {
        return new Page(
            json.id,
            dayjs(json.lastEdited.toMillis()),
            json.title,
            json.images,
            json.content
        )
    }

    toJson() {
        return {
            content: this.content,
            id: this.id,
            images: this.images,
            lastEdited: Timestamp.fromDate(this.lastEdited.toDate()),
            title: this.title
        } as PageJson
    }

    public isRecent(days = 5) {
        return this.lastEdited.isAfter(dayjs().subtract(days, 'day'))
    }

    public createCarouselImages() {
        if (!this.images) return []
        return this.images.map(async (e) => {
            return {
                name: "name",
                imageUrl: createFirebaseStorageUrl(StorageFolders.PAGE.IMAGES, e)
            }
        })
    }
}

/**
 * Firestore data converter
 * */
export const pageConverter: FirestoreDataConverter<Page> = {
    toFirestore: (page: Page) => page.toJson(),
    fromFirestore: (snapshot, options) => Page.fromJson(snapshot.data(options) as PageJson)
}