import { browser } from '$app/environment'
import { PAGES_JSON } from '$data/PagesJson'
import { Page, pageConverter } from '$lib/domain/Page'
import { Collections } from '$lib/firebase/firebase'
import { convertStringToBool, readFileAsDataURL } from '$lib/utils/Utils'
import { get, writable } from 'svelte/store'

async function addPagesFromJson() {
    const pages = PAGES_JSON.map(Page.fromJson)
    await Promise.all(pages.map(async (page) => {
        const { getFirestore, doc, setDoc } = await import('firebase/firestore')
        const { firebaseApp } = await import('$lib/firebase/firebase')
        const firestore = getFirestore(firebaseApp)

        const pagesRef = doc(firestore, Collections.PAGES, page.id).withConverter(pageConverter)
        await setDoc(pagesRef, page)
    }))
}

function createMockPageStore() {
    const store = writable<Page[]>(undefined, set => {
        const pages = PAGES_JSON.map(Page.fromJson)
        set(pages)
    })
    const { subscribe, update } = store

    async function updatePage(newTitle: string, newContent: string, uploadedImages: File[], newExcistingImages: string[], page: Page) {
        const newImages = await Promise.all(uploadedImages.map(readFileAsDataURL))
        page.title = newTitle
        page.content = newContent
        page.images = [...newExcistingImages, ...newImages]
        update((pages) => [...pages])
    }
    async function getPageById(id: string) {
        return get(pageStore).find((e) => e.id === id)
    }

    return {
        subscribe,
        updatePage,
        getPageById
    }
}

function createPageStore() {
    const store = writable<Page[]>([])
    const { subscribe, update } = store

    async function updatePage(newTitle: string, newContent: string, uploadedImages: File[], newExcistingImages: string[], page: Page) {
        if (!browser) return
        
        // const newImages = await Promise.all(uploadedImages.map(readFileAsDataURL))
        // page.title = newTitle
        // page.content = newContent
        // page.images = [...newExcistingImages, ...newImages]

        update((pages) => [...pages])
    }

    async function getPageById(id: string) {
        if (!browser) return

        const exsistingPage = get(pageStore).find((e) => e.id === id)
        if (exsistingPage) return exsistingPage

        // -- Load page --
        const { firebaseApp } = await import('$lib/firebase/firebase')
        const { getFirestore, doc, getDoc } = await import('firebase/firestore')
        const firestore = getFirestore(firebaseApp)

        const docRef = doc(firestore, Collections.PAGES, id).withConverter(pageConverter)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()

        if (data) update((pages) => [...pages, data])
        return data || null
    }

    return {
        subscribe,
        updatePage,
        getPageById
    }
}

const useMock: boolean = convertStringToBool(import.meta.env.VITE_USEMOCKING)
export const pageStore = useMock ?
    createPageStore() :
    createPageStore()
