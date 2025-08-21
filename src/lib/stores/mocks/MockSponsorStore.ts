import { SPONSORS_JSON } from '$data/MockSponsorsStore'
import { Sponsor } from '$lib/domain/Sponsor'
import type { UploadProgress } from '$lib/utils/UploadProgress'
import { get, writable, type Writable } from 'svelte/store'

export function createMockSponsorStore() {
	const store = writable<(Sponsor)[]>(SPONSORS_JSON.map((e, i) => Sponsor.fromJson(i.toString(), e)))
	const { subscribe, update } = store

	async function createSponsor(newSponsor: Sponsor, _image: File, _progressStore: Writable<UploadProgress[]>) {
		//const existingSortedIds = get(store).map((e) => e.id)
		// await updateSponsorsOrder([...existingSortedIds, newDocRef.id])
		
		update((sponsors) => ([...sponsors, newSponsor]))
	}

	async function updateSponsor(newName: string, newUrl: string, __combinedImage: string | File, _newVisible: boolean, sponsor: Sponsor, _progressStore: Writable<UploadProgress[]>) {
		sponsor.name = newName
		sponsor.url = newUrl
		//sponsor.imageUrl = sponsor.imageUrl
		sponsor.updateSearchableString()

		update((sponsors) => [...sponsors])
	}

	async function deleteSponsor(sponsor: Sponsor, _progressStore: Writable<number>) {
		update((sponsors) => sponsors.filter((e) => e.id !== sponsor.id))

		const existingSortedIds = get(store).map((e) => e.id)
		await updateSponsorsOrder(existingSortedIds)
	}

	async function updateSponsorsOrder(newSortedIds: string[]) {
		sortSponsors(get(store), newSortedIds)
		update((sponsors) => [...sponsors])
	}

	async function updateVisibility(sponsor: Sponsor) {
		sponsor.updateSearchableString()

		update((sponsors) => [...sponsors])
	}

	function sortSponsors(sponsors: Sponsor[], sortedIds: string[]) {
		const sortMap = new Map(sortedIds.map((e, i) => [e, i] as [string, number]))
		sponsors.sort((a, b) => {
			const first = sortMap.get(a.id)
			if (first === undefined) throw new Error(`Sponsor ${a.id} not found in sort map`)
			const second = sortMap.get(b.id)
			if (second === undefined) throw new Error(`Sponsor ${b.id} not found in sort map`)
			return first - second
		})
	}

	return {
		subscribe,
		createSponsor,
		updateSponsor,
		deleteSponsor,
		updateSponsorsOrder,
		updateVisibility
	}
}