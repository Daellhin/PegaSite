import { browser } from '$app/environment'
import { PhotoAlbum, photoAlbumConverter, type PhotoAlbumJson } from '$lib/domain/PhotoAlbum'
import { Collections, StorageFolders } from '$lib/firebase/Firebase'
import { arrayDifference, arraysContainSameElements } from '$lib/utils/Array'
import { WEBP_IMAGE_QUALITY } from '$lib/utils/Constants'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Dayjs } from 'dayjs'
import { writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'
import { blobToWebP } from 'webp-converter-browser'

/**
 * Source: https://www.captaincodeman.com/lazy-loading-and-querying-firestore-with-sveltekit
 */
function createPhotoAlbumStore() {
	const store = writable<(PhotoAlbum)[]>(undefined, set => {
		async function init() {
			if (!browser) return

			// -- Load PhotoAlbums --
			const { firebaseApp } = await import('$lib/firebase/Firebase')
			const { getFirestore, getDocs, getDoc, doc, collection } = await import('firebase/firestore')
			const firestore = getFirestore(firebaseApp)

			const photoAlbumsRef = collection(firestore, Collections.PHOTO_ALBUMS)
			const photoAlbumsSnap = await getDocs(photoAlbumsRef)
			const photoAlbums = photoAlbumsSnap.docs.map(e => PhotoAlbum.fromJson(e.id, e.data() as PhotoAlbumJson))

			// -- Set store --
			set(photoAlbums)
		}
		init()
	})
	const { subscribe, update } = store

	async function createPhotoAlbum(newPhotoAlbum: PhotoAlbum, images: File[]) {
		// -- Convert images --
		const convertedImages = await Promise.all(
			images.map((e) => blobToWebP(e, { quality: WEBP_IMAGE_QUALITY }))
		)

		// -- Upload images --
		const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
		const storage = getStorage()

		const uploadedImageLinks = await Promise.all(convertedImages.map(async (image) => {
			const storageRef = ref(storage, `${StorageFolders.PHOTO_ALBUM_IMAGES}/${uuidv4()}`)
			const snapshot = await uploadBytes(storageRef, image)
			return await getDownloadURL(snapshot.ref)
		}))
		newPhotoAlbum.imageUrls = uploadedImageLinks

		// -- Upload photo album --
		const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const newDocRef = doc(collection(firestore, Collections.PHOTO_ALBUMS)).withConverter(photoAlbumConverter)
		newPhotoAlbum.id = newDocRef.id
		await setDoc(newDocRef, newPhotoAlbum)

		// -- Update store(new item first) --
		update((photoAlbums) => ([newPhotoAlbum, ...(photoAlbums || [])]))
	}

	async function updatePhotoAlbum(newTitle: string, newVisible: boolean, newAuthor: string, newAuthorUrl: string, newDate: Dayjs, combinedImages: (string | File)[], photoAlbum: PhotoAlbum) {
		const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = await import('firebase/storage')
		const storage = getStorage()

		// -- Delete images removed by user --
		const excistingImages = combinedImages.filter((e) => typeof e === 'string') as string[]
		if (!arraysContainSameElements(photoAlbum.imageUrls, excistingImages)) {
			const imagesToRemove = arrayDifference(photoAlbum.imageUrls, excistingImages)
			await Promise.all(imagesToRemove.map(async (image) => {
				try {
					const imageRef = ref(storage, image)
					await deleteObject(imageRef)
				} catch (error: any) {
					// Not existing images can be safely ignored
					if (error.code !== 'storage/object-not-found')
						throw error
				}
			}))
		}

		// -- Upload images, and replace files with urls --
		const newImages = await Promise.all(combinedImages.map(async (image) => {
			// -- Keep existing url --
			if (!(image instanceof File)) return image

			// -- First convert to webp --
			const convertedImage = blobToWebP(image, { quality: WEBP_IMAGE_QUALITY })

			// -- Next upload and replace with url --
			const storageRef = ref(storage, `page-images/${uuidv4()}`)
			const snapshot = await uploadBytes(storageRef, await convertedImage)
			return getDownloadURL(snapshot.ref)
		}))

		// -- Update photo album --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.PHOTO_ALBUMS, photoAlbum.id)
		await updateDoc(linksRef, {
			title: newTitle,
			visible: newVisible,
			author: newAuthor,
			authorUrl: newAuthorUrl,
			imageUrls: newImages
		})

		// -- Update store --
		photoAlbum.title = newTitle
		photoAlbum.visible = newVisible
		photoAlbum.author = newAuthor
		photoAlbum.authorUrl = newAuthorUrl
		photoAlbum.imageUrls = newImages

		photoAlbum.updateSearchableString()
		update((photoAlbums) => [...photoAlbums])
	}

	async function deletePhotoAlbum(photoAlbum: PhotoAlbum) {
		// -- Remove images --
		const { getStorage, ref, deleteObject } = await import('firebase/storage')
		const storage = getStorage()

		await Promise.all(photoAlbum.imageUrls.map(async (image) => {
			try {
				const storageRef = ref(storage, image)
				await deleteObject(storageRef)
			} catch (error: any) {
				// Not existing images can be safely ignored
				if (error.code !== 'storage/object-not-found')
					throw error
			}
		}))

		// -- Remove photo album --
		const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		await deleteDoc(doc(firestore, Collections.PHOTO_ALBUMS, photoAlbum.id))

		// -- Remove from store --
		update((photoAlbums) => (photoAlbums.filter((e) => e.id !== photoAlbum.id)))
	}

	async function updateVisibility(photoAlbum: PhotoAlbum) {
		// -- Update photo album --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.PHOTO_ALBUMS, photoAlbum.id)
		await updateDoc(linksRef, {
			visible: photoAlbum.visible
		})

		photoAlbum.updateSearchableString()
		// -- Update store --
		update((photoAlbums) => [...photoAlbums])
	}

	return {
		subscribe,
		createPhotoAlbum,
		updatePhotoAlbum,
		updateVisibility,
		deletePhotoAlbum,
	}
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
if (useMock) console.warn("Mocking is not implemented for PhotoAlbumStore")
// export const photoAlbumStore = useMock ?
// 	createMockPhotoAlbumStore() :
// 	createPhotoAlbumStore()
export const photoAlbumStore = createPhotoAlbumStore()
