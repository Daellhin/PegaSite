import { browser } from '$app/environment';
import { CLUB_RECORDS_JSON } from '$data/ClubRecordsJson';
import { ClubRecord } from '$lib/domain/ClubRecord';
import type { RecordInstance } from '$lib/domain/RecordInstance';
import type { AthleticEvent } from '$lib/domain/data-classes/AthleticEvent';
import type { Category } from '$lib/domain/data-classes/Category';
import type { Discipline } from '$lib/domain/data-classes/Discipline';
import type { Gender } from '$lib/domain/data-classes/Gender';
import { Collections } from '$lib/firebase/firebase';
import { convertStringToBool } from '$lib/utils/Utils';
import { writable } from 'svelte/store';

async function addRecordsFromJson() {
  const records = CLUB_RECORDS_JSON.map(ClubRecord.fromJSON);
  await Promise.all(records.map(async (e) => {
    const { getFirestore, doc, updateDoc, arrayUnion } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const clubrecordsRef = doc(firestore, Collections.CLUB_RECORDS, "singleDocument")
    const objectKey = `${e.gender.keyName}.${e.athleticEvent.keyName}.${e.discipline.name}.${e.category.keyName}`
    await updateDoc(clubrecordsRef, {
      [objectKey]: arrayUnion(...e.records.map(e => e.toJSON()))
    })
  }))
}

function createMockClubRecordStore() {
  const store = writable<ClubRecord[]>(undefined, set => {
    const clubRecords = CLUB_RECORDS_JSON.map(ClubRecord.fromJSON);
    set(clubRecords)
  })
  const { subscribe, update } = store

  async function add(discipline: Discipline, category: Category, gender: Gender, athleticEvent: AthleticEvent, newRecordInstance: RecordInstance) {
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
    add
  }
}

function createClubRecordStore() {
  const store = writable<ClubRecord[]>(undefined, set => {
    async function init() {
      if (!browser) return

      // -- Load ClubRecords --
      const { firebaseApp } = await import('$lib/firebase/firebase')
      const { getFirestore, doc, getDoc } = await import('firebase/firestore')
      const firestore = getFirestore(firebaseApp)

      const clubrRecordsRef = doc(firestore, Collections.CLUB_RECORDS, "singleDocument");
      const clubRecordsSnap = await getDoc(clubrRecordsRef);
      const clubRecords = ClubRecord.fromFirebaseData(clubRecordsSnap.data())

      // -- Set store --
      set(clubRecords)
    }
    init()
  })
  const { subscribe, update } = store

  async function add(discipline: Discipline, category: Category, gender: Gender, athleticEvent: AthleticEvent, newRecordInstance: RecordInstance) {
    if (!browser) return

    // -- Upload record --
    const { getFirestore, doc, updateDoc, arrayUnion } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
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
    add
  }
}

const useMock: boolean = convertStringToBool(import.meta.env.VITE_USEMOCKING);
export const clubRecordStore = useMock ?
  createMockClubRecordStore() :
  createClubRecordStore()
