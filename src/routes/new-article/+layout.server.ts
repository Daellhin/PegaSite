import { authStore } from './../../stores/auth-store';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { get } from 'svelte/store';

export const load = (() => {
  if (!get(authStore)) {
    // TODO give unauthorised alert
    throw redirect(307, '/');
  }
}) satisfies LayoutServerLoad;