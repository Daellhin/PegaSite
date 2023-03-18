import dayjs, { type Dayjs } from "dayjs"
import { Timestamp, type FirestoreDataConverter } from "firebase/firestore"

export interface ArticleJson {
    id: string
    timestamp: Timestamp
    author: string
    tags: string[]
    title: string
    images: string[]
    content: string
}

export class Article {
    constructor(
        public id: string,
        public timestamp: Dayjs,
        public author: string,
        public tags: string[],
        public title: string,
        public images: string[],
        public content: string
    ) { }

    static fromJson(json: ArticleJson) {
        return new Article(
            json.id,
            dayjs(json.timestamp.toMillis()),
            json.author,
            json.tags,
            json.title,
            json.images,
            json.content
        )
    }
    toJson() {
        return {
            author: this.author,
            content: this.content,
            id: this.id,
            images: this.images,
            tags: this.tags,
            timestamp: Timestamp.fromDate(this.timestamp.toDate()),
            title: this.title
        } as ArticleJson
    }

    public isRecent(days = 5) {
        return this.timestamp.isAfter(dayjs().subtract(days, 'day'))
    }

    public createCarouselImages() {
        if (!this.images) return []
        return this.images.map(async (image, index) => {
            return {
                id: index,
                name: "name",
                imgurl: image
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