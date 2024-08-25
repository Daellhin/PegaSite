import { browser } from '$app/environment'
import { DbUser, dbUserConverter } from '$lib/domain/DbUser'
import { Collections } from '$lib/firebase/Firebase'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Auth, User } from 'firebase/auth'
import { readable } from 'svelte/store'
import { createMockAuthStore } from './mocks/MockAuthStore'

/**
 * 
 * Sources: 
 * - https://www.captaincodeman.com/lazy-loading-firebase-with-sveltekit
 * - https://www.captaincodeman.com/how-to-await-firebase-auth-with-sveltekit#creating-an-awaitable-auth-promise
 */
function createAuthStore() {
	let auth: Auth

	const innerStore = readable<User | null>(undefined, set => {
		let unsubscribe = () => { }

		async function init() {
			if (!browser) return

			// -- Load auth(user is set asynchronously) --
			const { firebaseApp } = await import('$lib/firebase/Firebase')
			const { getAuth, onAuthStateChanged } = await import('firebase/auth')

			auth = getAuth(firebaseApp)
			unsubscribe = onAuthStateChanged(auth, set)
		}
		init()

		return unsubscribe
	})
	const { subscribe } = innerStore

	const known = new Promise<void>(resolve => {
		let unsub = () => { }
		unsub = subscribe(user => {
			if (user !== undefined) {
				resolve()
				unsub()
			}
		})
	})

	const dbUser = new Promise<DbUser>(async (resolve, reject) => {
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

					if (userData) resolve(userData)
					else reject(`DbUser with id ${user.uid} not found`)
				} catch (error) {
					reject(error)
				}
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
if (useMock) console.warn("Mocking is on")
/**
 * Store that handles authentication, and profile updates for current user
 */
export const authStore = useMock ?
	createMockAuthStore() :
	createAuthStore()
