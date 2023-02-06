export function clearHTMLTags(string: string) {
    return string.replace(/(<([^>]+)>)/gi, '')
}