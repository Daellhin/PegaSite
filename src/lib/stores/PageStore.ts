import { browser } from '$app/environment'
import { PAGES_JSON } from '$data/PagesJson'
import { Page } from '$lib/domain/Page'
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

    return {
        subscribe
    }
}

export const pageStore = createPageStore()
