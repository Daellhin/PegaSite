import type { SponsorJson } from "$lib/domain/Sponsor"

export const SPONSOR: SponsorJson = {
    // id: "0",
    name: "Mock Sponsor",
    url: "https://www.google.com/",
    imageId: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    visible: true,
}

export const SPONSORS_JSON: SponsorJson[] = [SPONSOR]
