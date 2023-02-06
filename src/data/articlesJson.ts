import dayjs from "dayjs"
import type { ArticleJson } from "$lib/article";

const ARTICLE: ArticleJson =  {
    timestamp: dayjs(),
    author: "Lorin Speybrouck",
    tags: ["Belangrijk", "Algemeen"],
    title: "Clubfeest 2023",
    image: "images/shoe.jpg",
    content: "<h1>Beste atleet, beste ouders</h1><h2>Even wat informatie over 3 februari.</h2><p><br></p><p>Die dag zal er <b>geen </b>training zijn.</p><p>  Aan de mensen die ingeschreven zijn voor het clubfeest, vragen we om <b>cash  geld</b> te voorzien. De drankjes bij het eten moeten nog ter plaatse betaald  worden.</p><p>  De aanwezige laureaten van het wedstrijds- en joggingscriterium zullen ter  plaatse hun prijs ontvangen.</p><p><br></p><p>Vriendelijke groeten,</p><p>Het Bestuur<br></p>"
};

export const ARTICLES_JSON: ArticleJson[] = Array(5).fill(ARTICLE);