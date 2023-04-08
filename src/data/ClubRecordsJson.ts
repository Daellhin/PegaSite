/* eslint-disable @typescript-eslint/no-explicit-any */
import ClubRecords from '$data/json/Clubrecords.json'
import type { ClubRecordJson } from '$lib/domain/ClubRecord'
import dayjs from 'dayjs'
import customParseFormat from "dayjs/plugin/customParseFormat"
import { Timestamp } from 'firebase/firestore'

dayjs.extend(customParseFormat)

// converts clubrecords to firebase json format
export const CLUB_RECORDS_JSON = (ClubRecords as any[]).map(record => {
    const newRecords = record.records.map((recordsInstance: any) => {
        let newDate = null
        if (recordsInstance.date !== "") {
            const convertedDate = dayjs(recordsInstance.date, "DD.MM.YYYY")
            if (!convertedDate.isValid())
                throw new Error(`Invallid date (${recordsInstance.date})`)
            newDate = Timestamp.fromDate(convertedDate.toDate())
        }
        return { ...recordsInstance, date: newDate, checked: true }
    })
    return { ...record, records: newRecords } as ClubRecordJson
})