import { browser } from '$app/environment'
import { LINKS_JSON } from '$data/LinksJson'
import { Link, LinkGroup } from '$lib/domain/Link'
import { Collections } from '$lib/firebase/firebase'
import { writable } from 'svelte/store'

async function addLinksFromJson() {
  const links = LINKS_JSON.map(LinkGroup.fromJson)
  await Promise.all(links.map(async (linkGroup) => {
    const linkMap = linkGroup.links.map(link => [link.title, {
      order: link.order, ...link.customUrl && { customUrl: link.customUrl }
    }])

    const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const clubrecordsRef = doc(firestore, Collections.PAGES, "overview")
    await updateDoc(clubrecordsRef, {
      [linkGroup.name]: {
        order: linkGroup.order,
        links: Object.fromEntries(linkMap)
      }
    })
  }))
}

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
      const links = LinkGroup.fromFirebaseData(clubRecordsSnap.data())

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

    await addLinksFromJson()
    console.log("finished")

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
