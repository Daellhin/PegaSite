
import { DbUser } from '$lib/domain/DbUser'
import dayjs from 'dayjs'
import type { User } from 'firebase/auth'
import { writable } from 'svelte/store'

export function createMockAuthStore() {
    const store = writable<User | null>(undefined, set => {
        set({} as User)
    })
    const { subscribe, update } = store

    const known = Promise.resolve()
    const dbUser = Promise.resolve(new DbUser("1", ["admin"], "email", "displayName", dayjs(1)))

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