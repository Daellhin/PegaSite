
import { createFirebaseStorageUrl, StorageFolders } from "$lib/firebase/Firebase"
import dayjs, { type Dayjs } from "dayjs"
import { Timestamp, type FirestoreDataConverter } from "firebase/firestore"

export interface ArticleJson {
    id: string
    createdAt: Timestamp
    authors: string[]
    tags: string[]
    title: string
    imageIds: string[]
    content: string
    lastUpdate: Timestamp | undefined
    visible: boolean
}

export class Article {
    public searchableString = ""

    constructor(
        public id: string,
        public createdAt: Dayjs,
        public authors: string[],
        public tags: string[],
        public title: string,
        public imageIds: string[],
        public content: string,
        public visible: boolean,
        public lastUpdate?: Dayjs,
    ) {
        this.updateSearchableString()
    }

    updateSearchableString() {
        this.searchableString = `${this.title} ${this.tags.join(" ")} ${this.authors.join(" ")} ${this.createdAt.format("YYYY-MM-DD HH:mm")} ${this.lastUpdate?.format("YYYY-MM-DD HH:mm")}`.toLowerCase()
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

    static fromJson(json: ArticleJson) {
        return new Article(
            json.id,
            dayjs(json.createdAt.toMillis()),
            json.authors,
            json.tags,
            json.title,
            json.imageIds,
            json.content,
            json.visible,
            json.lastUpdate ? dayjs(json.lastUpdate.toMillis()) : undefined
        )
    }
    toJson() {
        return {
            authors: this.authors,
            content: this.content,
            id: this.id,
            imageIds: this.imageIds,
            tags: this.tags,
            createdAt: Timestamp.fromDate(this.createdAt.toDate()),
            title: this.title,
            visible: this.visible,
            lastUpdate: this.lastUpdate ? Timestamp.fromDate(this.lastUpdate.toDate()) : null
        } as ArticleJson
    }

    public isRecent(days = 5) {
        return this.createdAt.isAfter(dayjs().subtract(days, 'day'))
    }

    public createCarouselImages() {
        if (!this.imageIds) return []
        return this.imageIds.map(async (e) => {
            return {
                name: "name",
                imageUrl: createFirebaseStorageUrl(StorageFolders.ARTICLE.IMAGES, e)
            }
        })
    }
}

/**
 * Firestore data converter
 * */
export const articleConverter: FirestoreDataConverter<Article> = {
    toFirestore: (article: Article) => article.toJson(),
    fromFirestore: (snapshot, options) => Article.fromJson(snapshot.data(options) as ArticleJson)
}