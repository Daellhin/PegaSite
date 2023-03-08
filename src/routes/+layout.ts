import { Collections } from './../lib/firebase/firestore';
import { browser } from '$app/environment';
import { Article, type ArticleJson } from '$lib/article';
import { initFirebase } from '$lib/firebase/firebase';
import { firestore } from '$lib/firebase/firestore';
import { collection, getDocs } from '@firebase/firestore/lite';
import type { LayoutLoad } from './$types';

export const prerender = true;

async function loadData() {
    const app = initFirebase()
    const db = firestore(app)

    const querySnapshot = await getDocs(collection(db, Collections.ARTICLES))
    querySnapshot.forEach((e) => console.log(e.data()))
    const articles = querySnapshot.docs.map((doc) => Article.fromJson(doc.data() as ArticleJson))
    articles.forEach((e) => console.log(e))
    return {
        articles: articles
    };
}

export const load = (async () => {
    if (!browser) {
        return {
            articles: []
        }
    }
    return await loadData()
}) satisfies LayoutLoad;