import { browser } from '$app/environment'
import { LINKS_JSON } from '$data/LinksJson'
import { Link, LinkGroup } from '$lib/domain/Link'
import { Collections } from '$lib/firebase/firebase'
import { convertStringToBool } from '$lib/utils/Utils'
import { writable } from 'svelte/store'

async function addLinksFromJson() {
  const links = LINKS_JSON.map(LinkGroup.fromJson)
  await Promise.all(links.map(async (linkGroup) => {
    const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const linksRef = doc(firestore, Collections.PAGES, "overview")
    await updateDoc(linksRef, linkGroup.toFirebaseJson())
  }))
}

function createMockNavbarStore() {
  const store = writable<(LinkGroup)[]>(undefined, set => {
    const links = LINKS_JSON.map(LinkGroup.fromJson)
    set(links)
  })
  const { subscribe, update } = store

  async function createLink(link: Link, group: LinkGroup) {
    group.links.push(link)
    update((linkGroups) => [...linkGroups])
  }
  async function updateLinkTitle(newTitle: string, link: Link, _group: LinkGroup) {
    link.title = newTitle
    update((linkGroups) => [...linkGroups])
  }
  async function deleteLink(link: Link, group: LinkGroup) {
    group.links = group.links.filter((e) => e !== link)
    update((linkGroups) => [...linkGroups])
  }
  async function updateGroupTitle(title: string, linkGroup: LinkGroup) {
    linkGroup.name = title
    update((linkGroups) => [...linkGroups])
  }

  return {
    subscribe,
    createLink,
    updateLinkTitle,
    deleteLink,
    updateGroupTitle
  }
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

      const linksRef = doc(firestore, Collections.PAGES, "overview")
      const linksSnap = await getDoc(linksRef)
      const links = LinkGroup.fromFirebaseData(linksSnap.data())

      // -- Set store --
      set(links)
    }
    init()
  })
  const { subscribe, update } = store

  async function createLink(link: Link, group: LinkGroup) {
    if (!browser) return

    // -- Upload link --
    const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const linksRef = doc(firestore, Collections.PAGES, "overview")
    const objectKey = `${group.name}.links.${link.title}`
    await updateDoc(linksRef, {
      [objectKey]: link.toFirebaseJson()
    })

    // -- Update store --
    group.links.push(link)
    update((linkGroups) => [...linkGroups])
  }

  async function updateLinkTitle(newTitle: string, link: Link, group: LinkGroup) {
    if (!browser) return
    if (link.title === newTitle) return

    // -- Delete link --
    const { getFirestore, doc, updateDoc, deleteField } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const linksRef = doc(firestore, Collections.PAGES, "overview")
    const oldObjectKey = `${group.name}.links.${link.title}`
    const deleteLinkPromise = updateDoc(linksRef, {
      [oldObjectKey]: deleteField()
    })

    link.title = newTitle
    // -- Create link --
    const newObjectKey = `${group.name}.links.${link.title}`
    const createLinkPromise = updateDoc(linksRef, {
      [newObjectKey]: link.toFirebaseJson()
    })

    // TODO add transaction
    await Promise.all([deleteLinkPromise, createLinkPromise])

    // -- Update store --
    update((linkGroups) => [...linkGroups])
  }

  async function deleteLink(link: Link, group: LinkGroup) {
    if (!browser) return
    if (link.customUrl) return

    // -- Delete link --
    const { getFirestore, doc, updateDoc, deleteField } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const linksRef = doc(firestore, Collections.PAGES, "overview")
    const objectKey = `${group.name}.links.${link.title}`
    await updateDoc(linksRef, {
      [objectKey]: deleteField()
    })

    // -- Update store --
    group.links = group.links.filter((e) => e !== link)
    update((linkGroups) => [...linkGroups])
  }

  async function updateGroupTitle(title: string, linkGroup: LinkGroup) {
    if (!browser) return
    if (linkGroup.name === title) return

    // -- Delete group --
    const { getFirestore, doc, updateDoc, deleteField } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const linksRef = doc(firestore, Collections.PAGES, "overview")
    const oldObjectKey = `${linkGroup.name}`
    const deleteGroupPromise = updateDoc(linksRef, {
      [oldObjectKey]: deleteField()
    })

    linkGroup.name = title
    // -- Create link --
    const createGroupPromise = updateDoc(linksRef, linkGroup.toFirebaseJson())

    // TODO add transaction
    await Promise.all([deleteGroupPromise, createGroupPromise])

    // -- Update store --
    update((linkGroups) => [...linkGroups])
  }

  return {
    subscribe,
    createLink,
    updateLinkTitle,
    deleteLink,
    updateGroupTitle
  }
}

const useMock: boolean = convertStringToBool(import.meta.env.VITE_USEMOCKING)
export const navbarStore = useMock ?
  createMockNavbarStore() :
  createNavbarStore()
