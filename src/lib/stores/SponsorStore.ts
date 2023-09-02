import { browser } from '$app/environment'
import { Sponsor, sponsorConverter, type SponsorJson } from '$lib/domain/Sponsor'
import { Collections, StorageFolders } from '$lib/firebase/Firebase'
import { WEBP_IMAGE_QUALITY } from '$lib/utils/Constants'
import { writable } from 'svelte/store'
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
			const { getFirestore, getDocs, collection } = await import('firebase/firestore')
			const firestore = getFirestore(firebaseApp)

			const sponsorsRef = collection(firestore, Collections.SPONSORS)
			const sponsorsSnap = await getDocs(sponsorsRef)
			const sponsors = sponsorsSnap.docs.map(e => Sponsor.fromJson(e.id, e.data() as SponsorJson))

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
			console.log(WEBP_IMAGE_QUALITY)
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

	return {
		subscribe,
		createSponsor,
		updateSponsor,
		deleteSponsor,
	}
}

export const sponsorStore = createSponsorStore()
