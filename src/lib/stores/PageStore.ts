import { browser } from '$app/environment'
import { PAGES_JSON } from '$data/PagesJson'
import { Page } from '$lib/domain/Page'
import { readFileAsDataURL } from '$lib/utils/Utils'
import { writable } from 'svelte/store'

function createPageStore() {
    const store = writable<Page[]>(undefined, set => {
        async function init() {
            if (!browser) return

            const articles = PAGES_JSON.map(Page.fromJson)

            // -- Set store --
            set(articles)
        }
        init()
    })
    const { subscribe, update } = store

    async function updatePage(newTitle: string, newContent: string, uploadedImages: File[], newExcistingImages: string[], page: Page) {
        const newImages = await Promise.all(uploadedImages.map(readFileAsDataURL))
        page.title = newTitle
        page.content = newContent
        page.images = [...newExcistingImages, ...newImages]
        update((pages) => [...pages])
    }
    return {
        subscribe,
        updatePage
    }
}

export const pageStore = createPageStore()
