import { browser } from '$app/environment'
import { Link, LinkGroup } from '$lib/domain/Link'
import { Collections } from '$lib/firebase/Firebase'
import { pageStore } from '$lib/stores/PageStore'
import { arrayDifference, arrayIntersection } from '$lib/utils/Array'
import { convertStringToBool } from '$lib/utils/Utils'
import { get, writable } from 'svelte/store'
import { createMockNavbarStore } from './mocks/MockNavbarStore'

function createNavbarStore() {
	const store = writable<(LinkGroup)[]>(undefined, set => {
		async function init() {
			if (!browser) return

			// -- Load Navbar --
			const { firebaseApp } = await import('$lib/firebase/Firebase')
			const { getFirestore, doc, getDoc } = await import('firebase/firestore')
			const firestore = getFirestore(firebaseApp)

			const linksRef = doc(firestore, Collections.PAGES, "overview")
			const linksSnap = await getDoc(linksRef)
			const links = LinkGroup.fromFirebaseData(linksSnap.data())

			// -- Set store --
			set(links)
		}
		init()
	})
	const { subscribe, update } = store

	async function createLink(link: Link, group: LinkGroup, createPage = true) {
		// -- Create link --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.PAGES, "overview")
		const objectKey = `${group.name}.links.${link.title}`
		const createLinkPromise = updateDoc(linksRef, {
			[objectKey]: link.toFirebaseJson()
		})

		// -- Create page --
		const createPagePromise = createPage ? pageStore.createBlankPage(link.getId(), link.title) : Promise.resolve()

		// TODO add transaction
		await Promise.all([createLinkPromise, createPagePromise])

		// -- Update store --
		group.links.push(link)
		update((linkGroups) => [...linkGroups])
	}

	/**
	 * Also updates page id
	 */
	async function updateLinkTitle(newTitle: string, link: Link, group: LinkGroup) {
		if (link.title === newTitle) return

		// -- Delete link --
		const { getFirestore, doc, updateDoc, deleteField } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.PAGES, "overview")
		const oldObjectKey = `${group.name}.links.${link.title}`
		const deleteLinkPromise = updateDoc(linksRef, {
			[oldObjectKey]: deleteField()
		})

		// -- Update page id --
		const updatePagePromise = pageStore.updatePageId(Link.normaliseId(newTitle), link.getId())

		link.title = newTitle
		// -- Create link --
		const newObjectKey = `${group.name}.links.${link.title}`
		const createLinkPromise = updateDoc(linksRef, {
			[newObjectKey]: link.toFirebaseJson()
		})

		// TODO add transaction
		await Promise.all([deleteLinkPromise, createLinkPromise, updatePagePromise])

		// -- Update store --
		update((linkGroups) => [...linkGroups])
	}

	async function updateGroupTitle(title: string, linkGroup: LinkGroup) {
		if (linkGroup.name === title) return

		// -- Delete group --
		const { getFirestore, doc, updateDoc, deleteField } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.PAGES, "overview")
		const oldObjectKey = `${linkGroup.name}`
		const deleteGroupPromise = updateDoc(linksRef, {
			[oldObjectKey]: deleteField()
		})

		linkGroup.name = title
		// -- Create link --
		const createGroupPromise = updateDoc(linksRef, linkGroup.toFirebaseJson())

		// TODO add transaction
		await Promise.all([deleteGroupPromise, createGroupPromise])

		// -- Update store --
		update((linkGroups) => [...linkGroups])
	}

	async function updateLinkGroupOrder(newLinkGroups: LinkGroup[]) {
		if (newLinkGroups === get(store)) return

		// -- Update linkGroup orders --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.PAGES, "overview")
		// TODO add transaction
		await Promise.all(newLinkGroups
			.filter((linkGroup, i) => linkGroup.order !== i)
			.map(async (linkGroup, i) => {
				const key = `${linkGroup.name}.order`
				const updateOrderPromise = await updateDoc(linksRef, {
					[key]: i
				})
				return updateOrderPromise
			}))

		// -- Update store --
		update(() => [...newLinkGroups])
	}

	async function updateLinkOrder(linkGroup: LinkGroup, newLinks: Link[]) {
		if (linkGroup.links === newLinks) return

		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.PAGES, "overview")

		// -- Update link order (Local)	--
		newLinks.forEach((link, i) => link.order = i)

		// -- Remove links from group --
		const linksToRemove = arrayDifference(linkGroup.links, newLinks)
		const linksToRemovePromise = linksToRemove.map(async (link) => await deleteLink(link, linkGroup, false))

		// -- Add links to group --
		const linksToAdd = arrayDifference(newLinks, linkGroup.links)
		const linksToAddPromise = linksToAdd.map(async (link) => await createLink(link, linkGroup, false))

		// -- Update links orders --
		const linksToUpdate = arrayIntersection(linkGroup.links, newLinks)
		const linksToUpdatePromise = linksToUpdate
			.filter((link) => link.order !== newLinks.indexOf(link))
			.map(async (link, i) => {
				const key = `${linkGroup.name}.links.${link.title}.order`
				return await updateDoc(linksRef, {
					[key]: i
				})
			})

		// TODO add transaction
		await Promise.all([...linksToRemovePromise, ...linksToAddPromise, ...linksToUpdatePromise])

		linkGroup.links = newLinks

		// -- Update store --
		update((linkGroups) => [...linkGroups])
	}

	async function deleteLink(link: Link, group: LinkGroup, deletePage = true) {
		if (link.customUrl) return

		// -- Delete link --
		const { getFirestore, doc, updateDoc, deleteField } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.PAGES, "overview")
		const objectKey = `${group.name}.links.${link.title}`
		const deleteLinkPromise = updateDoc(linksRef, {
			[objectKey]: deleteField()
		})

		// -- Delete page --
		const deletePagePromise = deletePage ? pageStore.deletePage(link.getId()) : Promise.resolve()

		// TODO add transaction
		await Promise.all([deleteLinkPromise, deletePagePromise])

		// -- Update store --
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

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
if (useMock) console.warn("Mocking is on for NavbarStore")
export const navbarStore = useMock ?
	createMockNavbarStore() :
	createNavbarStore()
