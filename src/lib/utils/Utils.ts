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
    list: V[],
    keyGetter: (input: V) => K
) {
    if (!list) {
        return undefined
    }
    const map = new Map<K, V[]>()
    list.forEach((item) => {
        const key = keyGetter(item)
        const collection = map.get(key)
        if (!collection) {
            map.set(key, [item])
        } else {
            collection.push(item)
        }
    })
    return map
}

/**
 * Starts from 0. 
 * Counts the amount of increasing numbers, until the first decreased number
 * */
export function sizeOfIncreasingFirstSequence(row: number[]) {
    if (row.length <= 1) return row.length
    for (let index = 1; index <= row.length; index++) {
        if (row[index] <= row[index - 1]) return index
    }
    return row.length
}

/**
 * Source: https://stackoverflow.com/a/11409944/8807613
 * 
 * Returns a number whose value is limited to the given range.
 */
export function clamp(number: number, min: number, max: number) {
    return Math.min(Math.max(number, min), max)
}

export function convertStringToBool(string: any) {
    return String(string).toLowerCase() == "true"
}

export function sleep(time: number | undefined) {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

export function isChild(obj: any, parentObj: any) {
    while (
        obj != undefined &&
        obj != null &&
        obj.tagName.toUpperCase() != "BODY"
    ) {
        if (obj == parentObj) {
            return true
        }
        obj = obj.parentNode
    }
    return false
}

/**
 * Converts links to html anchors in a block of text
 * Source: https://stackoverflow.com/a/71734086/8807613
 */
export function linkifyText(text: string) {
    function isValidHttpUrl(urlText: string) {
        let url
        try {
            url = new URL(urlText)
        }
        catch {
            return false
        }
        return url.protocol.startsWith("http")
    }
    const isMatch = text.match(/(?<=\s|^|')[a-zA-Z0-9-:/]+\.[a-zA-Z0-9-].+?(?=[.,;:?!-]?(?:\s|$|'))/g)
    if (!isMatch)
        return text
    const a = []
    isMatch.forEach(e => {
        const [t1, ...t2] = text.split(e)
        a.push(t1)
        text = t2.join(e)
        const y = (!(e.match(/:\/\//)) ? 'https://' : '') + e
        if (isNaN(e as any) && isValidHttpUrl(y))
            a.push('<a href="' + y + '" target="_blank">' + y.split('/')[2] + '</a>')
        else
            a.push(e)
    })
    a.push(text)
    return a.join('')
}

export function doNothing() { }