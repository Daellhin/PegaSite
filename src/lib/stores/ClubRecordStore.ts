import { browser } from '$app/environment'
import { ClubRecord } from '$lib/domain/ClubRecord'
import type { RecordInstance } from '$lib/domain/RecordInstance'
import type { AthleticEvent } from '$lib/domain/dataClasses/AthleticEvent'
import type { Category } from '$lib/domain/dataClasses/Category'
import type { Discipline } from '$lib/domain/dataClasses/Discipline'
import type { Gender } from '$lib/domain/dataClasses/Gender'
import { Collections } from '$lib/firebase/Firebase'
import { convertStringToBool } from '$lib/utils/Utils'
import type { Dayjs } from 'dayjs'
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
		// -- Upload record --
		const { getFirestore, doc, updateDoc, arrayUnion } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const clubRecordsRef = doc(firestore, Collections.CLUB_RECORDS, "singleDocument")
		const clubRecordKey = `${gender.keyName}.${athleticEvent.keyName}.${discipline.name}.${category.keyName}`
		await updateDoc(clubRecordsRef, {
			[clubRecordKey]: arrayUnion(newRecordInstance.toJSON())
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

	async function deleteRecordInstance(recordInstance: RecordInstance) {
		const clubRecord = recordInstance.clubRecord
		if (!clubRecord) throw new Error("RecordInstance must be linked to a ClubRecord")

		const { getFirestore, doc, updateDoc, arrayRemove } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const clubRecordsRef = doc(firestore, Collections.CLUB_RECORDS, "singleDocument")
		const clubRecordKey = `${clubRecord.gender.keyName}.${clubRecord.athleticEvent.keyName}.${clubRecord.discipline.name}.${clubRecord.category.keyName}`
		await updateDoc(clubRecordsRef, {
			[clubRecordKey]: arrayRemove(recordInstance.toJSON())
		})

		update((clubRecords) => {
			return [...clubRecords.map((e) => {
				if (e === recordInstance.clubRecord)
					e.records = e.records.filter((r) => r !== recordInstance)
				return e
			})]
		})
	}

	async function approveRecordInstance(recordInstance: RecordInstance) {
		const clubRecord = recordInstance.clubRecord
		if (!clubRecord) throw new Error("RecordInstance must be linked to a ClubRecord")

		const { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, runTransaction } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const clubRecordsRef = doc(firestore, Collections.CLUB_RECORDS, "singleDocument")
		await runTransaction(firestore, async (transaction) => {
			const clubrecordKey = `${clubRecord.gender.keyName}.${clubRecord.athleticEvent.keyName}.${clubRecord.discipline.name}.${clubRecord.category.keyName}`
			await updateDoc(clubRecordsRef, {
				[clubrecordKey]: arrayRemove(recordInstance.toJSON())
			})
			recordInstance.checked = true
			await updateDoc(clubRecordsRef, {
				[clubrecordKey]: arrayUnion(recordInstance.toJSON())
			})
		})

		// -- Update store --
		update((clubRecords) => [...clubRecords])
	}

	async function updateRecordInstance(discipline: Discipline, category: Category, gender: Gender, athleticEvent: AthleticEvent, name: string, result: string, location: string, date: Dayjs, recordInstance: RecordInstance) {
		const clubRecord = recordInstance.clubRecord
		if (!clubRecord) throw new Error("RecordInstance must be linked to a ClubRecord")

		const { getFirestore, doc, updateDoc, arrayRemove, runTransaction, arrayUnion } = await import('firebase/firestore')
		const { firebaseApp } = await import('$lib/firebase/Firebase')
		const firestore = getFirestore(firebaseApp)

		const clubRecordsRef = doc(firestore, Collections.CLUB_RECORDS, "singleDocument")
		await runTransaction(firestore, async (transaction) => {
			const oldClubrecordKey = `${clubRecord.gender.keyName}.${clubRecord.athleticEvent.keyName}.${clubRecord.discipline.name}.${clubRecord.category.keyName}`
			await updateDoc(clubRecordsRef, {
				[oldClubrecordKey]: arrayRemove(recordInstance.toJSON())
			})
			const newClubrecordKey = `${gender.keyName}.${athleticEvent.keyName}.${discipline.name}.${category.keyName}`
			recordInstance.name = name
			recordInstance.result = result
			recordInstance.location = location
			recordInstance.date = date
			await updateDoc(clubRecordsRef, {
				[newClubrecordKey]: arrayUnion(recordInstance.toJSON())
			})
		})

		// -- Update store --
		update((clubRecords) => {
			// -- Remove old --
			const oldRecord = clubRecords.find((e) => e.isOfType(clubRecord.discipline, clubRecord.category, clubRecord.gender, clubRecord.athleticEvent))
			oldRecord!.records.filter((e) => e !== recordInstance)

			// -- Add new --
			const existingRecord = clubRecords.find((e) => e.isOfType(discipline, category, gender, athleticEvent))
			if (!existingRecord) {
				const newRecord = new ClubRecord(discipline, category, gender, athleticEvent, [recordInstance])
				return [...clubRecords, newRecord]
			}
			existingRecord.records.push(recordInstance)
			return [...clubRecords]
		})
	}

	return {
		subscribe,
		createClubRecord,
		deleteRecordInstance,
		approveRecordInstance,
		updateRecordInstance
	}
}

const useMock = convertStringToBool(import.meta.env.VITE_USEMOCKING)
export const clubRecordStore = useMock ?
	createMockClubRecordStore() :
	createClubRecordStore()
