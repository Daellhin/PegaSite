import { browser } from '$app/environment'
import type { OrderingJson } from '$lib/domain/Ordering'
import { Sponsor, sponsorConverter, type SponsorJson } from '$lib/domain/Sponsor'
import { Collections, StorageFolders } from '$lib/firebase/Firebase'
import { WEBP_IMAGE_QUALITY } from '$lib/utils/Constants'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from "uuid"
import { blobToWebP } from 'webp-converter-browser'

/**
 * Store that handles managing users, meant for use by admin users
 */
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
			sortSponsors(sponsors, ordering.ids)

			// -- Set store --
			set(sponsors)
		}
		init()
	})
	const { subscribe, update } = store

	async function createSponsor(sponsor: Sponsor, image: File) {
		// -- Convert images --
		const convertedImage = await blobToWebP(image, { quality: WEBP_IMAGE_QUALITY })

		// -- Upload image --
		const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
		const storage = getStorage()

		const storageRef = ref(storage, `${StorageFolders.SPONSOR_IMAGES}/${uuidv4()}`)
		const snapshot = await uploadBytes(storageRef, convertedImage)
		const uploadedImage = await getDownloadURL(snapshot.ref)
		sponsor.imageUrl = uploadedImage

		// -- Upload article --
		const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const newDocRef = doc(collection(firestore, Collections.SPONSORS)).withConverter(sponsorConverter)
		await setDoc(newDocRef, sponsor)

		// -- Update store --
		update((sponsors) => ([...sponsors, sponsor]))
	}

	async function updateSponsor(newName: string, newUrl: string, newImage: File | undefined, sponsor: Sponsor) {
		// -- Update image --
		const { getStorage, ref, uploadBytes } = await import('firebase/storage')
		const storage = getStorage()

		if (newImage) {
			const convertedImage = await blobToWebP(newImage, { quality: WEBP_IMAGE_QUALITY })
			const imageRef = ref(storage, sponsor.imageUrl)
			await uploadBytes(imageRef, convertedImage)
		}

		// -- Update article --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.SPONSORS, sponsor.id)
		await updateDoc(linksRef, {
			name: newName,
			url: newUrl
		})

		// -- Update store --
		sponsor.name = newName
		sponsor.url = newUrl
		update((sponsors) => [...sponsors])
	}

	async function deleteSponsor(sponsor: Sponsor) {
		// -- Remove image --
		const { getStorage, ref, deleteObject } = await import('firebase/storage')
		const storage = getStorage()

		try {
			const storageRef = ref(storage, sponsor.imageUrl)
			await deleteObject(storageRef)
		} catch (error: any) {
			// Not existing images can be safely ignored
			if (error.code !== 'storage/object-not-found')
				throw error
		}

		// -- Remove sponsor --
		const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		await deleteDoc(doc(firestore, Collections.SPONSORS, sponsor.id))

		// -- Remove from store --
		update((sponsors) => (sponsors.filter((e) => e.id !== sponsor.id)))
	}

	async function updateSponsorsOrder(newSortedIds: string[]) {
		// -- Update ordering --
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const firestore = getFirestore(firebaseApp)

		const orderingRef = doc(firestore, Collections.ORDERINGS, Collections.SPONSORS)
		await updateDoc(orderingRef, {
			ids: newSortedIds,
		})

		// -- Update store --
		sortSponsors(get(store), newSortedIds)
		update((sponsors) => [...sponsors])
	}

	function sortSponsors(sponsors: Sponsor[], sortedIds: string[]) {
		const sortMap = new Map(sortedIds.map((e, i) => [e, i] as [string, number]))
		sponsors.sort((a, b) => {
			const first = sortMap.get(a.id)
			if (first === undefined) throw new Error(`Sponsor ${a.id} not found in sort map`)
			const second = sortMap.get(b.id)
			if (second === undefined) throw new Error(`Sponsor ${b.id} not found in sort map`)
			return first - second
		})
	}

	return {
		subscribe,
		createSponsor,
		updateSponsor,
		deleteSponsor,
		updateSponsorsOrder
	}
}

export const sponsorStore = createSponsorStore()
