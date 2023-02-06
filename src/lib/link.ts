export interface LinkJson {
    name: string
    url: string
}

export class Link {
    constructor(
        public name: string,
        public url: string
    ) {
    }

    static fromJson(json: LinkJson) {
        return new Link(
            json.name,
            json.url
        )
    }
}

export interface LinkGroupJson {
    name: string
    links: LinkJson[]
}
export function isLinkGroupJson(json: LinkJson | LinkGroupJson): json is LinkGroupJson {
    return (<LinkGroupJson>json).links !== undefined;
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

export function combinedLinksFromJson(json: (LinkJson | LinkGroupJson)[]) {
    return json.map(e => isLinkGroupJson(e) ? LinkGroup.fromJson(e) : Link.fromJson(e));
}