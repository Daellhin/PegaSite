import { browser } from '$app/environment'
import type { Auth, User } from 'firebase/auth'
import { readable } from 'svelte/store'

/**
 * Source: https://www.captaincodeman.com/lazy-loading-firebase-with-sveltekit
 */
function createAuth() {
  let auth: Auth

  // Is run anytime the first subscriber attaches to the store
  // returns a function that is called whenever the last subscriber disconnects
  const { subscribe } = readable<User | null>(undefined, set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribe = () => { }

    async function init() {
      if (browser) {
        const { firebaseApp } = await import('$lib/firebase/Firebase')
        const { getAuth, onAuthStateChanged } = await import('firebase/auth')

        auth = getAuth(firebaseApp)

        unsubscribe = onAuthStateChanged(auth, set)
      }
    }
    init()

    return unsubscribe
  })

  const known = new Promise<void>(resolve => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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

export const authStore = createAuth()
