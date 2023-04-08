import { browser } from '$app/environment';
import { LINKS_JSON } from '$data/LinksJson';
import { Link, LinkGroup } from '$lib/domain/Link';
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

  async function removeLink(link: Link, group: LinkGroup) {
    if (!browser) return
    group.links = group.links.filter((e) => e !== link);

    update((linkGroups) => [...linkGroups])
  }

  async function addLink(link: Link, group: LinkGroup) {
    if (!browser) return
    group.links.push(link)

    update((linkGroups) => [...linkGroups])
  }

  async function updateGroupTitle(title:string, group: LinkGroup) {
    if (!browser) return
    group.name = title;

    update((linkGroups) => [...linkGroups])
  }

  return {
    subscribe,
    removeLink,
    addLink,
    updateGroupTitle
  }
}

export const navbarStore = createNavbarStore()
