import { browser } from '$app/environment'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Auth, User } from 'firebase/auth'
import { readable, writable } from 'svelte/store'

function createMockAuthStore() {
  const store = writable<User | null>(undefined, set => {
    set({} as User)
  })
  const { subscribe, update } = store

  const known = new Promise<void>(resolve => {
    resolve()
  })

  async function signIn(email: string, password: string) {
    update(() => ({}) as User)
  }
  async function signOut() {
    update(() => null)
  }
  async function updateCurrentUserEmail(email: string) {
  }
  async function updateCurrentUserPassword(password: string) {
  }
  async function updateCurrentUserName(name: string) {
  }
  async function createUser(email: string, password: string, displayName: string) {
  }

  return {
    subscribe,
    signIn,
    signOut,
    updateCurrentUserEmail,
    updateCurrentUserPassword,
    updateCurrentUserName,
    createUser,
    known
  }
}

/**
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

  const known = new Promise<void>(resolve => {
    let unsub = () => { }
    unsub = subscribe(user => {
      if (user !== undefined) {
        resolve()
        unsub()
      }
    })
  })

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
    const { updateEmail } = await import('firebase/auth')

    await updateEmail(auth.currentUser, email);
  }

  async function updateCurrentUserPassword(password: string) {
    if (!auth.currentUser) return
    const { updatePassword } = await import('firebase/auth')

    await updatePassword(auth.currentUser, password);
  }

  async function updateCurrentUserName(displayName: string) {
    if (!auth.currentUser) return
    const { updateProfile } = await import('firebase/auth')

    await updateProfile(auth.currentUser, { displayName: displayName });
  }

  async function createUser(email: string, password: string, displayName: string) {
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')

    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser.user, { displayName: displayName });
  }

  return {
    subscribe,
    signIn,
    signOut,
    updateCurrentUserEmail,
    updateCurrentUserPassword,
    updateCurrentUserName,
    createUser,
    known
  }
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
export const authStore = useMock ?
  createMockAuthStore() :
  createAuthStore()
