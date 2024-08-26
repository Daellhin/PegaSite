import type { PageJson } from "$lib/domain/Page"
import { Timestamp } from "firebase/firestore"

export const PAGE: PageJson = {
    id: "lid-worden",
    lastEdited: new Timestamp(Math.round(Date.now() / 1000), 0),
    title: "Lid worden",
    images: [
        "https://firebasestorage.googleapis.com/v0/b/pega-site.appspot.com/o/article-images%2F3160cccc-2601-4e3e-b901-7ae17563d578?alt=media&token=e8efc3ce-d0ca-46ce-bd6f-3266c4ff8673"
    ],
    content: "<h1><strong>1. Leeftijd</strong></h1><ul><li>Minimum: <strong>5 jaar zijn</strong> (geboren in 2017)</li></ul><ul><li>Maximum:&nbsp;zolang de gezondheid het toelaat</li></ul><h1><br><strong></strong></h1><h1><strong>2. Aansluiting</strong></h1><p>Een aansluiting (&nbsp;01 Nov Y tot 31 Okt Y+1) omvat</p><ul><li>Begeleide trainingen</li><li>Verzekering tegen sportongevallen</li><li>Aansluiting bij de Vlaamse Atletiekliga (VAL), wedstrijdnummer inbegrepen voor wedstrijdatleten</li></ul><h1><br><strong></strong></h1><h1><strong>3. Lidgelden</strong></h1><p>Aansluiting&nbsp;<strong>wedstrijdatleet</strong>:&nbsp;</p><ul><li>kinderen&nbsp;tot en met cadetten (geboortejaar&nbsp;2017 tot 2008) : 100 euro<br></li><li>vanaf scholieren (geboortejaar&nbsp;2007 en vroeger): 115 euro<br></li></ul><p>Aansluiting&nbsp;<strong>recreant/jogger</strong> (<strong>NIET</strong> voor kinderen)</p><ul><li>&nbsp;recreanten (geboortejaar&nbsp;2007 en vroeger) : 80 euro<br></li></ul><p><strong>Familiekorting</strong>:&nbsp;Vanaf 4de aansluiting, –&nbsp;20 euro&nbsp;voor 4de lid, 5de lid, …..(Gedomicilieerd op zelfde adres)</p><p><strong>Atletiekstagekorting</strong>:&nbsp;Nieuwe aansluitingen&nbsp;die  hebben deelgenomen aan de atletiekstage krijgen een éénmalige korting  van&nbsp;10 euro.&nbsp;(NIET van toepassing bij hernieuwing van een bestaand  lidmaatschap)</p><h1><br><strong></strong></h1><h1><strong>4.Inschijving pas definitief als volgende stappen zijn doorlopen!</strong></h1><ol><li>Inschrijven online:&nbsp;inschrijving via dit&nbsp;<a>formulier</a></li><li>Betalen lidgeld:&nbsp;Overschrijving van het lidgeld op het rekeningnummer van AC Pegasus : <ul><li>vzw:&nbsp;BE64&nbsp;9731&nbsp;8193&nbsp;5052&nbsp; BIC :&nbsp;ARSPBE22&nbsp;.</li><li>Vermeld de naam en voornaam van het lid te vermelden bij de betaling.</li></ul></li><li>Vergunningsaanvraag: in te vullen en te ondertekenen, voor minderjarigen&nbsp;dient dit door één van ouders&nbsp;te gebeuren.&nbsp;<br>Dit document kan u downloaden door op deze&nbsp;<a>link</a>&nbsp;te klikken of bij het bestuur worden bekomen.&nbsp;Gelieve dit formulier in gevuld te mailen naar&nbsp;<a>bestuur@acpegasus.be</a>, of worden bezorgd aan de trainer.</li></ol>"
}

export const PAGES_JSON: PageJson[] = [PAGE]
