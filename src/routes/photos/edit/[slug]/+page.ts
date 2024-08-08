import type { PageLoad } from './$types'

export const prerender = false

export const load = (async ({ params }) => {
  return {
    id: params.slug
  }
}) satisfies PageLoad
