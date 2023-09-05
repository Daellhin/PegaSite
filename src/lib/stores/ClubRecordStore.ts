import { browser } from '$app/environment'
import { ClubRecord } from '$lib/domain/ClubRecord'
import type { RecordInstance } from '$lib/domain/RecordInstance'
import type { AthleticEvent } from '$lib/domain/dataClasses/AthleticEvent'
import type { Category } from '$lib/domain/dataClasses/Category'
import type { Discipline } from '$lib/domain/dataClasses/Discipline'
import type { Gender } from '$lib/domain/dataClasses/Gender'
import { Collections } from '$lib/firebase/Firebase'
import { convertStringToBool } from '$lib/utils/Utils'
import { writable } from 'svelte/store'
import { createMockClubRecordStore } from './mocks/MockClubRecordStore'

function createClubRecordStore() {
	const store = writable<ClubRecord[]>(undefined, set => {
		async function init() {
			if (!browser) return

			// -- Load ClubRecords --
			const { firebaseApp } = await import('$lib/firebase/Firebase')
			const { getFirestore, doc, getDoc } = await import('firebase/firestore')
			const firestore = getFirestore(firebaseApp)

			const clubRecordsRef = doc(firestore, Collections.CLUB_RECORDS, "singleDocument")
			const clubRecordsSnap = await getDoc(clubRecordsRef)
			const clubRecords = ClubRecord.fromFirebaseData(clubRecordsSnap.data())

			// -- Set store --
			set(clubRecords)
		}
		init()
	})
	const { subscribe, update } = store

	async function createClubRecord(discipline: Discipline, category: Category, gender: Gender, athleticEvent: AthleticEvent, newRecordInstance: RecordInstance) {
		if (!browser) return

		// -- Upload record --
		const { getFirestore, doc, updateDoc, arrayUnion } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const clubrecordsRef = doc(firestore, Collections.CLUB_RECORDS, "singleDocument")
		const objectKey = `${gender.keyName}.${athleticEvent.keyName}.${discipline.name}.${category.keyName}`
		await updateDoc(clubrecordsRef, {
			[objectKey]: arrayUnion(newRecordInstance.toJSON())
		})

		// -- Update store --
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

	return {
		subscribe,
		createClubRecord,
	}
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
export const clubRecordStore = useMock ?
	createMockClubRecordStore() :
	createClubRecordStore()
