import { browser } from '$app/environment'
import { DbUser, dbUserConverter } from '$lib/domain/DbUser'
import { Collections } from '$lib/firebase/Firebase'
import { convertStringToBool } from '$lib/utils/Utils'
import dayjs from 'dayjs'
import type { Auth, User } from 'firebase/auth'
import { readable, writable } from 'svelte/store'

function createMockAuthStore() {
  const store = writable<User | null>(undefined, set => {
    set({} as User)
  })
  const { subscribe, update } = store

  const known = Promise.resolve()
  const dbUser = Promise.resolve(new DbUser("1", "role", "email", "displayName", dayjs(1)))

  async function signIn(_email: string, _password: string) {
    update(() => ({}) as User)
  }
  async function signOut() {
    update(() => null)
  }
  async function updateCurrentUserEmail(_email: string) {
  }
  async function updateCurrentUserPassword(_password: string) {
  }
  async function updateCurrentUserName(_name: string) {
  }

  return {
    subscribe,
    signIn,
    signOut,
    updateCurrentUserEmail,
    updateCurrentUserPassword,
    updateCurrentUserName,
    known,
    dbUser
  }
}

/**
 * 
 * Source: https://www.captaincodeman.com/lazy-loading-firebase-with-sveltekit
 */
function createAuthStore() {
  let auth: Auth

  // Is run anytime the first subscriber attaches to the store
  // returns a function that is called whenever the last subscriber disconnects
  const { subscribe } = readable<User | null>(undefined, set => {
    let unsubscribe = () => { }

    async function init() {
      if (!browser) return

      const { firebaseApp } = await import('$lib/firebase/Firebase')
      const { getAuth, onAuthStateChanged } = await import('firebase/auth')

      auth = getAuth(firebaseApp)
      unsubscribe = onAuthStateChanged(auth, set)
    }
    init()

    return unsubscribe
  })

  async function knownFunction() {
    let unsub = () => { }
    unsub = subscribe(user => {
      if (user !== undefined) {

        unsub()
        return
      }
    })
  }
  const known = knownFunction()

  async function dbUserFunction() {
    const { firebaseApp } = await import('$lib/firebase/Firebase')
    const { getFirestore, doc, getDoc } = await import('firebase/firestore')
    const firestore = getFirestore(firebaseApp)

    let unsub = () => { }
    unsub = subscribe(async user => {
      if (user != undefined) {
        try {
          const pageRef = doc(firestore, Collections.USERS, user.uid).withConverter(dbUserConverter)
          const pageSnap = await getDoc(pageRef)
          const userData = pageSnap.data()

          unsub()
          if (userData) return userData
          else return undefined
        } catch {
          return undefined
        }
      }
    })
  }
  const dbUser = dbUserFunction()

  async function signIn(email: string, password: string) {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function signOut() {
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
  }

  async function updateCurrentUserEmail(email: string) {
    if (!auth.currentUser) return

    // -- Update authUser --
    const { updateEmail } = await import('firebase/auth')

    await updateEmail(auth.currentUser, email)

    // -- Update dbUser --
    const { firebaseApp } = await import('$lib/firebase/Firebase')
    const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
    const firestore = getFirestore(firebaseApp)

    const userRef = doc(firestore, Collections.USERS, auth.currentUser.uid)
    await updateDoc(userRef, { email: email })
  }

  async function updateCurrentUserPassword(password: string) {
    if (!auth.currentUser) return

    // -- Update authUser --
    const { updatePassword } = await import('firebase/auth')
    await updatePassword(auth.currentUser, password)
  }

  async function updateCurrentUserName(displayName: string) {
    if (!auth.currentUser) return

    // -- Update authUser --
    const { updateProfile } = await import('firebase/auth')
    await updateProfile(auth.currentUser, { displayName: displayName })

    // -- Update dbUser --
    const { firebaseApp } = await import('$lib/firebase/Firebase')
    const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
    const firestore = getFirestore(firebaseApp)

    const userRef = doc(firestore, Collections.USERS, auth.currentUser.uid)
    await updateDoc(userRef, { displayName: displayName })
  }

  return {
    subscribe,
    signIn,
    signOut,
    updateCurrentUserEmail,
    updateCurrentUserPassword,
    updateCurrentUserName,
    known,
    dbUser
  }
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
/**
 * Store that handles authentication, and profile updates for current user
 */
export const authStore = useMock ?
  createMockAuthStore() :
  createAuthStore()
