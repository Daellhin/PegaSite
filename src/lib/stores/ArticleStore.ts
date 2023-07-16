import { browser } from '$app/environment'
import { ARTICLES_JSON } from '$data/ArticlesJson'
import { Article, articleConverter } from '$lib/domain/Article'
import { Collections } from '$lib/firebase/Firebase'
import { arrayDifference, containArraysSameElements } from '$lib/utils/Array'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Dayjs } from 'dayjs'
import { Timestamp, type QueryDocumentSnapshot } from 'firebase/firestore'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

/**
 * Pagination size is used to load articles in batches. 
 * One article of next batch is always atempted to be loaded. 
 * This is to check if there are items in the next batch
 */
export const paginationSize = 8

function createMockArticleStore() {
  const innerStore = writable<Article[]>(undefined, set => {
    const articles = ARTICLES_JSON.map(Article.fromJson)
    set(articles)
  })
  const { subscribe, update } = innerStore

  async function addArticle(newArticle: Article, images: File[]) {
    update((articles) => ([newArticle, ...articles]))
  }
  async function updateArticle(newAuthors: string[], newTags: string[], newTitle: string, newContent: string, lastUpdate: Dayjs, uploadedImages: File[], newExcistingImages: string[], article: Article) {
  }
  async function removeArticle(article: Article) {
    update((articles) => (articles.filter((e) => e.id !== article.id)))
  }
  async function loadMoreArticles() {
    return
  }
  async function getArticleById(id: string) {
    const exsistingArticle = get(innerStore).find((e) => e.id === id)
    return exsistingArticle || null
  }

  return {
    subscribe,
    addArticle,
    updateArticle,
    removeArticle,
    loadMoreArticles,
    getArticleById
  }
}

/**
 * Source: https://www.captaincodeman.com/lazy-loading-and-querying-firestore-with-sveltekit
 */
function createArticleStore() {
  let lastRef: QueryDocumentSnapshot<Article>
  let hasMoreDocuments = true

  const innerStore = writable<Article[]>(undefined, set => {
    async function init() {
      if (!browser) return

      // -- Load articles --
      const { firebaseApp } = await import('$lib/firebase/Firebase')
      const { getFirestore, collection, query, orderBy, limit, getDocs } = await import('firebase/firestore')
      const firestore = getFirestore(firebaseApp)

      const q = query(
        collection(firestore, Collections.ARTICLES),
        orderBy('createdAt', 'desc'),
        limit(paginationSize + 1)
      ).withConverter(articleConverter)
      const snapshot = await getDocs(q)

      // -- Set store --
      const articles = snapshot.docs.map(e => e.data())
      set(articles)

      // -- Setup pagination --
      lastRef = snapshot.docs.slice(-1)[0]
      hasMoreDocuments = snapshot.docs.length === paginationSize + 1
    }
    init()
  })
  const { subscribe, update } = innerStore

  async function addArticle(newArticle: Article, images: File[]) {
    if (!browser) return

    // -- Upload images --
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
    const storage = getStorage()

    const uploadedImageLinks = await Promise.all(images.map(async (image) => {
      const storageRef = ref(storage, `article-images/${uuidv4()}`)
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
    update((articles) => ([newArticle, ...articles]))
  }

  async function updateArticle(newAuthors: string[], newTags: string[], newTitle: string, newContent: string, lastUpdate: Dayjs, uploadedImages: File[], newExcistingImages: string[], article: Article) {
    if (!browser) return

    let newImages: string[] = []
    const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = await import('firebase/storage')
    const storage = getStorage()

    // -- Remove images --
    if (!containArraysSameElements(article.images, newExcistingImages)) {
      const imagesToRemove = arrayDifference(article.images, newExcistingImages)
      console.log("imagesToRemove", imagesToRemove)
      await Promise.all(imagesToRemove.map(async (image) => {
        const imageRef = ref(storage, image)
        await deleteObject(imageRef)
      }))
    }
    newImages = newExcistingImages
    // -- Upload images --
    if (uploadedImages) {
      const uploadedImageLinks = await Promise.all(uploadedImages.map(async (image) => {
        const storageRef = ref(storage, `page-images/${uuidv4()}`)
        const snapshot = await uploadBytes(storageRef, image)
        return await getDownloadURL(snapshot.ref)
      }))
      newImages.push(...uploadedImageLinks)
    }

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
      images: newImages
    })

    // -- Update store --
    article.authors = newAuthors
    article.tags = newTags
    article.title = newTitle
    article.content = newContent
    article.images = newImages
    article.lastUpdate = lastUpdate
    update((pages) => [...pages])
  }

  async function removeArticle(article: Article) {
    if (!browser) return

    // -- Remove images --
    const { getStorage, ref, deleteObject } = await import('firebase/storage')
    const storage = getStorage()

    await Promise.all(article.images.map(async (image) => {
      try {
        const storageRef = ref(storage, image)
        await deleteObject(storageRef)
      } catch (error: any) {
        // Not existing images can be safely ignored
        if (error.code === 'storage/object-not-found') return
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

  async function loadMoreArticles() {
    if (!browser) return
    if (!hasMoreDocuments) return

    // -- Load articles --
    const { firebaseApp } = await import('$lib/firebase/Firebase')
    const { getFirestore, collection, query, orderBy, limit, getDocs, startAfter } = await import('firebase/firestore')
    const firestore = getFirestore(firebaseApp)

    const q = query(
      collection(firestore, Collections.ARTICLES),
      orderBy('createdAt', 'desc'),
      startAfter(lastRef),
      limit(paginationSize)
    ).withConverter(articleConverter)
    const snapshot = await getDocs(q)

    // -- Update articles --
    update((articles) => ([...articles, ...snapshot.docs.map(e => e.data())]))
    lastRef = snapshot.docs.slice(-1)[0]
    hasMoreDocuments = snapshot.docs.length === paginationSize + 1
  }

  async function getArticleById(id: string) {
    if (!browser) return

    const exsistingArticle = get(innerStore).find((e) => e.id === id)
    if (exsistingArticle) return exsistingArticle

    // -- Load page --
    const { firebaseApp } = await import('$lib/firebase/Firebase')
    const { getFirestore, doc, getDoc } = await import('firebase/firestore')
    const firestore = getFirestore(firebaseApp)

    const articleRef = doc(firestore, Collections.ARTICLES, id).withConverter(articleConverter)
    const articleSnap = await getDoc(articleRef)
    const article = articleSnap.data()

    if (article) update((articles) => [...articles, article])
    return article || null
  }

  return {
    subscribe,
    addArticle,
    updateArticle,
    removeArticle,
    loadMoreArticles,
    getArticleById
  }
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
if (useMock) console.warn("Mocking is on")
export const articleStore = useMock ?
  createMockArticleStore() :
  createArticleStore()
