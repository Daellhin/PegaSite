import { browser } from '$app/environment'
import type { OrderingJson } from '$lib/domain/Ordering'
import { Sponsor, sponsorConverter, type SponsorJson } from '$lib/domain/Sponsor'
import { Collections, StorageFolders } from '$lib/firebase/Firebase'
import { WEBP_IMAGE_QUALITY } from '$lib/utils/Constants'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from "uuid"
import { blobToWebP } from 'webp-converter-browser'
import { createMockSponsorStore } from './mocks/MockSponsorStore'
import { convertStringToBool } from '$lib/utils/Utils'
import { sortWithOrdering } from '$lib/utils/Stores'

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

	async function createSponsor(sponsor: Sponsor, image: File) {
		// -- Convert image --
		const convertedImage = await blobToWebP(image, { quality: WEBP_IMAGE_QUALITY })

		// -- Upload image --
		const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
		const storage = getStorage()

		const storageRef = ref(storage, `${StorageFolders.SPONSOR_IMAGES}/${uuidv4()}`)
		const snapshot = await uploadBytes(storageRef, convertedImage)
		const uploadedImage = await getDownloadURL(snapshot.ref)
		sponsor.imageUrl = uploadedImage

		// -- Upload document --
		const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const newDocRef = doc(collection(firestore, Collections.SPONSORS)).withConverter(sponsorConverter)
		await setDoc(newDocRef, sponsor)
		sponsor.id = newDocRef.id

		// -- Update ordering --
		const existingSortedIds = get(store).map((e) => e.id)
		await updateSponsorsOrder([...existingSortedIds, newDocRef.id])

		// -- Update store(new item last) --
		update((sponsors) => ([...sponsors, sponsor]))
	}

	async function updateSponsor(newName: string, newUrl: string, newImage: string | File, newVisible: boolean, sponsor: Sponsor) {
		// -- Upload new image --
		let newImageUrl = ""
		if (newImage instanceof File) {
			const { getStorage, ref, uploadBytes } = await import('firebase/storage')
			const storage = getStorage()

			const convertedImage = await blobToWebP(newImage, { quality: WEBP_IMAGE_QUALITY })
			const imageRef = ref(storage, sponsor.imageUrl)
			await uploadBytes(imageRef, convertedImage)
			newImageUrl = `${sponsor.imageUrl}#${new Date().getTime()}` // Force reload cache
		}

		// -- Update document --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const docRef = doc(firestore, Collections.SPONSORS, sponsor.id)
		const updates: any = {
			name: newName,
			url: newUrl,
			visible: newVisible
		}
		if (newImageUrl) updates["imageUrl"] = newImageUrl
		await updateDoc(docRef, updates)

		// -- Update store --
		sponsor.name = newName
		sponsor.url = newUrl
		sponsor.imageUrl = newImageUrl || sponsor.imageUrl
		sponsor.updateSearchableString()
		update((sponsors) => [...sponsors])
	}

	async function deleteSponsor(sponsor: Sponsor) {
		// -- Delete image --
		const { getStorage, ref, deleteObject } = await import('firebase/storage')
		const storage = getStorage()

		try {
			const storageRef = ref(storage, sponsor.imageUrl)
			await deleteObject(storageRef)
		} catch (error: any) {
			// Not existing images can be safely ignored
			if (error.code !== 'storage/object-not-found') throw error
		}

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
