import dayjs, { type Dayjs } from "dayjs"
import { Timestamp, type FirestoreDataConverter } from "firebase/firestore"

export interface ArticleJson {
    id: string
    createdAt: Timestamp
    authors: string[]
    tags: string[]
    title: string
    images: string[]
    content: string
    lastUpdate: Timestamp | undefined
}

export class Article {
    constructor(
        public id: string,
        public createdAt: Dayjs,
        public authors: string[],
        public tags: string[],
        public title: string,
        public images: string[],
        public content: string,
        public lastUpdate?: Dayjs
    ) { }

    static fromJson(json: ArticleJson) {
        return new Article(
            json.id,
            dayjs(json.createdAt.toMillis()),
            json.authors,
            json.tags,
            json.title,
            json.images,
            json.content,
            json.lastUpdate ? dayjs(json.lastUpdate.toMillis()) : undefined
        )
    }
    toJson() {
        return {
            authors: this.authors,
            content: this.content,
            id: this.id,
            images: this.images,
            tags: this.tags,
            createdAt: Timestamp.fromDate(this.createdAt.toDate()),
            title: this.title,
            lastUpdate: this.lastUpdate ? Timestamp.fromDate(this.lastUpdate.toDate()) : undefined
        } as ArticleJson
    }

    public isRecent(days = 5) {
        return this.createdAt.isAfter(dayjs().subtract(days, 'day'))
    }

    public createCarouselImages() {
        if (!this.images) return []
        return this.images.map(async (image) => {
            return {
                name: "name",
                imageUrl: image
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