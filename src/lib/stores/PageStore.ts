import { browser } from '$app/environment'
import { Page, pageConverter } from '$lib/domain/Page'
import { Collections, StorageFolders } from '$lib/firebase/Firebase'
import { arrayDifference, arraysContainSameElements } from '$lib/utils/Array'
import { WEBP_IMAGE_QUALITY } from '$lib/utils/Constants'
import { convertStringToBool } from '$lib/utils/Utils'
import dayjs from 'dayjs'
import { Timestamp } from 'firebase/firestore'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from "uuid"
import { blobToWebP } from 'webp-converter-browser'
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

	async function updatePage(newTitle: string, newContent: string, combinedImages: (string | File)[], page: Page) {
		const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = await import('firebase/storage')
		const storage = getStorage()

		// -- Delete images removed by user --
		const excistingImages = combinedImages.filter((e) => typeof e === 'string') as string[]
		if (!arraysContainSameElements(page.images, excistingImages)) {
			const imagesToRemove = arrayDifference(page.images, excistingImages)
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
			const convertedImage = blobToWebP(image, { quality: WEBP_IMAGE_QUALITY })

			// -- Next upload and replace with url --
			const storageRef = ref(storage, `${StorageFolders.PAGE_IMAGES}/${uuidv4()}`)
			const snapshot = await uploadBytes(storageRef, await convertedImage)
			return getDownloadURL(snapshot.ref)
		}))

		// -- Update page --
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const linksRef = doc(firestore, Collections.PAGES, page.id)
		await updateDoc(linksRef, {
			title: newTitle,
			content: newContent,
			lastEdited: new Timestamp(Math.round(Date.now() / 1000), 0),
			images: newImages
		})

		// -- Update store --
		page.title = newTitle
		page.content = newContent
		page.images = newImages
		update((pages) => [...pages])
	}

	async function updatePageId(newId: string, oldId: string) {
		if (newId === oldId) return

		// -- Get page --
		const page = await getPageById(oldId)
		if (!page) return `No page to update at id:${oldId}`

		// -- Delete page --
		const deletePagePromise = deletePage(oldId, false)

		// -- Create page --
		page.id = newId
		const createPagePromise = createPageHelper(page)

		await Promise.all([deletePagePromise, createPagePromise])
	}

	async function deletePage(id: string, deleteImages = true) {
		// -- Get page --
		const page = await getPageById(id)
		if (!page) return `No page to delete at id:${id}`

		// -- Delete images --
		if (deleteImages && page.images) {
			const { getStorage, ref, deleteObject } = await import('firebase/storage')
			const storage = getStorage()

			await Promise.all(page.images.map(async (image) => {
				const imageRef = ref(storage, image)
				await deleteObject(imageRef)
			}))
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
