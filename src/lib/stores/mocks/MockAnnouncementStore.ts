import { Announcement } from '$lib/domain/Announcement'
import { writable } from 'svelte/store'

export function createMockAnnouncementStore() {
	const store = writable<(Announcement)[]>([])
	const { subscribe, update } = store

	async function createAnnouncement(announcement: Announcement) {
		update((anouncements) => ([...anouncements, announcement]))
	}

	async function updateAnnouncement(newTitle: string, newContent: string, newVisible: boolean, newDismissable: boolean, announcement: Announcement) {
		announcement.title = newTitle
		announcement.content = newContent
		announcement.visible = newVisible
		announcement.dismissible = newDismissable
		announcement.updateSearchableString()

		update((announcements) => [...announcements])
	}

	async function deleteAnnouncement(announcement: Announcement) {
		update((announcements) => announcements.filter((e) => e.id !== announcement.id))
	}

	async function updateAnnouncementOrder(newSortedIds: string[]) {
		update((announcements) => [...announcements])
	}

	async function updateAnnouncementVisibility(announcement: Announcement) {
		announcement.updateSearchableString()

		update((announcements) => [...announcements])
	}

	return {
		subscribe,
		createAnnouncement,
		updateAnnouncement,
		deleteAnnouncement,
		updateAnnouncementVisibility
	}
}