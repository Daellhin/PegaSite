import type { LinkGroupJson } from '$lib/domain/Link';

export const LINKS_JSON: (LinkGroupJson)[] = [
    {
        name: "De Club", links: [
            { title: "Lid worden" },
            { title: "Werking" },
            { title: "Clubrecords", customUrl: "/records" },
        ]
    },
    {
        name: "Trainingen", links: [
            { title: "Trainingen" },
        ]
    },
    {
        name: "Wedstrijden", links: [
            { title: "Criterium" },
            { title: "Veldlopen" },
            { title: "Joggings" },
        ]
    },
    {
        name: "Activiteiten", links: [
            { title: "Clubweekend" },
            { title: "Atletiekstage" },
            { title: "Pegasusloop" },
        ]
    },
    {
        name: "Kalender", links: [
            { title: "Kalender", customUrl: "/events" },
        ]
    },
    {
        name: "Contact", links: [
            { title: "Contact" }
        ]
    },
    {
        name: "Facebook", links: [
            { title: "Facebook", customUrl: "fb.com/PegasusLonderzeel" },
        ]
    }
];