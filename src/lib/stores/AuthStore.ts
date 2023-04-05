import { browser } from '$app/environment'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Auth, User } from 'firebase/auth'
import { readable, writable } from 'svelte/store'

function createMockAuthStore() {
  const store = writable<User | null>(undefined, set => {
    set({} as User)
  })
  const { subscribe, update } = store;

  const known = new Promise<void>(resolve => {
    resolve();
  })

  async function signIn(email: string, password: string) {
    update(() => ({}) as User)
  }
  async function signOut() {
    update(() => null)
  }

  return {
    subscribe,
    signIn,
    signOut,
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

      const { firebaseApp } = await import('$lib/firebase/firebase')
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

  return {
    subscribe,
    signIn,
    signOut,
    known
  }
}


const useMock: boolean = convertStringToBool(import.meta.env.VITE_USEMOCKING);
export const authStore = useMock ?
  createMockAuthStore() :
  createAuthStore()
