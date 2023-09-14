import { browser } from '$app/environment'
import { DbUser, dbUserConverter, type DbUserJson, type DbUserRole } from '$lib/domain/DbUser'
import { Collections, firebaseConfig } from '$lib/firebase/Firebase'
import dayjs from 'dayjs'
import { writable } from 'svelte/store'

/**
 * Store that handles managing users, meant for use by admin users
 */
function createUserStore() {
	const store = writable<(DbUser)[]>(undefined, set => {
		async function init() {
			if (!browser) return

			// -- Load Users --
			const { firebaseApp } = await import('$lib/firebase/Firebase')
			const { getFirestore, getDocs, collection } = await import('firebase/firestore')
			const firestore = getFirestore(firebaseApp)

			const usersRef = collection(firestore, Collections.USERS)
			const usersSnap = await getDocs(usersRef)
			const users = usersSnap.docs.map(e => DbUser.fromJson(e.id, e.data() as DbUserJson))

			// -- Set store --
			set(users)
		}
		init()
	})
	const { subscribe, update } = store

	async function createUser(email: string, password: string, roles: DbUserRole[], displayName: string) {
		// -- Create duplicate firebase app (otherwise creating a user will log out the current user) --
		const { initializeApp } = await import('firebase/app')
		const { getAuth } = await import('firebase/auth')
		const secondaryFirebaseApp = initializeApp(firebaseConfig, "secondary")
		const auth = getAuth(secondaryFirebaseApp)

		// -- Create authUser --
		const { createUserWithEmailAndPassword, updateProfile, signOut } = await import('firebase/auth')

		const userCredential = await createUserWithEmailAndPassword(auth, email, password)
		const authUser = userCredential.user
		await updateProfile(authUser, { displayName: displayName })
		await signOut(auth)

		// -- Create dbUser --
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const { getFirestore, doc, setDoc } = await import('firebase/firestore')
		const firestore = getFirestore(firebaseApp)

		const creationTimestamp = dayjs(Number((authUser.metadata as any).createdAt))
		const dbUser = new DbUser(authUser.uid, roles, authUser.email!, displayName, creationTimestamp)
		const dbUserRef = doc(firestore, Collections.USERS, authUser.uid).withConverter(dbUserConverter)
		await setDoc(dbUserRef, dbUser)

		// -- Set store --
		update((users) => [...users, dbUser])
	}

	async function updateUserRole(uid: string, roles: DbUserRole[]) {
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
		const firestore = getFirestore(firebaseApp)

		// -- Update user --
		const dbUserRef = doc(firestore, Collections.USERS, uid)
		await updateDoc(dbUserRef, { roles: roles })

		// -- Update store --
		update((users) => {
			const user = users.find(u => u.uid === uid)
			if (user) user.roles = roles
			return [...users]
		})
	}

	return {
		subscribe,
		createUser,
		updateUserRole,
	}
}

export const userStore = createUserStore()
