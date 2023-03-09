import { Article, type ArticleJson } from '$lib/article';
import { browser } from '$app/environment'
import { readable } from 'svelte/store'
import { Collections } from '$lib/firebase/firestore';

function createArticleStore() {
  const { subscribe } = readable([] as Article[], set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribe = () => {}

    async function init() {
      if (browser) {
        const { firebaseApp } = await import('$lib/firebase/firebase-app')
        const { getFirestore, collection, query, orderBy, limit, onSnapshot } = await import('firebase/firestore')
        const firestore = getFirestore(firebaseApp)

        let q = query(collection(firestore, Collections.ARTICLES))
        q = query(q, orderBy('timestamp', 'desc'))
        q = query(q, limit(10))

        unsubscribe = onSnapshot(q, snap => set(snap.docs.map(doc => Article.fromJson(doc.data() as ArticleJson))))
      }
    }
    init()

    return unsubscribe
  })

  return { subscribe }
}

export const articleStore = createArticleStore()
