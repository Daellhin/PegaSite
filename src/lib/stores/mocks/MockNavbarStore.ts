import { LINKS_JSON } from '$data/LinksJson'
import { Link, LinkGroup } from '$lib/domain/Link'
import { pageStore } from '$lib/stores/PageStore'
import { writable } from 'svelte/store'

export function createMockNavbarStore() {
	const store = writable<(LinkGroup)[]>(undefined, set => {
		const links = LINKS_JSON.map(LinkGroup.fromJson)
		set(links)
	})
	const { subscribe, update } = store

	async function createLink(link: Link, group: LinkGroup) {
		group.links.push(link)
		update((linkGroups) => [...linkGroups])
	}
	async function updateLinkTitle(newTitle: string, link: Link, _group: LinkGroup) {
		link.title = newTitle
		update((linkGroups) => [...linkGroups])
	}
	async function updateGroupTitle(title: string, linkGroup: LinkGroup) {
		linkGroup.name = title
		update((linkGroups) => [...linkGroups])
	}
	async function updateLinkGroupOrder(newLinkGroups: LinkGroup[]) {
		update((linkGroups) => [...newLinkGroups])
	}
	async function updateLinkOrder(linkGroup: LinkGroup, newLinks: Link[]) {
		update((linkGroups) => [...linkGroups])
	}
	async function deleteLink(link: Link, group: LinkGroup) {
		pageStore.deletePage(link.getId())
		group.links = group.links.filter((e) => e !== link)
		update((linkGroups) => [...linkGroups])
	}

	return {
		subscribe,
		createLink,
		updateLinkTitle,
		updateGroupTitle,
		updateLinkGroupOrder,
		updateLinkOrder,
		deleteLink,
	}
}

// async function addLinksFromJson() {
//   const links = LINKS_JSON.map(LinkGroup.fromJson)
//   await Promise.all(links.map(async (linkGroup) => {
//     const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
//     const { firebaseApp } = await import('$lib/firebase/Firebase')
//     const firestore = getFirestore(firebaseApp)

//     const linksRef = doc(firestore, Collections.PAGES, "overview")
//     await updateDoc(linksRef, linkGroup.toFirebaseJson())
//   }))
// }
