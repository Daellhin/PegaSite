import { browser } from '$app/environment'
import { Article, articleConverter } from '$lib/domain/Article'
import { Collections, StorageFolders } from '$lib/firebase/Firebase'
import { arrayDifference, arraysContainSameElements } from '$lib/utils/Array'
import { WEBP_IMAGE_QUALITY } from '$lib/utils/Constants'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Dayjs } from 'dayjs'
import { Timestamp, where, type QueryDocumentSnapshot } from 'firebase/firestore'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'
import { blobToWebP } from 'webp-converter-browser'
import { authStore } from './AuthStore'
import { createMockArticleStore } from './mocks/MockArticleStore'

/**
 * Pagination size is used to load articles in batches. 
 * One article of next batch is always atempted to be loaded. 
 * This is to check if there are items in the next batch
 */
export let globalPaginationSize = 8
export function setGlobalPaginationSize(size: number) {
	globalPaginationSize = size
}

/**
 * Source: https://www.captaincodeman.com/lazy-loading-and-querying-firestore-with-sveltekit
 */
function createArticleStore() {
	let lastRef: QueryDocumentSnapshot<Article> | undefined
	let hasMoreDocuments = true

	const innerStore = writable<Article[]>(undefined, () => {
		async function init() {
			if (!browser) return
			await loadMoreArticles()
		}
		init()
	})
	const { subscribe, update } = innerStore

	const known = new Promise<void>(resolve => {
		let unsub = () => { }
		unsub = subscribe(articles => {
			if (articles !== undefined) {
				resolve()
				unsub()
			}
		})
	})

	async function loadMoreArticles(limitValue: number = globalPaginationSize) {
		if (!hasMoreDocuments) return

		// -- Load articles --
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const { getFirestore, collection, query, orderBy, limit, getDocs, startAfter } = await import('firebase/firestore')
		const firestore = getFirestore(firebaseApp)

		// For admins, load both hidden and visible articles, but make sure visible articles reach limit value
		await authStore.known
		const user = get(authStore)
		const newArticles = Array<Article>()
		do {
			const q = query(
				collection(firestore, Collections.ARTICLES),
				orderBy('createdAt', 'desc'),
				...(user ? [] : [where('visible', '==', true)]),
				...(lastRef ? [startAfter(lastRef)] : []),
				limit(limitValue)
			).withConverter(articleConverter)
			const snapshot = await getDocs(q)
			newArticles.push(...snapshot.docs.map(e => e.data()))
			lastRef = snapshot.docs.at(-1)
			hasMoreDocuments = snapshot.docs.length === globalPaginationSize + 1
		} while (hasMoreDocuments && newArticles.filter(e => e.visible).length < limitValue)

		// -- Update articles --
		update((articles) => ([...(articles || []), ...newArticles]))
	}

	async function createArticle(newArticle: Article, images: File[]) {
		// -- Convert images --
		const convertedImages = await Promise.all(
			images.map((e) => blobToWebP(e, { quality: WEBP_IMAGE_QUALITY }))
		)

		// -- Upload images --
		const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
		const storage = getStorage()

		const uploadedImageLinks = await Promise.all(convertedImages.map(async (image) => {
			const storageRef = ref(storage, `${StorageFolders.ARTICLE_IMAGES}/${uuidv4()}`)
			const snapshot = await uploadBytes(storageRef, image)
			return await getDownloadURL(snapshot.ref)
		}))
		newArticle.images = uploadedImageLinks

		// -- Upload article --
		const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const newDocRef = doc(collection(firestore, Collections.ARTICLES)).withConverter(articleConverter)
		newArticle.id = newDocRef.id
		await setDoc(newDocRef, newArticle)

		// -- Update store --
		if (get(innerStore))
			update((articles) => ([newArticle, ...(articles)]))
	}

	async function getArticleById(id: string) {
		const exsistingArticle = get(innerStore).find((e) => e.id === id)
		if (exsistingArticle) return exsistingArticle

		// -- Load page --
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const { getFirestore, doc, getDoc } = await import('firebase/firestore')
		const firestore = getFirestore(firebaseApp)

		const articleRef = doc(firestore, Collections.ARTICLES, id).withConverter(articleConverter)
		const articleSnap = await getDoc(articleRef)
		const article = articleSnap.data()


		return article || null
	}

	async function updateArticle(newAuthors: string[], newTags: string[], newTitle: string, newContent: string, lastUpdate: Dayjs, combinedImages: (string | File)[], visible: boolean, article: Article) {
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
			const convertedImage = blobToWebP(image, { quality: WEBP_IMAGE_QUALITY })

			// -- Next upload and replace with url --
			const storageRef = ref(storage, `${StorageFolders.ARTICLE_IMAGES}/${uuidv4()}`)
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

	async function deleteArticle(article: Article) {
		// -- Remove images --
		const { getStorage, ref, deleteObject } = await import('firebase/storage')
		const storage = getStorage()

		await Promise.all(article.images.map(async (image) => {
			try {
				const storageRef = ref(storage, image)
				await deleteObject(storageRef)
			} catch (error: any) {
				// Not existing images can be safely ignored
				if (error.code !== 'storage/object-not-found')
					throw error
			}
		}))

		// -- Remove article --
		const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		await deleteDoc(doc(firestore, Collections.ARTICLES, article.id))

		// -- Remove from store --
		update((articles) => (articles.filter((e) => e.id !== article.id)))
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
		update((articles) => [...articles])
	}

	return {
		subscribe,
		loadMoreArticles,
		createArticle,
		getArticleById,
		updateArticle,
		updateVisibility,
		deleteArticle,
		known
	}
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
if (useMock) console.warn("Mocking is on for ArticleStore")
export const articleStore = useMock ?
	createMockArticleStore() :
	createArticleStore()
