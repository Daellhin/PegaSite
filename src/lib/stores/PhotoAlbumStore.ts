import { browser } from '$app/environment'
import { PhotoAlbum, photoAlbumConverter, type PhotoAlbumJson } from '$lib/domain/PhotoAlbum'
import { Collections, StorageFolders } from '$lib/firebase/Firebase'
import { arrayDifference, arraysContainSameElements } from '$lib/utils/Array'
import { WEBP_IMAGE_QUALITY } from '$lib/utils/Constants'
import { UploadProgress } from '$lib/utils/UploadProgress'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Dayjs } from 'dayjs'
import pLimit from 'p-limit'
import type { Writable } from 'svelte/store'
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

	async function createPhotoAlbum(newPhotoAlbum: PhotoAlbum, images: File[], progressStore: Writable<UploadProgress[]>) {
		const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
		const storage = getStorage()

		// -- Convert and upload images, and replace files with urls(limits the amount of concurent tasks) --
		progressStore.set(images.map(() => UploadProgress.NOT_STARTED))
		const limit = pLimit(5)

		const uploadedImageLinks = await Promise.all(images.map(async (image, index) => {
			return limit(async () => {
				// -- First convert to webp --
				const convertedImage = blobToWebP(image, { quality: WEBP_IMAGE_QUALITY })
				progressStore.update((progress) => [...progress.map((e, i) => i === index ? UploadProgress.UPLOADING : e)])

				// -- Next upload and replace with url --
				const storageRef = ref(storage, `${StorageFolders.PHOTO_ALBUM_IMAGES}/${uuidv4()}`)
				const snapshot = await uploadBytes(storageRef, await convertedImage)
				const url = await getDownloadURL(snapshot.ref)
				progressStore.update((progress) => [...progress.map((e, i) => i === index ? UploadProgress.DONE : e)])
				return url
			})
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

	async function updatePhotoAlbum(newTitle: string, newVisible: boolean, newAuthor: string, newAuthorUrl: string, newDate: Dayjs, combinedImages: (string | File)[], photoAlbum: PhotoAlbum, progressStore: Writable<UploadProgress[]>) {
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

		// -- Convert and upload images, and replace files with urls(limits the amount of concurent tasks) --
		progressStore.set(combinedImages.map(() => UploadProgress.NOT_STARTED))
		const limit = pLimit(5)

		const newImages = await Promise.all(combinedImages.map(async (image, index) => {
			return limit(async () => {
				// -- Keep existing url --
				if (!(image instanceof File)) return image
				progressStore.update((progress) => [...progress.map((e, i) => i === index ? UploadProgress.CONVERTING : e)])

				// -- First convert to webp --
				const convertedImage = blobToWebP(image, { quality: WEBP_IMAGE_QUALITY })
				progressStore.update((progress) => [...progress.map((e, i) => i === index ? UploadProgress.UPLOADING : e)])

				// -- Next upload and replace with url --
				const storageRef = ref(storage, `${StorageFolders.PHOTO_ALBUM_IMAGES}/${uuidv4()}`)
				const snapshot = await uploadBytes(storageRef, await convertedImage)
				const url = await getDownloadURL(snapshot.ref)
				progressStore.update((progress) => [...progress.map((e, i) => i === index ? UploadProgress.DONE : e)])
				return url
			})
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