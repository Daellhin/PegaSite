import { Article, type ArticleJson } from '$lib/article';
import { srcToFile } from '$lib/utils/utils';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const result = parseInt(params.slug);
  if (result <= 5) {
    const ARTICLE: ArticleJson = {
      id: -1,
      timestamp: dayjs(),
      author: "Lorin Speybrouck",
      tags: ["Belangrijk", "Algemeen"],
      title: "Clubfeest 2023",
      images: [await srcToFile("../images/shoe.jpg", "shoe.jpg", "image/jpg", fetch)],
      content: "<h1>Beste atleet, beste ouders</h1><h2>Even wat informatie over 3 februari.</h2><p><br></p><p>Die dag zal er <b>geen </b>training zijn.</p><p>  Aan de mensen die ingeschreven zijn voor het clubfeest, vragen we om <b>cash  geld</b> te voorzien. De drankjes bij het eten moeten nog ter plaatse betaald  worden.</p><p>  De aanwezige laureaten van het wedstrijds- en joggingscriterium zullen ter  plaatse hun prijs ontvangen.</p><p><br></p><p>Vriendelijke groeten,</p><p>Het Bestuur<br></p>"
    };

    return {
      article: Article.fromJson(ARTICLE)
    };
  }

  throw error(404, 'Not found');
}) satisfies PageLoad;