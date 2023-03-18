import { ClubRecord } from "../classes/ClubRecord";

export let mockedRecords = [
    {
        "Discipline": "60m",
        "Category": "Pupillen",
        "Gender": "Vrouwen",
        "AthleticEvent": "Outdoor",
        "Records": [
            {
                "Name": "Eve Willems",
                "Result": "8.71",
                "Location": "Machelen",
                "Date": "02-07-2011"
            }
        ]
    },
    {
        "Discipline": "100m",
        "Category": "Scholieren",
        "Gender": "Vrouwen",
        "AthleticEvent": "Outdoor",
        "Records": [
            {
                "Name": "Sterre De Maeyer",
                "Result": "13.08",
                "Location": "Kessel-Lo",
                "Date": "24.04.2022"
            },
            {
                "Name": "Amina Vermeulen",
                "Result": "13.14",
                "Location": "Lebbeke",
                "Date": "25.02.2007"
            }
        ]
    },
    {
        "Discipline": "200m",
        "Category": "Scholieren",
        "Gender": "Vrouwen",
        "AthleticEvent": "Outdoor",
        "Records": [
            {
                "Name": "Amina Vermeulen",
                "Result": "27.19",
                "Location": "Machelen",
                "Date": "18.07.2007"
            }
        ]
    },
    {
        "Discipline": "300m",
        "Category": "Scholieren",
        "Gender": "Vrouwen",
        "AthleticEvent": "Outdoor",
        "Records": [
            {
                "Name": "Luca D'Hondt",
                "Result": "43.83",
                "Location": "Kessel-Lo",
                "Date": "06.08.2022"
            },
            {
                "Name": "Hannelore De Wachter",
                "Result": "43.91",
                "Location": "Vilvoorde",
                "Date": "26.06.2009"
            }
        ]
    },
    {
        "Discipline": "400m",
        "Category": "Scholieren",
        "Gender": "Vrouwen",
        "AthleticEvent": "Outdoor",
        "Records": [
            {
                "Name": "Jenna Wyns",
                "Result": "58.92",
                "Location": "Oordegem",
                "Date": "03.07.2010"
            }
        ]
    },
    {
        "Discipline": "400mH",
        "Category": "Scholieren",
        "Gender": "Vrouwen",
        "AthleticEvent": "Outdoor",
        "Records": [
            {
                "Name": "Luca D'Hondt",
                "Result": "69.03",
                "Location": "Ninove",
                "Date": "10.08.2022"
            },
            {
                "Name": "Lies Manghelinckx",
                "Result": "72.61",
                "Location": "Lier",
                "Date": "05.05.2018"
            }
        ]
    },
    {
        "Discipline": "4x100m",
        "Category": "Scholieren",
        "Gender": "Vrouwen",
        "AthleticEvent": "Outdoor",
        "Records": [
            {
                "Name": "Helsen Sara, Manghelinckx Lies, Van Deuren Esther, Van Deuren Marthe",
                "Result": "54.34",
                "Location": "Lier",
                "Date": "05.05.2018"
            }
        ]
    }
]

export const RECORDS: ClubRecord[] = mockedRecords.map(e=>ClubRecord.fromJSON(e));
