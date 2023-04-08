import type { LinkGroupJson } from '$lib/domain/Link';

export const LINKS_JSON: (LinkGroupJson)[] = [
    {
        name: "De Club", links: [
            { name: "Lid worden", url: "" },
            { name: "Werking", url: "" },
            { name: "Clubrecords", url: "/records" },
        ]
    },
    {
        name: "Trainingen", links: [
            { name: "Trainingen", url: "" },
        ]
    },
    {
        name: "Wedstrijden", links: [
            { name: "Criterium", url: "" },
            { name: "Veldlopen", url: "" },
            { name: "Joggings", url: "" },
        ]
    },
    {
        name: "Activiteiten", links: [
            { name: "Clubweekend", url: "" },
            { name: "Atletiekstage", url: "" },
            { name: "Pegasusloop", url: "" },
        ]
    },
    {
        name: "Kalender", links: [
            { name: "Kalender", url: "/events" },
        ]
    },
    {
        name: "Contact", links: [
            { name: "Contact", url: "" }
        ]
    },
    {
        name: "Facebook", links: [
            { name: "Facebook", url: "" },
        ]
    }
];