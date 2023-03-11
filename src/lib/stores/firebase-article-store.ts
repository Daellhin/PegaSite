import { browser } from '$app/environment'
import type { Article } from '$lib/article'
import { articleConverter } from '$lib/article'
import { Collections } from '$lib/firebase/firebase'
import { writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

/**
 * Source: https://www.captaincodeman.com/lazy-loading-and-querying-firestore-with-sveltekit
 */
function createArticleStore() {
  const { subscribe, update } = writable([] as Article[], set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribe = () => { }

    async function init() {
      if (browser) {
        const { firebaseApp } = await import('$lib/firebase/firebase')
        const { getFirestore, collection, query, orderBy, limit, onSnapshot } = await import('firebase/firestore')
        const firestore = getFirestore(firebaseApp)

        let q = query(collection(firestore, Collections.ARTICLES)).withConverter(articleConverter)
        q = query(q, orderBy('timestamp', 'desc'))
        q = query(q, limit(10))

        unsubscribe = onSnapshot(q, snap => set(snap.docs.map(e => e.data())))
      }
    }
    init()

    return unsubscribe
  })

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
    update((articles: Article[]) => ([newArticle, ...articles]))
  }

  return { subscribe, addArticle }
}

export const articleStore = createArticleStore()
