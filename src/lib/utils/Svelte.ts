import type { Writable } from "svelte/store"

export function updateStoreAtIndex<T>(store: Writable<T[]>, index: number, value: T) {
	store.update((values) => {
		values[index] = value
		return [...values]
	})
}