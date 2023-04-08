import { browser } from '$app/environment';
import { LINKS_JSON } from '$data/LinksJson';
import { LinkGroup } from '$lib/domain/Link';
import { writable } from 'svelte/store';

function createNavbarStore() {
  const store = writable<(LinkGroup)[]>(undefined, set => {
    async function init() {
      if (!browser) return

      const links = LINKS_JSON.map(LinkGroup.fromJson)

      // -- Set store --
      set(links)
    }
    init()
  })
  const { subscribe, update } = store

  return {
    subscribe
  }
}

export const navbarStore = createNavbarStore()
