export function sortWithOrdering(items: { id: string }[], sortedIds: string[]) {
	const sortMap = new Map(sortedIds.map((e, i) => [e, i] as [string, number]))
	items.sort((a, b) => {
		const first = sortMap.get(a.id)
		if (first === undefined) throw new Error(`${typeof(items)} ${a.id} not found in sort map`)
		const second = sortMap.get(b.id)
		if (second === undefined) throw new Error(`${typeof(items)} ${b.id} not found in sort map`)
		return first - second
	})
}