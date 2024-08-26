import { PHOTO_ALBUMS_JSON } from '$data/PhotoAlbumsJson'
import { PhotoAlbum } from '$lib/domain/PhotoAlbum'
import { MAX_CONCURRENT_UPLOADS } from '$lib/utils/Constants'
import { updateStoreAtIndex } from '$lib/utils/Svelte'
import { UploadProgress } from '$lib/utils/UploadProgress'
import { sleep } from '$lib/utils/Utils'
import type { Dayjs } from 'dayjs'
import saveAs from 'file-saver'
import JSZip from 'jszip'
import pLimit from 'p-limit'
import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

async function convertAndUploadImages(combinedImages: (string | File)[], progressStore: Writable<UploadProgress[]>) {
	const limit = pLimit(MAX_CONCURRENT_UPLOADS)
	progressStore.set(combinedImages.map(() => UploadProgress.NOT_STARTED))

	const uploadedImageIds = await Promise.all(combinedImages.map(async (_, index) => {
		return limit(async () => {
			updateStoreAtIndex(progressStore, index, UploadProgress.CONVERTING)
			await sleep(1000)
			updateStoreAtIndex(progressStore, index, UploadProgress.DONE)
			return uuidv4()
		})
	}))
	return { uploadedImageIds, size: 0 }
}

export function createMockPhotoAlbumStore() {
	const store = writable<(PhotoAlbum)[]>(PHOTO_ALBUMS_JSON.map((e, index) => PhotoAlbum.fromJson(index.toString(), e)))
	const { subscribe, update } = store

	async function createPhotoAlbum(newPhotoAlbum: PhotoAlbum, images: File[], progressStore: Writable<UploadProgress[]>) {
		const { uploadedImageIds, size } = await convertAndUploadImages(images, progressStore)

		newPhotoAlbum.imageIds = uploadedImageIds

		update((photoAlbums) => ([newPhotoAlbum, ...(photoAlbums || [])]))
		return 0
	}

	async function updatePhotoAlbum(newTitle: string, newVisible: boolean, newAuthor: string, newAuthorUrl: string, newDate: Dayjs, combinedImages: (string | File)[], photoAlbum: PhotoAlbum, progressStore: Writable<UploadProgress[]>) {
		const { uploadedImageIds, size } = await convertAndUploadImages(combinedImages, progressStore)

		photoAlbum.title = newTitle
		photoAlbum.visible = newVisible
		photoAlbum.author = newAuthor
		photoAlbum.authorUrl = newAuthorUrl
		photoAlbum.date = newDate
		photoAlbum.imageIds = uploadedImageIds
		photoAlbum.updateSearchableString()

		update((photoAlbums) => [...photoAlbums])
		return size
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
			photoAlbum.getImageUrls().map(async (_url, _index) => limit(async () => {
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