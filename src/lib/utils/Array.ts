// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArrayNotEmpty(array: any[] | undefined) {
	return Array.isArray(array) && array.length > 0
}

export function arraysContainSameElements<T>(array1: T[], array2: T[]) {
	if (array1.length !== array2.length) return false
	return array1.length === array1.filter(e => array2.includes(e)).length
}

export function arrayDifference<T>(a1: T[], a2: T[]) {
	return a1.filter(e => !a2.includes(e))
}

export function arrayUnion<T>(a1: T[], a2: T[]) {
	return Array.from(new Set([...a1, ...a2]))
}

export function arrayIntersection<T>(a1: T[], a2: T[]) {
	return a1.filter(e => a2.includes(e))
}

export function filterValuesInMap<K, V>(map: Map<K, V[]> | undefined, predicate: (e: V) => boolean) {
	if (!map) return undefined
	return new Map(
		Array.from(
			new Map(
				Array.from(map).map(([key, value]) => [
					key,
					value.filter(predicate),
				])
			)
		).filter(([, value]) => isArrayNotEmpty(value))
	)
}

export function getMapKeys<K, V>(map: Map<K, V[]> | undefined) {
	if (!map) return undefined
	return Array.from(map).map(([key,]) => key)
}

export function getMapValues<K, V>(map: Map<K, V[]> | undefined) {
	if (!map) return undefined
	return Array.from(map).map(([, value]) => value)
}

export function partition<T>(array: T[], predicate: (e: T) => boolean) {
	const pass = [] as T[]
	const fail = [] as T[]
	array.forEach((e) => (predicate(e) ? pass : fail).push(e))
	return [pass, fail]
  }
  