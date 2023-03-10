import { browser } from '$app/environment';
import type { Article } from '$lib/article';
import { Collections } from '$lib/firebase/firebase';
import { writable } from 'svelte/store';
import { articleConverter } from './../article';

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

  async function addArticle(newArticle: Article) {
    if (!browser) {
      console.error("Why are you adding an article fro the server")
      return;
    }
    console.log(newArticle)
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
    const firestore = getFirestore(firebaseApp)

    const newDocRef = doc(collection(firestore, Collections.ARTICLES)).withConverter(articleConverter)
    newArticle.id = newDocRef.id
    await setDoc(newDocRef, newArticle)
    update((articles: Article[]) => ([newArticle, ...articles]))
  }

  return { subscribe, addArticle }
}

export const articleStore = createArticleStore()
