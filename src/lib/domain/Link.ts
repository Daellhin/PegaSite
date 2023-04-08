export interface LinkJson {
    title: string
    customUrl?: string
}
export class Link {
    constructor(
        public title: string,
        public customUrl?: string,
    ) { }

    getUrl() {
        return this.customUrl || Link.normaliseUrl(this.title)
    }

    static normaliseUrl(url: string) {
        return `/pages/${url.trim().replace(/ /g, "-").toLowerCase()}`
    }

    static fromJson(json: LinkJson) {
        return new Link(
            json.title,
            json.customUrl
        )
    }
}

export interface LinkGroupJson {
    name: string
    links: LinkJson[]
}
export class LinkGroup {
    public name: string
    public links: Link[]

    constructor(name: string, links: Link[]) {
        this.name = name
        this.links = links
    }

    static fromJson(json: LinkGroupJson) {
        return new LinkGroup(
            json.name,
            json.links.map(Link.fromJson)
        )
    }
}

export function isLinkGroupJson(json: LinkJson | LinkGroupJson): json is LinkGroupJson {
    return (json as LinkGroupJson).links !== undefined;
}