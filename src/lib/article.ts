export interface ArticleJson {
    timestamp: Date
    author: string
    tags: string[]
    title: string
    image: string
    content: string
}

export class Article {
    constructor(
        public timestamp: Date,
        public author: string,
        public tags: string[],
        public title: string,
        public image: string,
        public content: string
    ) { }

    static fromJson(json: ArticleJson) {
        return new Article(
            json.timestamp,
            json.author,
            json.tags,
            json.title,
            json.image,
            json.content
        )
    }

}