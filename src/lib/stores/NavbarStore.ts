import { browser } from '$app/environment'
import { Link, LinkGroup } from '$lib/domain/Link'
import { Collections } from '$lib/firebase/firebase'
import { writable } from 'svelte/store'

function createNavbarStore() {
  const store = writable<(LinkGroup)[]>(undefined, set => {
    async function init() {
      if (!browser) return

      // const links = LINKS_JSON.map(LinkGroup.fromJson)

      // -- Load Navbar --
      const { firebaseApp } = await import('$lib/firebase/firebase')
      const { getFirestore, doc, getDoc } = await import('firebase/firestore')
      const firestore = getFirestore(firebaseApp)

      const clubrRecordsRef = doc(firestore, Collections.PAGES, "overview")
      const clubRecordsSnap = await getDoc(clubrRecordsRef)
      const links = clubRecordsSnap.data()?.linkGroups.map(LinkGroup.fromJson)

      // -- Set store --
      set(links)
    }
    init()
  })
  const { subscribe, update } = store

  async function removeLink(link: Link, group: LinkGroup) {
    if (!browser) return
    group.links = group.links.filter((e) => e !== link)

    update((linkGroups) => [...linkGroups])
  }

  async function addLink(link: Link, group: LinkGroup) {
    if (!browser) return
    group.links.push(link)

    update((linkGroups) => [...linkGroups])
  }

  async function updateLink(link: Link, group: LinkGroup) {
    if (!browser) return
    update((linkGroups) => [...linkGroups])
  }

  async function updateGroupTitle(title: string, group: LinkGroup) {
    if (!browser) return
    group.name = title



    update((linkGroups) => [...linkGroups])
  }

  return {
    subscribe,
    removeLink,
    addLink,
    updateLink,
    updateGroupTitle
  }
}

export const navbarStore = createNavbarStore()
