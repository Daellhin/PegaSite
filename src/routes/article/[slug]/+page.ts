import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const result = parseInt(params.slug);
  return {
    id: result
  };
  // throw error(404, 'Not found');
}) satisfies PageLoad;