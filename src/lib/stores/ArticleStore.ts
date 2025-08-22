import { browser } from '$app/environment'
import { Article, articleConverter } from '$lib/domain/Article'
import { Collections, createFirebaseStorageUrl, StorageFolders } from '$lib/firebase/Firebase'
import { arrayDifference, arraysContainSameElements } from '$lib/utils/Array'
import { WEBP_IMAGE_QUALITY } from '$lib/utils/Constants'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Dayjs } from 'dayjs'
import { Timestamp, where, type QueryDocumentSnapshot } from 'firebase/firestore'
import { get, writable, type Writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'
import { blobToWebP } from 'webp-converter-browser'
import { authStore } from './AuthStore'
import { createMockArticleStore } from './mocks/MockArticleStore'
import { convertAndUploadImages, deleteImages, UploadProgress } from '$lib/utils/UploadProgress'

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

	async function createArticle(newArticle: Article, images: File[], progressStore: Writable<UploadProgress[]>) {
		// -- Convert and upload images --
		const { uploadedImageIds, size } = await convertAndUploadImages(images, StorageFolders.ARTICLE, progressStore)
		newArticle.imageIds = uploadedImageIds

		// -- Upload article --
		const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const newDocRef = doc(collection(firestore, Collections.ARTICLES)).withConverter(articleConverter)
		newArticle.id = newDocRef.id
		await setDoc(newDocRef, newArticle)

		// -- Update store --
		update((articles) => ([newArticle, ...(articles)]))
		return size
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

	async function updateArticle(newAuthors: string[], newTags: string[], newTitle: string, newContent: string, lastUpdate: Dayjs, combinedImages: (string | File)[], visible: boolean, article: Article, progressStore: Writable<UploadProgress[]>) {
		// -- Delete images removed by user --
		const existingImageIds = combinedImages.filter((e) => typeof e === 'string') as string[]
		if (!arraysContainSameElements(article.imageIds||[], existingImageIds)) {
			const imageIdsToRemove = arrayDifference(article.imageIds, existingImageIds)
			await deleteImages(imageIdsToRemove.map((e) => createFirebaseStorageUrl(StorageFolders.ARTICLE.IMAGES, e)))
			await deleteImages(imageIdsToRemove.map((e) => createFirebaseStorageUrl(StorageFolders.ARTICLE.THUMBNAILS, e)))
		}

		// -- Convert and upload images --
		const { uploadedImageIds, size } = await convertAndUploadImages(combinedImages, StorageFolders.ARTICLE, progressStore)

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
			imageIds: uploadedImageIds,
			visible: visible
		})

		// -- Update store --
		article.authors = newAuthors
		article.tags = newTags
		article.title = newTitle
		article.content = newContent
		article.imageIds = uploadedImageIds
		article.lastUpdate = lastUpdate
		article.visible = visible
		article.updateSearchableString()
		update((articles) => [...articles])
		return size
	}

	async function deleteArticle(article: Article, progressStore: Writable<number>) {
		// -- Remove images --
		progressStore.set(0)
		await deleteImages(article.getImageUrls(), progressStore)
		await deleteImages(article.getThumbnailUrls(), progressStore)

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
