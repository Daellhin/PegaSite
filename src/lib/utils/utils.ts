import type { Navigation } from "@sveltejs/kit"

export function clearHTMLTags(string: string) {
    return string.replace(/<br>/gi, ' ').replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/gi, ' ')
}

// checks if navigation is not triggered by form or page load
export function isPageNavigation(navigation: Navigation) {
    return navigation.type === "leave" ||
        navigation.type === "link" ||
        navigation.type === "goto" ||
        navigation.type === "popstate"
}

export function ignoreDragOver(event: DragEvent) {
    event.preventDefault()
}

/**
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
 */
export function getFilesFromDragEvent(event: DragEvent) {
    event.preventDefault()

    if (!event.dataTransfer)
        return undefined
    // Use DataTransferItemList interface to access the file(s)
    if (event.dataTransfer.items) {
        return Array.from(event.dataTransfer.items)
            .filter((e) => e.kind === "file")
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map((e) => e.getAsFile()!)
    }
    // Use DataTransfer interface to access the file(s)
    return Array.from(event.dataTransfer.files)
}

/**
 * Source: https://stackoverflow.com/a/66807992
 */
export function readFileAsDataURL(file: File) {
    return new Promise<string>((accept, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            accept(event.target!.result as string)
        }
        /// XXX: rejecting with an event is rather unorthodox
        reader.onabort = reader.onerror = (ev) => {
            reject(ev)
        }
        reader.readAsDataURL(file)
    })
}

/**
 * Source: https://stackoverflow.com/a/38935544
 */
export async function srcToFile(src: string, fileName: string, mimeType: string, fetcher = fetch) {
    const fetched = await fetcher(src)
    const buffer = await fetched.arrayBuffer()
    return new File([buffer], fileName, { type: mimeType })
}

/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
export function groupBy<K, V>(
    list: Array<V>,
    keyGetter: (input: V) => K
): Map<K, Array<V>> {
    const map = new Map<K, Array<V>>();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}