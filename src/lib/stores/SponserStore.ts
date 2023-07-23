import { browser } from '$app/environment'
import { Sponser, sponserConverter, type SponserJson } from '$lib/domain/Sponser'
import { Collections } from '$lib/firebase/Firebase'
import { writable } from 'svelte/store'
import { v4 as uuidv4 } from "uuid";

function createSponserStore() {
  const store = writable<(Sponser)[]>(undefined, set => {
    async function init() {
      if (!browser) return

      // -- Load Sponsers --
      const { firebaseApp } = await import('$lib/firebase/Firebase')
      const { getFirestore, getDocs, collection } = await import('firebase/firestore')
      const firestore = getFirestore(firebaseApp)

      const sponsersRef = collection(firestore, Collections.SPONSERS)
      const sponsersSnap = await getDocs(sponsersRef)
      const sponsers = sponsersSnap.docs.map(e => Sponser.fromJson(e.id, e.data() as SponserJson))

      // -- Set store --
      set(sponsers)
    }
    init()
  })
  const { subscribe, update } = store

  async function createSponser(sponser: Sponser, image: File) {
    // -- Upload images --
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
    const storage = getStorage()

    const storageRef = ref(storage, `sponser-images/${uuidv4()}`)
    const snapshot = await uploadBytes(storageRef, image)
    const uploadedImage = await getDownloadURL(snapshot.ref)
    sponser.imageUrl = uploadedImage

    // -- Upload article --
    const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/Firebase')
    const firestore = getFirestore(firebaseApp)

    const newDocRef = doc(collection(firestore, Collections.SPONSERS)).withConverter(sponserConverter)
    await setDoc(newDocRef, sponser)

    // -- Update store --
    update((sponsers) => ([...sponsers, sponser]))
  }

  async function updateSponser(newName: string, newUrl: string, newImage: File | undefined, sponser: Sponser) {
    // -- Update image --
    const { getStorage, ref, uploadBytes } = await import('firebase/storage')
    const storage = getStorage()

    if (newImage) {
      const imageRef = ref(storage, sponser.imageUrl)
      await uploadBytes(imageRef, newImage)
    }

    // -- Update article --
    const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/Firebase')
    const firestore = getFirestore(firebaseApp)

    const linksRef = doc(firestore, Collections.SPONSERS, sponser.id)
    await updateDoc(linksRef, {
      name: newName,
      url: newUrl
    })

    // -- Update store --
    sponser.name = newName
    sponser.url = newUrl
    update((sponsers) => [...sponsers])
  }

  async function deleteSponser(sponser: Sponser) {
    // -- Remove image --
    const { getStorage, ref, deleteObject } = await import('firebase/storage')
    const storage = getStorage()

    try {
      const storageRef = ref(storage, sponser.imageUrl)
      await deleteObject(storageRef)
    } catch (error: any) {
      // Not existing images can be safely ignored
      if (error.code !== 'storage/object-not-found')
        throw error
    }

    // -- Remove sponser --
    const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/Firebase')
    const firestore = getFirestore(firebaseApp)

    await deleteDoc(doc(firestore, Collections.SPONSERS, sponser.id))

    // -- Remove from store --
    update((sponsers) => (sponsers.filter((e) => e.id !== sponser.id)))

  }

  return {
    subscribe,
    createSponser,
    updateSponser,
    deleteSponser,
  }
}

//const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
/**
 * Store that handles managing users, meant for use by admin users
 */
export const sponserStore = createSponserStore()
