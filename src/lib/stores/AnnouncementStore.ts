import { browser } from '$app/environment'
import { Announcement, announcementConverter, type AnnouncementJson } from '$lib/domain/Announcement'
import { Collections } from '$lib/firebase/Firebase'
import { convertStringToBool } from '$lib/utils/Utils'
import { get, writable } from 'svelte/store'
import { createMockAnnouncementStore } from './mocks/MockAnnouncementStore'
import type { OrderingJson } from '$lib/domain/Ordering'
import { sortWithOrdering } from '$lib/utils/Stores'

function createAnnouncementStore() {
	const store = writable<(Announcement)[]>(undefined, set => {
		async function init() {
			if (!browser) return

			// -- Load Announcements --
			const { firebaseApp } = await import('$lib/firebase/Firebase')
			const { getFirestore, getDocs, getDoc, doc, collection } = await import('firebase/firestore')
			const firestore = getFirestore(firebaseApp)

			const announcementsRef = collection(firestore, Collections.ANNOUNCEMENTS)
			const announcementsSnap = await getDocs(announcementsRef)
			const announcements = announcementsSnap.docs.map(e => Announcement.fromJson(e.id, e.data() as AnnouncementJson))

			// // -- Sort announcements --
			const orderingRef = doc(firestore, Collections.ORDERINGS, Collections.ANNOUNCEMENTS)
			const orderingSnap = await getDoc(orderingRef)
			const ordering = orderingSnap.data() as OrderingJson | undefined
			if (!ordering) throw new Error(`Sort order ${Collections.ANNOUNCEMENTS} not found`)
			sortWithOrdering(announcements, ordering.ids)

			// -- Set store --
			set(announcements)
		}
		init()
	})
	const { subscribe, update } = store

	async function createAnnouncement(announcement: Announcement) {
		// -- Upload document --
		const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const newDocRef = doc(collection(firestore, Collections.ANNOUNCEMENTS)).withConverter(announcementConverter)
		await setDoc(newDocRef, announcement)
		announcement.id = newDocRef.id

		// -- Update ordering --
		const existingSortedIds = get(store).map((e) => e.id)
		await updateAnnouncementsOrder([...existingSortedIds, newDocRef.id])

		// -- Update store(new item last) --
		update((anouncements) => ([...anouncements, announcement]))
	}

	async function updateAnnouncement(newTitle: string, newContent: string, newVisible: boolean, newDismissable: boolean, announcement: Announcement) {
		// -- Update document --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const docRef = doc(firestore, Collections.ANNOUNCEMENTS, announcement.id)
		const updates: any = {
			title: newTitle,
			content: newContent,
			visible: newVisible,
			dismissable: newDismissable
		}
		await updateDoc(docRef, updates)

		// -- Update store --
		announcement.title = newTitle
		announcement.content = newContent
		announcement.visible = newVisible
		announcement.dismissible = newDismissable
		announcement.updateSearchableString()
		update((announcements) => [...announcements])
	}

	async function deleteAnnouncement(announcement: Announcement) {
		// -- Delete document --
		const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const docRef = doc(firestore, Collections.ANNOUNCEMENTS, announcement.id)
		await deleteDoc(docRef)

		// -- Delete from store --
		update((announcements) => announcements.filter((e) => e.id !== announcement.id))

		// -- Update ordering --
		const existingSortedIds = get(store).map((e) => e.id)
		await updateAnnouncementsOrder(existingSortedIds)
	}

	async function updateAnnouncementsOrder(newSortedIds: string[]) {
		// -- Update document --
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const firestore = getFirestore(firebaseApp)

		const docRef = doc(firestore, Collections.ORDERINGS, Collections.ANNOUNCEMENTS)
		await updateDoc(docRef, {
			ids: newSortedIds,
		})

		// -- Update store --
		sortWithOrdering(get(store), newSortedIds)
		update((announcements) => [...announcements])
	}

	async function updateAnnouncementVisibility(announcement: Announcement) {
		// -- Update document --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.ANNOUNCEMENTS, announcement.id)
		await updateDoc(linksRef, {
			visible: announcement.visible
		})

		announcement.updateSearchableString()
		// -- Update store --
		update((announcements) => [...announcements])
	}

	return {
		subscribe,
		createAnnouncement,
		updateAnnouncement,
		deleteAnnouncement,
		updateAnnouncementsOrder,
		updateAnnouncementVisibility
	}
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
if (useMock) console.warn("Mocking is on for AnnouncementStore")
export const announcementStore = useMock ?
	createMockAnnouncementStore() :
	createAnnouncementStore()
