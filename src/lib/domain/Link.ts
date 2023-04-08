export interface LinkJson {
    name: string
    url: string
    customPage?: boolean
}
export class Link {
    constructor(
        public name: string,
        public url: string,
        public customPage: boolean = false
    ) {
    }

    static fromJson(json: LinkJson) {
        return new Link(
            json.name,
            json.url,
            json.customPage
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