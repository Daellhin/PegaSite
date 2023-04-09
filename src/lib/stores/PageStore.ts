import { browser } from '$app/environment'
import { PAGES_JSON } from '$data/PagesJson'
import { Page, pageConverter } from '$lib/domain/Page'
import { Collections } from '$lib/firebase/firebase'
import { arrayDifference, containArraysSameElements } from '$lib/utils/Array'
import { convertStringToBool, readFileAsDataURL } from '$lib/utils/Utils'
import { Timestamp } from 'firebase/firestore'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from "uuid"

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

        let newImages:string[] = [];
        const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = await import('firebase/storage')
        const storage = getStorage()

        // -- Remove images --
        if (!containArraysSameElements(page.images, newExcistingImages)) {
            const imagesToRemove = arrayDifference(page.images, newExcistingImages)
            console.log("imagesToRemove", imagesToRemove)
            await Promise.all(imagesToRemove.map(async (image) => {
                const refff = ref(storage, image);
                await deleteObject(refff);
            }))
        }
        newImages = newExcistingImages
        // -- Upload images --
        if (uploadedImages) {
            const uploadedImageLinks = await Promise.all(uploadedImages.map(async (image) => {
                const storageRef = ref(storage, `page-images/${uuidv4()}`)
                const snapshot = await uploadBytes(storageRef, image)
                return await getDownloadURL(snapshot.ref)
            }))
            newImages.push(...uploadedImageLinks)
        }

        // -- Update page --
        const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
        const { firebaseApp } = await import('$lib/firebase/firebase')
        const firestore = getFirestore(firebaseApp)

        const linksRef = doc(firestore, Collections.PAGES, page.id)
        await updateDoc(linksRef, {
            title: newTitle,
            content: newContent,
            lastEdited: new Timestamp(Math.round(Date.now() / 1000), 0),
            images: newImages
        })

        // -- Update store --
        page.title = newTitle
        page.content = newContent
        page.images = newImages
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
