import { capitalizeFirstLetter } from "$lib/utils/String"
import type { DragableItem } from "$lib/utils/Types"

export interface LinkJson {
    title: string
    order: number
    customUrl?: string
}
export class Link {
    constructor(
        public title: string,
        public order: number,
        public customUrl?: string
    ) { }

    getUrl(edit = false) {
        return this.customUrl || Link.normaliseUrl(this.title, edit)
    }

    getId() {
        return Link.normaliseId(this.title)
    }

	toDragableDragableItem() {
		return {
			id: this.title,
			value: this
		} as DragableItem<Link>
	}

    toFirebaseJson() {
        return {
            order: this.order, ...this.customUrl && { customUrl: this.customUrl }
        }
    }

    static normaliseUrl(url: string, edit = false) {
        return `/pages/${edit ? "edit/" : ""}${Link.normaliseId(url)}`
    }

    static normaliseId(id: string) {
        return id.trim().replace(/ /g, "-").toLowerCase()
    }
    static titleFromId(id:string) {
        return capitalizeFirstLetter(id.replace(/-/g, ""))
    }

    static fromJson(json: LinkJson) {
        return new Link(
            json.title,
            json.order,
            json.customUrl
        )
    }
}

export interface LinkGroupJson {
    name: string
    links: LinkJson[]
    order: number
}
export class LinkGroup {
    constructor(
        public name: string,
        public links: Link[],
        public order: number
    ) { }

    static fromJson(json: LinkGroupJson) {
        return new LinkGroup(
            json.name,
            json.links.map(Link.fromJson),
            json.order
        )
    }

	toDragableDragableItem() {
		return {
			id: this.name,
			value: this
		} as DragableItem<LinkGroup>
	}

    toFirebaseJson() {
        const linkMap = this.links.map(link => [link.title, link.toFirebaseJson()])
        return {
            [this.name]: {
                order: this.order,
                links: Object.fromEntries(linkMap)
            }
        }
    }

    static fromFirebaseData(toMap: any) {
        const links = Object.keys(toMap).flatMap((groupName) => {
            const links = Object.keys(toMap[groupName].links).map((linkTitle) => {
                const linkJson = toMap[groupName].links[linkTitle]
                return new Link(linkTitle, linkJson.order, linkJson.customUrl)
            }).sort((a, b) => a.order - b.order)
            return new LinkGroup(groupName, links, toMap[groupName].order)
        })
        return links.sort((a, b) => a.order - b.order)
    }
}

export function isLinkGroupJson(json: LinkJson | LinkGroupJson): json is LinkGroupJson {
    return (json as LinkGroupJson).links !== undefined
}