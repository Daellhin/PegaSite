import { writable } from "svelte/store"

export class PageHead {
  constructor(
    public siteTitle: string,
    public pageTitle: string = ""
  ) { }

  getFullTitle() {
    return `${this.pageTitle ? `${this.pageTitle} - ` : ""}${this.siteTitle}`
  }
}

function createPageHeadStore() {
  const innerStore = writable<PageHead>(new PageHead("AC Pegasus"))
  const { subscribe, update } = innerStore

  function updatePageTitle(newTitle: string) {
    update((pageHead) => {
      pageHead.pageTitle = newTitle
      return pageHead
    })
  }

  return {
    subscribe,
    updatePageTitle,
  }
}

export const pageHeadStore = createPageHeadStore()
