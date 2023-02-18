import { srcToFile } from '$lib/utils/utils';
import { Article, type ArticleJson } from '$lib/article';
import dayjs from 'dayjs';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
    const ARTICLE: ArticleJson = {
        id: -1,
        timestamp: dayjs(),
        author: "Lorin Speybrouck",
        tags: ["Belangrijk", "Algemeen"],
        title: "Clubfeest 2023",
        images: [await srcToFile("images/shoe.jpg", "shoe.jpg", "image/jpg", fetch)],
        content: "<h1>Beste atleet, beste ouders</h1><h2>Even wat informatie over 3 februari.</h2><p><br></p><p>Die dag zal er <b>geen </b>training zijn.</p><p>  Aan de mensen die ingeschreven zijn voor het clubfeest, vragen we om <b>cash  geld</b> te voorzien. De drankjes bij het eten moeten nog ter plaatse betaald  worden.</p><p>  De aanwezige laureaten van het wedstrijds- en joggingscriterium zullen ter  plaatse hun prijs ontvangen.</p><p><br></p><p>Vriendelijke groeten,</p><p>Het Bestuur<br></p>"
    };

    const ARTICLES_JSON: ArticleJson[] = Array(5).fill(ARTICLE)
        .map((e: Article) => {
            const newObj = Object.assign({}, e);
            newObj.id += 1;
            return newObj;
        });
    return {
        articles: ARTICLES_JSON.map(Article.fromJson)
    };
}) satisfies PageLoad;