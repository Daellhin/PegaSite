
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { get } from 'svelte/store';

export const load = (() => {
  // TODO await auth details
  // if (!get(authStore)) {
  //   // TODO give unauthorised alert
  //   throw redirect(307, '/');
  // }
}) satisfies LayoutServerLoad;