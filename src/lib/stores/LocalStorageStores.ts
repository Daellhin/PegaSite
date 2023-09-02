import { persisted } from 'svelte-local-storage-store'

export const preferencesStore = persisted('preferences', {
	autoPlay: true
})
