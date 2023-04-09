import type { LinkGroupJson } from '$lib/domain/Link'

export const LINKS_JSON: (LinkGroupJson)[] = [
    {
        name: "De Club", order: 0, links: [
            { title: "Lid worden", order: 0 },
            { title: "Werking", order: 1 },
            { title: "Clubrecords", order: 2, customUrl: "/records" },
        ]
    },
    {
        name: "Trainingen", order: 1, links: [
            { title: "Trainingen", order: 0 },
        ]
    },
    {
        name: "Wedstrijden", order: 2, links: [
            { title: "Criterium", order: 0 },
            { title: "Veldlopen", order: 1 },
            { title: "Joggings", order: 2 },
        ]
    },
    {
        name: "Activiteiten", order: 3, links: [
            { title: "Clubweekend", order: 0 },
            { title: "Atletiekstage", order: 1 },
            { title: "Pegasusloop", order: 2 },
        ]
    },
    {
        name: "Kalender", order: 4, links: [
            { title: "Kalender", order: 0, customUrl: "/events" },
        ]
    },
    {
        name: "Contact", order: 5, links: [
            { title: "Contact", order: 0 }
        ]
    },
    {
        name: "Facebook", order: 6, links: [
            { title: "Facebook", order: 0, customUrl: "fb.com/PegasusLonderzeel" },
        ]
    }
]