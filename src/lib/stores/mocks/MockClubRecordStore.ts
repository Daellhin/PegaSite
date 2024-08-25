import { CLUB_RECORDS_JSON } from '$data/ClubRecordsJson'
import { ClubRecord } from '$lib/domain/ClubRecord'
import type { RecordInstance } from '$lib/domain/RecordInstance'
import type { AthleticEvent } from '$lib/domain/dataClasses/AthleticEvent'
import type { Category } from '$lib/domain/dataClasses/Category'
import type { Discipline } from '$lib/domain/dataClasses/Discipline'
import type { Gender } from '$lib/domain/dataClasses/Gender'
import type { Dayjs } from 'dayjs'
import { writable } from 'svelte/store'

export function createMockClubRecordStore() {
	const store = writable<ClubRecord[]>(CLUB_RECORDS_JSON.map(ClubRecord.fromJSON))
	const { subscribe, update } = store

	async function createClubRecord(discipline: Discipline, category: Category, gender: Gender, athleticEvent: AthleticEvent, newRecordInstance: RecordInstance) {
		update((clubRecords) => {
			const existingRecord = clubRecords.find((e) => e.isOfType(discipline, category, gender, athleticEvent))
			if (!existingRecord) {
				const newRecord = new ClubRecord(discipline, category, gender, athleticEvent, [newRecordInstance])
				return [...clubRecords, newRecord]
			}
			existingRecord.records.push(newRecordInstance)
			return [...clubRecords]
		})
	}
	async function deleteRecordInstance(_recordInstance: RecordInstance) {
	}
	async function approveRecordInstance(_recordInstance: RecordInstance) {
	}
	async function updateRecordInstance(_discipline: Discipline, _category: Category, _gender: Gender, _athleticEvent: AthleticEvent, _name: string, _result: string, _location: string, _date: Dayjs, _recordInstance: RecordInstance) {
	}

	return {
		subscribe,
		createClubRecord,
		deleteRecordInstance,
		approveRecordInstance,
		updateRecordInstance
	}
}

// async function addRecordsFromJson() {
//   const records = CLUB_RECORDS_JSON.map(ClubRecord.fromJSON)
//   await Promise.all(records.map(async (e) => {
//     const { getFirestore, doc, updateDoc, arrayUnion } = await import('firebase/firestore')
//     const { firebaseApp } = await import('$lib/firebase/Firebase')
//     const firestore = getFirestore(firebaseApp)

//     const clubrecordsRef = doc(firestore, Collections.CLUB_RECORDS, "singleDocument")
//     const objectKey = `${e.gender.keyName}.${e.athleticEvent.keyName}.${e.discipline.name}.${e.category.keyName}`
//     await updateDoc(clubrecordsRef, {
//       [objectKey]: arrayUnion(...e.records.map(e => e.toJSON()))
//     })
//   }))
// }
