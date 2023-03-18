export function isArrayNotEmpty(array: any[] | undefined) {
    return Array.isArray(array) && array.length > 0;
}

export function containArraysSameElements(array1: any[], array2: any[]) {
    if (array1.length !== array2.length)
        return false;
    return array1.length === array1.filter(e => array2.includes(e)).length;
}
