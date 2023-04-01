import type { CalendarEventJson } from '$lib/domain/CalendarEvent';
import { Timestamp } from 'firebase/firestore';

export const EVENTS_JSON: CalendarEventJson[] = [
    {
        id: "0",
        date: Timestamp.fromDate(new Date("2023-03-19")),
        duration: "10:30 - 12:00",
        location: "Blauwenhoek 76, 1840 Londerzeel",
        title: "Thematraining- Spurt",
        info: ""
    },
    {
        id: "1",
        date: Timestamp.fromDate(new Date("2023-03-26")),
        duration: "08:00 - 17:00",
        location: "J. Van Doorslaerstraat 22, 1840 Steenhuffel",
        title: "Pegasusloop",
        info: ""
    },
    {
        id: "2",
        date: Timestamp.fromDate(new Date("2023-05-07")),
        duration: "Gehele dag",
        location: "",
        title: "Interclub AC",
        info: ""
    },
    {
        id: "3",
        date: Timestamp.fromDate(new Date("2023-05-13")),
        duration: "08:00 - 17:00",
        location: "Blauwenhoek 76, 1840 Londerzeel",
        title: "Interclub PUP en MIN",
        info: "De interclub is een groepsgebeuren. Een atleet neemt deel aan één of meerdere van de individuele nummers, de geleverde prestaties"
    },
    {
        id: "4",
        date: Timestamp.fromDate(new Date("2023-05-18")),
        duration: "11:00 - 18:00",
        location: "Blauwenhoek 76, 1840 Londerzeel",
        title: "3de Pegasus jeugdmeeting",
        info: "Inschrijvingen via 'Atletiek.nu'"
    },
]