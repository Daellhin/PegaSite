import { browser } from '$app/environment'
import type { OrderingJson } from '$lib/domain/Ordering'
import { Sponsor, sponsorConverter, type SponsorJson } from '$lib/domain/Sponsor'
import { Collections, createFirebaseStorageUrl, StorageFolders } from '$lib/firebase/Firebase'
import { sortWithOrdering } from '$lib/utils/Stores'
import { convertAndUploadImages, deleteImages, UploadProgress } from '$lib/utils/UploadProgress'
import { convertStringToBool } from '$lib/utils/Utils'
import { get, writable, type Writable } from 'svelte/store'
import { createMockSponsorStore } from './mocks/MockSponsorStore'

function createSponsorStore() {
	const store = writable<(Sponsor)[]>(undefined, set => {
		async function init() {
			if (!browser) return

			// -- Load Sponsors --
			const { firebaseApp } = await import('$lib/firebase/Firebase')
			const { getFirestore, getDocs, getDoc, doc, collection } = await import('firebase/firestore')
			const firestore = getFirestore(firebaseApp)

			const sponsorsRef = collection(firestore, Collections.SPONSORS)
			const sponsorsSnap = await getDocs(sponsorsRef)
			const sponsors = sponsorsSnap.docs.map(e => Sponsor.fromJson(e.id, e.data() as SponsorJson))

			// -- Sort Sponsors --
			const orderingRef = doc(firestore, Collections.ORDERINGS, Collections.SPONSORS)
			const orderingSnap = await getDoc(orderingRef)
			const ordering = orderingSnap.data() as OrderingJson | undefined
			if (!ordering) throw new Error(`Sort order ${Collections.SPONSORS} not found`)
			sortWithOrdering(sponsors, ordering.ids)

			// -- Set store --
			set(sponsors)
		}
		init()
	})
	const { subscribe, update } = store

	async function createSponsor(newSponsor: Sponsor, image: File, progressStore: Writable<UploadProgress[]>) {
		// -- Convert and upload image --
		const { uploadedImageIds, size } = await convertAndUploadImages([image], StorageFolders.SPONSOR, progressStore)
		newSponsor.imageUrl = uploadedImageIds[0]

		// -- Upload document --
		// TODO comment name uniformity
		const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const newDocRef = doc(collection(firestore, Collections.SPONSORS)).withConverter(sponsorConverter)
		await setDoc(newDocRef, newSponsor)
		newSponsor.id = newDocRef.id

		// -- Update ordering --
		const existingSortedIds = get(store).map((e) => e.id)
		await updateSponsorsOrder([...existingSortedIds, newDocRef.id])

		// -- Update store(new item last) --
		update((sponsors) => ([...sponsors, newSponsor]))
		return size
	}

	async function updateSponsor(newName: string, newUrl: string, combinedImage: string | File, newVisible: boolean, sponsor: Sponsor, progressStore: Writable<UploadProgress[]>) {
		// -- Upload new image --
		if (sponsor.imageUrl !== combinedImage) {
			const imageIdsToRemove = [sponsor.imageUrl]
			await deleteImages(imageIdsToRemove.map((e) => createFirebaseStorageUrl(StorageFolders.SPONSOR.IMAGES, e)))
			await deleteImages(imageIdsToRemove.map((e) => createFirebaseStorageUrl(StorageFolders.SPONSOR.THUMBNAILS, e)))
		}

		// -- Convert and upload images --
		const { uploadedImageIds, size } = await convertAndUploadImages([combinedImage], StorageFolders.PHOTO_ALBUM, progressStore)

		// -- Update document --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const docRef = doc(firestore, Collections.SPONSORS, sponsor.id)
		await updateDoc(docRef, {
			name: newName,
			url: newUrl,
			visible: newVisible,
			imageUrl: uploadedImageIds[0]
		})

		// -- Update store --
		sponsor.name = newName
		sponsor.url = newUrl
		sponsor.imageUrl = uploadedImageIds[0]
		sponsor.updateSearchableString()
		update((sponsors) => [...sponsors])
		return size
	}

	async function deleteSponsor(sponsor: Sponsor, progressStore: Writable<number>) {
		// -- Delete images --
		progressStore.set(0)
		await deleteImages([sponsor.getImageUrl()], progressStore)
		await deleteImages([sponsor.getThumbnailUrl()], progressStore)

		// -- Delete document --
		const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const docRef = doc(firestore, Collections.SPONSORS, sponsor.id)
		await deleteDoc(docRef)

		// -- Delete from store --
		update((sponsors) => sponsors.filter((e) => e.id !== sponsor.id))

		// -- Update ordering --
		const existingSortedIds = get(store).map((e) => e.id)
		await updateSponsorsOrder(existingSortedIds)
	}

	async function updateSponsorsOrder(newSortedIds: string[]) {
		// -- Update document --
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const firestore = getFirestore(firebaseApp)

		const docRef = doc(firestore, Collections.ORDERINGS, Collections.SPONSORS)
		await updateDoc(docRef, {
			ids: newSortedIds,
		})

		// -- Update store --
		sortWithOrdering(get(store), newSortedIds)
		update((sponsors) => [...sponsors])
	}

	async function updateVisibility(sponsor: Sponsor) {
		// -- Update document --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.SPONSORS, sponsor.id)
		await updateDoc(linksRef, {
			visible: sponsor.visible
		})

		sponsor.updateSearchableString()

		// -- Update store --
		update((sponsors) => [...sponsors])
	}

	return {
		subscribe,
		createSponsor,
		updateSponsor,
		deleteSponsor,
		updateSponsorsOrder,
		updateVisibility
	}
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
if (useMock) console.warn("Mocking is on for SponsorStore")
export const sponsorStore = useMock ?
	createMockSponsorStore() :
	createSponsorStore()
// 183 lines