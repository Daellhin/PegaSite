import { browser } from '$app/environment'
import { Link, LinkGroup } from '$lib/domain/Link'
import { Collections } from '$lib/firebase/Firebase'
import { pageStore } from '$lib/stores/PageStore'
import { convertStringToBool } from '$lib/utils/Utils'
import { writable } from 'svelte/store'
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

	/**
	 * Also creates apropriate page
	 */
	async function createLink(link: Link, group: LinkGroup) {
		if (!browser) return

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
		const createPagePromise = pageStore.createBlankPage(link.getId(), link.title)

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
		if (!browser) return
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
		if (!browser) return
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

	/**
	 * Also deletes apropriate page
	 */
	async function deleteLink(link: Link, group: LinkGroup) {
		if (!browser) return
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
		const deletePagePromise = pageStore.deletePage(link.getId())

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
		deleteLink,
	}
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
export const navbarStore = useMock ?
	createMockNavbarStore() :
	createNavbarStore()
