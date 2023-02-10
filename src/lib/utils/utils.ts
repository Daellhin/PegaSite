import type { Navigation } from "@sveltejs/kit";

export function clearHTMLTags(string: string) {
    return string.replace(/(<([^>]+)>)/gi, '')
}

// checks if navigation is not triggered by form or page load
export function isPageNavigation(navigation: Navigation) {
    return navigation.type === "leave" ||
        navigation.type === "link" ||
        navigation.type === "goto" ||
        navigation.type === "popstate"
}