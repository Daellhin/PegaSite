import type { User } from '$lib/user';
import { writable } from 'svelte/store';

export const authStore = writable<User | undefined>(undefined);