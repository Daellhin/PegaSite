import { browser } from '$app/environment'
import { Page, pageConverter } from '$lib/domain/Page'
import { Collections, createFirebaseStorageUrl, StorageFolders } from '$lib/firebase/Firebase'
import { arrayDifference, arraysContainSameElements } from '$lib/utils/Array'
import { convertAndUploadImages, deleteImages, UploadProgress } from '$lib/utils/UploadProgress'
import { convertStringToBool } from '$lib/utils/Utils'
import dayjs from 'dayjs'
import { Timestamp } from 'firebase/firestore'
import { get, writable, type Writable } from 'svelte/store'
import { createMockPageStore } from './mocks/MockPageHeadStore'

function createPageStore() {
	const innerStore = writable<Page[]>([])
	const { subscribe, update } = innerStore

	async function createBlankPage(id: string, title: string) {
		if (!browser) return

		const page = new Page(id, dayjs(), title, [], "")
		await createPageHelper(page)
	}

	async function createPageHelper(page: Page) {
		// -- Create page --
		const { getFirestore, doc, setDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const pageRef = doc(firestore, Collections.PAGES, page.id).withConverter(pageConverter)
		await setDoc(pageRef, page)

		// -- Update store --
		update((pages) => [...pages, page])
	}

	async function getPageById(id: string) {
		const exsistingPage = get(innerStore).find((e) => e.id === id)
		if (exsistingPage) return exsistingPage

		// -- Load page --
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const { getFirestore, doc, getDoc } = await import('firebase/firestore')
		const firestore = getFirestore(firebaseApp)

		const pageRef = doc(firestore, Collections.PAGES, id).withConverter(pageConverter)
		const pageSnap = await getDoc(pageRef)
		const data = pageSnap.data()

		if (data) update((pages) => [...pages, data])
		return data || null
	}

	async function updatePage(newTitle: string, newContent: string, combinedImages: (string | File)[], page: Page, progressStore: Writable<UploadProgress[]>) {
		// -- Delete images removed by user --
		const existingImageIds = combinedImages.filter((e) => typeof e === 'string') as string[]
		if (!arraysContainSameElements(page.images, existingImageIds)) {
			const imageIdsToRemove = arrayDifference(page.images, existingImageIds)
			await deleteImages(imageIdsToRemove.map((e) => createFirebaseStorageUrl(StorageFolders.PAGE.IMAGES, e)))
			await deleteImages(imageIdsToRemove.map((e) => createFirebaseStorageUrl(StorageFolders.PAGE.THUMBNAILS, e)))
		}

		// -- Convert and upload images --
		const { uploadedImageIds, size } = await convertAndUploadImages(combinedImages, StorageFolders.PAGE, progressStore)

		// -- Update page --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.PAGES, page.id)
		await updateDoc(linksRef, {
			title: newTitle,
			content: newContent,
			lastEdited: new Timestamp(Math.round(Date.now() / 1000), 0),
			images: uploadedImageIds
		})

		// -- Update store --
		page.title = newTitle
		page.content = newContent
		page.images = uploadedImageIds
		update((pages) => [...pages])
		return size
	}

	async function updatePageId(newId: string, oldId: string) {
		if (newId === oldId) return

		// -- Get page --
		const page = await getPageById(oldId)
		if (!page) return `No page to update at id:${oldId}`

		// -- Delete page --
		const deletePagePromise = deletePage(oldId, undefined)

		// -- Create page --
		page.id = newId
		const createPagePromise = createPageHelper(page)

		await Promise.all([deletePagePromise, createPagePromise])
	}

	/**
	 * Does not delete images when progressStore is undefined
	 */
	async function deletePage(id: string, progressStore: Writable<number> | undefined) {
		// -- Get page --
		const page = await getPageById(id)
		if (!page) return `No page to delete at id:${id}`

		// -- Delete images --
		if (progressStore) {
			progressStore.set(0)
			await deleteImages(page.getImageUrls(), progressStore)
			await deleteImages(page.getThumbnailUrls(), progressStore)
		}

		// -- Delete page --
		const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const pageRef = doc(firestore, Collections.PAGES, id).withConverter(pageConverter)
		await deleteDoc(pageRef)

		// -- Update store --
		update((pages) => pages.filter(e => e.id === id))
	}

	return {
		subscribe,
		createBlankPage,
		getPageById,
		updatePage,
		updatePageId,
		deletePage,
	}
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
if (useMock) console.warn("Mocking is on for PageStore")
export const pageStore = useMock ?
	createMockPageStore() :
	createPageStore()
