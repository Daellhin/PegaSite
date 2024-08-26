import type { LinkGroupJson } from '$lib/domain/Link'

export const LINKS_JSON: (LinkGroupJson)[] = [
    {
        name: "De Club", order: 0, links: [
            { title: "Clubkledij", order: 0 },
            { title: "Werking", order: 1 },
            { title: "Lid worden", order: 2 },
            { title: "Clubrecords", order: 3, customUrl: "/records" },
            { title: "Facebook", order: 4, customUrl: "https://fb.com/PegasusLonderzeel" },
        ]
    },
    {
        name: "Trainingen", order: 1, links: [
            { title: "Trainers", order: 0 },
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
            { title: "Clubweekend 2023", order: 0 },
            { title: "Atletiekstage 2023", order: 1 },
            { title: "Pegasusloop", order: 2 },
        ]
    },
    {
        name: "Contact", order: 4, links: [
            { title: "Contact", order: 0 }
        ]
    },
    {
        name: "Kalender", order: 5, links: [
            { title: "Kalender", order: 0, customUrl: "/events" },
        ]
    },
    {
        name: "Foto's", order: 6, links: [
            { title: "Foto's", order: 0, customUrl: "/photos" },
        ]
    },
]