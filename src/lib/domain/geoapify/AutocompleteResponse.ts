type result_type = "unknown" | "amenity" | "building" | "street" | "suburb" | "district" | "postcode" | "city" | "county" | "state" | "country"

export interface AutocompleteResponseWrapperJson {
    results: AutocompleteResponseJson[],
    query: {
        text: string,
        parsed: {
            housenumber: string,
            street: string,
            expected_type: string
        }
    }
}

export interface AutocompleteResponseJson {
    datasource: {
        sourcename: string
        attribution: string
        license: string
        url: string
    },
    country: string,
    country_code: string,
    state: string,
    county: string,
    city: string,
    postcode: string,
    district: string,
    street: string | undefined,
    housenumber: string | undefined,
    lon: number,
    lat: number,
    formatted: string,
    address_line1: string,
    address_line2: string,
    timezone: {
        name: string,
        offset_STD: string,
        offset_STD_seconds: number,
        offset_DST: string,
        offset_DST_seconds: number,
        abbreviation_STD: string,
        abbreviation_DST: string,
    },
    plus_code: string,
    result_type: result_type,
    rank: {
        importance: number,
        confidence: number,
        match_type: string,
    },
    place_id: string,
    bbox: {
        lon1: number,
        lat1: number,
        lon2: number,
        lat2: number,
    }
}

export class AutocompleteResponse {
    constructor(
        public country: string,
        public postcode: string,
        public city: string,
        public street: string | undefined,
        public housenumber: string | undefined,
        public result_type: result_type,
        public formatted: string,
    ) { }

    static fromJson(json: AutocompleteResponseJson) {
        return new AutocompleteResponse(
            json.country,
            json.postcode,
            json.city,
            json.street,
            json.housenumber,
            json.result_type,
            json.formatted
        )
    }
}
