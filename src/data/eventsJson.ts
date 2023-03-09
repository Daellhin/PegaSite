import dayjs from 'dayjs';
import type { EventJson } from '$lib/event';

export const EVENTS_JSON: EventJson[] = [
    {
        date: dayjs(),
        duration: "08:00 - 17:00",
        title: "Vlaams kampioenschap Diest"
    },
    {
        date: dayjs("2022-02-19"),
        duration: "Gehele dag",
        title: "Duffel"
    },
    {
        date: dayjs("2022-02-26"),
        duration: "Gehele dag",
        title: "Belgisch kampioenschap veldlopen"
    },
    {
        date: dayjs("2022-03-26"),
        duration: "Gehele dag",
        title: "Pegasusloop"
    },
    {
        date: dayjs("2022-09-16"),
        duration: "13:00 - 18:00",
        title: "Pegasus Open Meeting"
    },

]