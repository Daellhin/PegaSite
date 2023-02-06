import { Article } from '$lib/article';
import { error } from '@sveltejs/kit';
import { ARTICLES_JSON } from '../../../data/articlesJson';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
  console.log(params)
  const result = parseInt(params.slug);
  if (result <= 5) {
    return {
      article: ARTICLES_JSON.map(Article.fromJson)[result]
    };
  }

  throw error(404, 'Not found');
}) satisfies PageLoad;