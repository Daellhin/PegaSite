export function isArrayNotEmpty(array: any[] | undefined) {
    return Array.isArray(array) && array.length > 0
}

export function containArraysSameElements(array1: any[], array2: any[]) {
    if (array1.length !== array2.length)
        return false
    return array1.length === array1.filter(e => array2.includes(e)).length
}

export function filterValuesInMap<K, V>(map: Map<K, V[]> | undefined, predicate: (e: V) => boolean) {
    if (!map) {
        return undefined
    }
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
    if (!map) {
        return undefined
    }
    return Array.from(map).map(([key,]) => key)
}

export function getMapValues<K, V>(map: Map<K, V[]> | undefined) {
    if (!map) {
        return undefined
    }
    return Array.from(map).map(([, value]) => value)
}

