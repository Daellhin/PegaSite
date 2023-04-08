import { browser } from '$app/environment'
import { ARTICLES_JSON } from '$data/ArticlesJson'
import { Article, articleConverter } from '$lib/domain/Article'
import { Collections } from '$lib/firebase/firebase'
import { convertStringToBool } from '$lib/utils/Utils'
import type { QueryDocumentSnapshot } from 'firebase/firestore'
import { writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

/**
 * Pagination size is used to load articles in batches. 
 * One article of next batch is always atempted to be loaded. 
 * This is to check if there are items in the next batch
 */
export const paginationSize = 8

function createMockArticleStore() {
  const store = writable<Article[]>(undefined, set => {
    const articles = ARTICLES_JSON.map(Article.fromJson)
    set(articles)
  })
  const { subscribe, update } = store

  async function addArticle(newArticle: Article, images: File[]) {
    update((articles) => ([newArticle, ...articles]))
  }
  async function removeArticle(article: Article) {
    update((articles) => (articles.filter((e) => e.id !== article.id)))
  }
  async function loadMoreArticles() {
    return
  }

  return {
    subscribe,
    addArticle,
    removeArticle,
    loadMoreArticles
  }
}

/**
 * Source: https://www.captaincodeman.com/lazy-loading-and-querying-firestore-with-sveltekit
 */
function createArticleStore() {
  let lastRef: QueryDocumentSnapshot<Article>
  let hasMoreDocuments = true

  const store = writable<Article[]>(undefined, set => {
    async function init() {
      if (!browser) return

      // const articles = ARTICLES_JSON.map(Article.fromJson)

      // -- Load articles --
      const { firebaseApp } = await import('$lib/firebase/firebase')
      const { getFirestore, collection, query, orderBy, limit, getDocs } = await import('firebase/firestore')
      const firestore = getFirestore(firebaseApp)

      const q = query(
        collection(firestore, Collections.ARTICLES),
        orderBy('timestamp', 'desc'),
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
  const { subscribe, update } = store

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
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const newDocRef = doc(collection(firestore, Collections.ARTICLES)).withConverter(articleConverter)
    newArticle.id = newDocRef.id
    await setDoc(newDocRef, newArticle)

    // -- Update store --
    update((articles) => ([newArticle, ...articles]))
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
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    await deleteDoc(doc(firestore, Collections.ARTICLES, article.id))


    // -- Remove from store --
    update((articles) => (articles.filter((e) => e.id !== article.id)))
  }

  async function loadMoreArticles() {
    if (!browser) return
    if (!hasMoreDocuments) return

    // -- Load articles --
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const { getFirestore, collection, query, orderBy, limit, getDocs, startAfter } = await import('firebase/firestore')
    const firestore = getFirestore(firebaseApp)

    const q = query(
      collection(firestore, Collections.ARTICLES),
      orderBy('timestamp', 'desc'),
      startAfter(lastRef),
      limit(paginationSize)
    ).withConverter(articleConverter)
    const snapshot = await getDocs(q)

    // -- Update articles --
    update((articles) => ([...articles, ...snapshot.docs.map(e => e.data())]))
    lastRef = snapshot.docs.slice(-1)[0]
    hasMoreDocuments = snapshot.docs.length === paginationSize + 1

  }

  return {
    subscribe,
    addArticle,
    removeArticle,
    loadMoreArticles
  }
}

const useMock: boolean = convertStringToBool(import.meta.env.VITE_USEMOCKING)
if(useMock) console.warn("Mocking is on")
export const articleStore = useMock ?
  createMockArticleStore() :
  createArticleStore()
