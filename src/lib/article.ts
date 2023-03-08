import dayjs, { type Dayjs } from "dayjs"
import { readFileAsDataURL } from "./utils/utils"
import type { Timestamp } from "@firebase/firestore/lite";

export interface ArticleJson {
    id: string
    timestamp: Timestamp
    author: string
    tags: string[]
    title: string
    // images: File[]
    content: string
}

export class Article {
    constructor(
        public id: string,
        public timestamp: Dayjs,
        public author: string,
        public tags: string[],
        public title: string,
        public images: File[],
        public content: string
    ) { }

    static fromJson(json: ArticleJson) {
        return new Article(
            json.id,
            dayjs(json.timestamp.toMillis()),
            json.author,
            json.tags,
            json.title,
            [],
            // json.images,
            json.content
        )
    }

    public isRecent(days = 5) {
        return this.timestamp.isAfter(dayjs().subtract(days, 'day'));
    }

    public createCarouselImages() {
        return this.images.map(async (e, index) => {
            return {
                id: index,
                name: e.name,
                // imgurl:await readFileAsDataURL(e),
                imgurl: "images/shoe.jpg"
            }
        });
    }

}