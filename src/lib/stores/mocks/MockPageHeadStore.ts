import { PAGES_JSON } from '$data/PagesJson'
import { Page } from '$lib/domain/Page'
import { PreviewableFile } from '$lib/utils/PreviewableFile'
import dayjs from 'dayjs'
import { get, writable } from 'svelte/store'

export function createMockPageStore() {
	const innerStore = writable<Page[]>(undefined, set => {
		const pages = PAGES_JSON.map(Page.fromJson)
		set(pages)
	})
	const { subscribe, update } = innerStore

	async function createBlankPage(id: string, title: string) {
		const page = new Page(id, dayjs(), title, [], "")
		await createPageHelper(page)
	}
	async function createPageHelper(page: Page) {
		update((pages) => [...pages, page])
	}
	async function getPageById(id: string) {
		return get(innerStore).find((e) => e.id === id)
	}
	async function updatePage(newTitle: string, newContent: string, combinedImages: (string | File)[], page: Page) {
		const images = await Promise.all(combinedImages.map(PreviewableFile.getMixedFilePreview))
		page.title = newTitle
		page.content = newContent
		page.images = images
		update((pages) => [...pages])
	}
	async function updatePageId(newId: string, oldId: string) {
		const page = await getPageById(oldId)
		if (!page) throw new Error(`No page to update at id:${oldId}`)
		page.id = newId
	}
	async function deletePage(id: string, _deleteImages = true) {
		update((pages) => pages.filter(e => e.id === id))
	}

	return {
		subscribe,
		createBlankPage,
		getPageById,
		updatePage,
		updatePageId,
		deletePage,
	}
}

// async function addPagesFromJson() {
//   const pages = PAGES_JSON.map(Page.fromJson)
//   await Promise.all(pages.map(async (page) => {
//     const { getFirestore, doc, setDoc } = await import('firebase/firestore')
//     const { firebaseApp } = await import('$lib/firebase/Firebase')
//     const firestore = getFirestore(firebaseApp)

//     const pagesRef = doc(firestore, Collections.PAGES, page.id).withConverter(pageConverter)
//     await setDoc(pagesRef, page)
//   }))
// }
