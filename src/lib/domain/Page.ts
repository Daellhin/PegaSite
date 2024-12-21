import { createFirebaseStorageUrl, StorageFolders } from "$lib/firebase/Firebase"
import dayjs, { type Dayjs } from "dayjs"
import { Timestamp, type FirestoreDataConverter } from "firebase/firestore"
import { Link } from "./Link"

export interface PageJson {
    id: string
    lastEdited: Timestamp
    title: string
    imageIds: string[]
    content: string
}

export class Page {
    constructor(
        public id: string,
        public lastEdited: Dayjs,
        public title: string,
        public imageIds: string[],
        public content: string
    ) { }

    getUrl(edit = false) {
        return Link.normaliseUrl(this.id, edit)
    }

    getImageUrls() {
        return this.imageIds.map((e) => createFirebaseStorageUrl(StorageFolders.PAGE.IMAGES, e))
    }

    getThumbnailUrls() {
        return this.imageIds.map((e) => createFirebaseStorageUrl(StorageFolders.PAGE.THUMBNAILS, e))
    }

    static fromJson(json: PageJson) {
        return new Page(
            json.id,
            dayjs(json.lastEdited.toMillis()),
            json.title,
            json.imageIds,
            json.content
        )
    }

    toJson() {
        return {
            content: this.content,
            id: this.id,
            imageIds: this.imageIds,
            lastEdited: Timestamp.fromDate(this.lastEdited.toDate()),
            title: this.title
        } as PageJson
    }

    public isRecent(days = 5) {
        return this.lastEdited.isAfter(dayjs().subtract(days, 'day'))
    }

    public createCarouselImages() {
        if (!this.imageIds) return []
        return this.imageIds.map(async (e) => {
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