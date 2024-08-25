import { PhotoAlbum } from '$lib/domain/PhotoAlbum'
import { UploadProgress } from '$lib/utils/UploadProgress'
import { sleep } from '$lib/utils/Utils'
import type { Dayjs } from 'dayjs'
import saveAs from 'file-saver'
import JSZip from 'jszip'
import pLimit from 'p-limit'
import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

export function createMockPhotoAlbumStore() {
	const maxConcurrentUploads = 4

	const store = writable<(PhotoAlbum)[]>([])
	const { subscribe, update } = store

	async function createPhotoAlbum(newPhotoAlbum: PhotoAlbum, images: File[], progressStore: Writable<UploadProgress[]>) {
		update((photoAlbums) => ([newPhotoAlbum, ...(photoAlbums || [])]))
		return 0
	}

	async function updatePhotoAlbum(newTitle: string, newVisible: boolean, newAuthor: string, newAuthorUrl: string, newDate: Dayjs, combinedImages: (string | File)[], photoAlbum: PhotoAlbum, progressStore: Writable<UploadProgress[]>) {
		const existingImages = combinedImages.filter((e) => typeof e === 'string') as string[]

		photoAlbum.title = newTitle
		photoAlbum.visible = newVisible
		photoAlbum.author = newAuthor
		photoAlbum.authorUrl = newAuthorUrl
		photoAlbum.date = newDate
		photoAlbum.imageIds = existingImages
		photoAlbum.updateSearchableString()

		update((photoAlbums) => [...photoAlbums])
	}

	async function deletePhotoAlbum(photoAlbum: PhotoAlbum) {
		await sleep(1000)
		update((photoAlbums) => (photoAlbums.filter((e) => e.id !== photoAlbum.id)))
	}

	async function updateVisibility(photoAlbum: PhotoAlbum) {
		photoAlbum.updateSearchableString()
		await sleep(1000)
		update((photoAlbums) => [...photoAlbums])
	}

	async function downloadZip(photoAlbum: PhotoAlbum, progressStore: Writable<number>) {
		progressStore.set(0)
		const zip = new JSZip()
		const limit = pLimit(4)

		await Promise.all(
			photoAlbum.getImageUrls().map(async (url, index) => limit(async () => {
				await sleep(1000)
				progressStore.update((progress) => progress + 1)
			}))
		)

		const content = await zip.generateAsync({ type: "blob" })
		saveAs(content, `${photoAlbum.title}.zip`)
	}

	return {
		subscribe,
		createPhotoAlbum,
		updatePhotoAlbum,
		updateVisibility,
		deletePhotoAlbum,
		downloadZip
	}
}
