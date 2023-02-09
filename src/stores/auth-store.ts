import { User } from '$lib/user';
import { writable } from 'svelte/store';

const dummy = new User("Lorin");
export const authStore = writable<User | undefined>(dummy);