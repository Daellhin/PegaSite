import { ARTICLES_JSON } from '$data/ArticlesJson'
import { Article } from '$lib/domain/Article'
import type { Dayjs } from 'dayjs'
import { get, writable } from 'svelte/store'

export function createMockArticleStore() {
    const innerStore = writable<Article[]>(undefined, set => {
        const articles = ARTICLES_JSON.map(Article.fromJson)
        set(articles)
    })
    const { subscribe, update } = innerStore

    const known = Promise.resolve()

    async function loadMoreArticles() {
        return
    }
    async function createArticle(newArticle: Article, _images: File[]) {
        update((articles) => ([newArticle, ...articles]))
    }
    async function getArticleById(id: string) {
        const exsistingArticle = get(innerStore).find((e) => e.id === id)
        return exsistingArticle || null
    }
    async function updateArticle(_newAuthors: string[], _newTags: string[], _newTitle: string, _newContent: string, _lastUpdate: Dayjs, _combinedImages: (string | File)[], _visible:boolean, _article: Article) {
    }
    async function deleteArticle(article: Article) {
        update((articles) => (articles.filter((e) => e.id !== article.id)))
    }
    function updateVisibility(article: Article) {
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