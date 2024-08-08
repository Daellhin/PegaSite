import { browser } from '$app/environment'
import { Article } from '$lib/domain/Article'
import { PhotoAlbum, photoAlbumConverter, type PhotoAlbumJson } from '$lib/domain/PhotoAlbum'
import { Collections, StorageFolders } from '$lib/firebase/Firebase'
import { arrayDifference, arraysContainSameElements } from '$lib/utils/Array'
import { WEBP_IMAGE_QUALITY } from '$lib/utils/Constants'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Dayjs } from 'dayjs'
import { Timestamp } from 'firebase/firestore'
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

			// -- Sort Sponsors --
			// const orderingRef = doc(firestore, Collections.ORDERINGS, Collections.SPONSORS)
			// const orderingSnap = await getDoc(orderingRef)
			// const ordering = orderingSnap.data() as OrderingJson | undefined
			// if (!ordering) throw new Error(`Sort order ${Collections.SPONSORS} not found`)
			// sortSponsors(sponsors, ordering.ids)

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

	// async function getArticleById(id: string) {
	// 	const exsistingArticle = get(innerStore).find((e) => e.id === id)
	// 	if (exsistingArticle) return exsistingArticle

	// 	// -- Load page --
	// 	const { firebaseApp } = await import('$lib/firebase/Firebase')
	// 	const { getFirestore, doc, getDoc } = await import('firebase/firestore')
	// 	const firestore = getFirestore(firebaseApp)

	// 	const articleRef = doc(firestore, Collections.ARTICLES, id).withConverter(articleConverter)
	// 	const articleSnap = await getDoc(articleRef)
	// 	const article = articleSnap.data()


	// 	return article || null
	// }

	async function updatePhotoAlbum(newAuthors: string[], newTags: string[], newTitle: string, newContent: string, lastUpdate: Dayjs, combinedImages: (string | File)[], visible: boolean, article: Article) {
		const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = await import('firebase/storage')
		const storage = getStorage()

		// -- Delete images removed by user --
		const excistingImages = combinedImages.filter((e) => typeof e === 'string') as string[]
		if (!arraysContainSameElements(article.images, excistingImages)) {
			const imagesToRemove = arrayDifference(article.images, excistingImages)
			await Promise.all(imagesToRemove.map(async (image) => {
				const imageRef = ref(storage, image)
				await deleteObject(imageRef)
			}))
		}

		// -- Upload images, and replace files with urls --
		const newImages = await Promise.all(combinedImages.map(async (image) => {
			// -- Keep existing url --
			if (!(image instanceof File)) return image

			// -- First convert to webp --
			const convertedImage = blobToWebP(image, { quality: 90 })

			// -- Next upload and replace with url --
			const storageRef = ref(storage, `page-images/${uuidv4()}`)
			const snapshot = await uploadBytes(storageRef, await convertedImage)
			return getDownloadURL(snapshot.ref)
		}))

		// -- Update article --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.ARTICLES, article.id)
		await updateDoc(linksRef, {
			authors: newAuthors,
			tags: newTags,
			title: newTitle,
			content: newContent,
			lastUpdate: new Timestamp(Math.round(Date.now() / 1000), 0),
			images: newImages,
			visible: visible
		})

		// -- Update store --
		article.authors = newAuthors
		article.tags = newTags
		article.title = newTitle
		article.content = newContent
		article.images = newImages
		article.lastUpdate = lastUpdate
		article.visible = visible
		article.updateSearchableString()
		update((articles) => [...articles])
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

	async function updateVisibility(article: Article) {
		// -- Update article --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.ARTICLES, article.id)
		await updateDoc(linksRef, {
			visible: article.visible
		})

		article.updateSearchableString()
		// -- Update store --
		update((pages) => [...pages])
	}

	return {
		subscribe,
		createPhotoAlbum,
		//getArticleById,
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
