import { browser } from '$app/environment'
import type { Article } from '$lib/domain/Article'
import { articleConverter } from '$lib/domain/Article'
import { Collections } from '$lib/firebase/firebase'
import type { QueryDocumentSnapshot } from 'firebase/firestore'
import { writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

/**
 * Pagination size is used to load articles in batches. 
 * One article of next batch is always atempted to be loaded. 
 * This is to check if there are items in the next batch
 */
export const paginationSize = 8;

/**
 * Source: https://www.captaincodeman.com/lazy-loading-and-querying-firestore-with-sveltekit
 */
function createArticleStore() {
  let lastRef: QueryDocumentSnapshot<Article>
  let hasMoreDocuments = true;

  const store = writable([] as Article[], set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const unsubscribe = () => { }

    async function init() {
      if (browser) {
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
        set(snapshot.docs.map(e => e.data()))
        lastRef = snapshot.docs.slice(-1)[0]
        hasMoreDocuments = snapshot.docs.length === paginationSize + 1;
      }
    }
    init()

    return unsubscribe
  })
  const { subscribe, update } = store;

  async function addArticle(newArticle: Article, images: File[]) {
    if (!browser) {
      console.error("Why are you adding an article from the server")
      return
    }
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
    if (!browser) {
      console.error("Why are you removing an article from the server")
      return
    }
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
    if (!browser) {
      console.error("Why are you loading more articles from the server")
      return
    }
    if (hasMoreDocuments) {
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
      hasMoreDocuments = snapshot.docs.length === paginationSize + 1;
    }
  }

  return {
    subscribe,
    addArticle,
    removeArticle,
    loadMoreArticles
  }
}

export const articleStore = createArticleStore()
