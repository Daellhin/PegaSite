import { browser } from '$app/environment'
import type { Auth, User } from 'firebase/auth'
import { readable } from 'svelte/store'

function createAuth() {
  let auth: Auth

  // Is run anytime the first subscriber attaches to the store
  // returns a function that is called whenever the last subscriber disconnects
  const { subscribe } = readable<User | null>(undefined, set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribe = () => { }

    async function init() {
      if (browser) {
        const { app } = await import('$lib/firebase/firebase-app')
        const { getAuth, onAuthStateChanged } = await import('firebase/auth')

        auth = getAuth(app)

        unsubscribe = onAuthStateChanged(auth, set)
      }
    }

    init()

    return unsubscribe
  })

  async function sign_in(email: string, password: string) {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function sign_out() {
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
  }

  return {
    subscribe,
    sign_in,
    sign_out,
  }
}

export const authStore = createAuth()
