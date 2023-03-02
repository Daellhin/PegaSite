import dayjs, { Dayjs } from "dayjs"
import { readFileAsDataURL } from "./utils/utils"

export interface ArticleJson {
    id: number
    timestamp: Dayjs
    author: string
    tags: string[]
    title: string
    images: File[]
    content: string
}

export class Article {
    constructor(
        public id: number,
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
            json.timestamp,
            json.author,
            json.tags,
            json.title,
            json.images,
            json.content
        )
    }

    public isRecent(days = 5) {
        return this.timestamp.isAfter(dayjs().subtract(days, 'day'));
    }

    public createCarouselImages() {
        return this.images.map(async(e, index) => {
            return {
                id: index,
                name: e.name,
                imgurl:await readFileAsDataURL(e),
            }
        });
    }

}