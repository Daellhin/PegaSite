import { browser } from '$app/environment'
import { PhotoAlbum, photoAlbumConverter, type PhotoAlbumJson } from '$lib/domain/PhotoAlbum'
import { Collections, createFirebaseStorageUrl, StorageFolders } from '$lib/firebase/Firebase'
import { arrayDifference, arraysContainSameElements } from '$lib/utils/Array'
import { convertAndUploadImages, deleteImages, UploadProgress } from '$lib/utils/UploadProgress'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Dayjs } from 'dayjs'
import saveAs from 'file-saver'
import JSZip from 'jszip'
import pLimit from 'p-limit'
import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'
import { createMockPhotoAlbumStore } from './mocks/MockPhotoAlbumStore'

/**
 * Source: https://www.captaincodeman.com/lazy-loading-and-querying-firestore-with-sveltekit
 */
function createPhotoAlbumStore() {
	const store = writable<(PhotoAlbum)[]>(undefined, set => {
		async function init() {
			if (!browser) return

			// -- Load PhotoAlbums --
			const { firebaseApp } = await import('$lib/firebase/Firebase')
			const { getFirestore, getDocs, collection } = await import('firebase/firestore')
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
		// -- Convert and upload images --
		const { uploadedImageIds, size } = await convertAndUploadImages(images, StorageFolders.PHOTO_ALBUM, progressStore)
		newPhotoAlbum.imageIds = uploadedImageIds

		// -- Upload photo album --
		const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const newDocRef = doc(collection(firestore, Collections.PHOTO_ALBUMS)).withConverter(photoAlbumConverter)
		newPhotoAlbum.id = newDocRef.id
		await setDoc(newDocRef, newPhotoAlbum)

		// -- Update store(new item first) --
		update((photoAlbums) => ([newPhotoAlbum, ...(photoAlbums || [])]))
		return size
	}

	async function updatePhotoAlbum(newTitle: string, newVisible: boolean, newAuthor: string, newAuthorUrl: string, newDate: Dayjs, combinedImages: (string | File)[], photoAlbum: PhotoAlbum, progressStore: Writable<UploadProgress[]>) {
		// -- Delete images removed by user --
		const existingImageIds = combinedImages.filter((e) => typeof e === 'string') as string[]
		if (!arraysContainSameElements(photoAlbum.imageIds, existingImageIds)) {
			const imageIdsToRemove = arrayDifference(photoAlbum.imageIds, existingImageIds)
			await deleteImages(imageIdsToRemove.map((e) => createFirebaseStorageUrl(StorageFolders.PHOTO_ALBUM.IMAGES, e)))
			await deleteImages(imageIdsToRemove.map((e) => createFirebaseStorageUrl(StorageFolders.PHOTO_ALBUM.THUMBNAILS, e)))
		}

		// -- Convert and upload images --
		const { uploadedImageIds, size } = await convertAndUploadImages(combinedImages, StorageFolders.PHOTO_ALBUM, progressStore)

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
			date: newDate.toDate(),
			imageIds: uploadedImageIds
		})

		// -- Update store --
		photoAlbum.title = newTitle
		photoAlbum.visible = newVisible
		photoAlbum.author = newAuthor
		photoAlbum.authorUrl = newAuthorUrl
		photoAlbum.date = newDate
		photoAlbum.imageIds = uploadedImageIds
		photoAlbum.updateSearchableString()

		update((photoAlbums) => [...photoAlbums])
		return size
	}

	async function deletePhotoAlbum(photoAlbum: PhotoAlbum, progressStore: Writable<number>) {
		// -- Remove images --
		progressStore.set(0)
		await deleteImages(photoAlbum.getImageUrls(), progressStore)
		await deleteImages(photoAlbum.getThumbnailUrls(), progressStore)

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

	async function downloadZip(photoAlbum: PhotoAlbum, progressStore: Writable<number>) {
		progressStore.set(0)
		const zip = new JSZip()
		const limit = pLimit(4)

		await Promise.all(
			photoAlbum.getImageUrls().map(async (url, index) => limit(async () => {
				const response = await fetch(url)
				const blob = await response.blob()
				progressStore.update((progress) => progress + 1)
				zip.file(`afbeelding${index + 1}.webp`, blob)
			}))
		)

		const content = await zip.generateAsync({ type: "blob" })
		saveAs(content, `${photoAlbum.title}.zip`)
	}

	return {
		subscribe,
		createPhotoAlbum,
		updatePhotoAlbum,
		updateVisibility,
		deletePhotoAlbum,
		downloadZip
	}
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
if (useMock) console.warn("Mocking is on for PhotoAlbumStore")
export const photoAlbumStore = useMock ?
	createMockPhotoAlbumStore() :
	createPhotoAlbumStore()
