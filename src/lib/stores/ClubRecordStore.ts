import { browser } from '$app/environment';
import { CLUB_RECORDS_JSON } from '$data/ClubRecordsJson';
import { ClubRecord } from '$lib/domain/ClubRecord';
import type { RecordInstance } from '$lib/domain/RecordInstance';
import type { AthleticEvent } from '$lib/domain/data-classes/AthleticEvent';
import type { Category } from '$lib/domain/data-classes/Category';
import type { Discipline } from '$lib/domain/data-classes/Discipline';
import type { Gender } from '$lib/domain/data-classes/Gender';
import { Collections } from '$lib/firebase/firebase';
import { writable } from 'svelte/store';

async function addRecordsFromJson() {
  const records = CLUB_RECORDS_JSON.map(ClubRecord.fromJSON);
  await Promise.all(records.map(async (e) => {
    const { getFirestore, doc, updateDoc, arrayUnion } = await import('firebase/firestore')
    const { firebaseApp } = await import('$lib/firebase/firebase')
    const firestore = getFirestore(firebaseApp)

    const clubrecordsRef = doc(firestore, Collections.CLUB_RECORDS, "singleDocument")
    const objectKey = `${e.gender.keyName}.${e.athleticEvent.keyName}.${e.discipline.name}.${e.category.keyName}`
    console.log(e)
    await updateDoc(clubrecordsRef, {
      [objectKey]: arrayUnion(...e.records.map(e => e.toJSON()))
    })
  }))
}

function createClubRecordStore() {
  const store = writable([] as ClubRecord[], set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const unsubscribe = () => { }

    async function init() {
      if (browser) {
        return
      }
      // const records = (ClubRecords as unknown as ClubRecordJson[]).map(ClubRecord.fromJSON);

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

    return unsubscribe
  })
  const { subscribe, update } = store

  async function add(discipline: Discipline, category: Category, gender: Gender, athleticEvent: AthleticEvent, newRecordInstance: RecordInstance) {
    if (!browser) {
      console.error("Why are you adding a clubRecord from the server")
      return
    }

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
      const exsistingRecord = clubRecords.filter((e) =>
        e.discipline === discipline &&
        e.category === category &&
        e.gender === gender &&
        e.athleticEvent === athleticEvent
      )
      if (exsistingRecord?.length === 1) {
        exsistingRecord[0].records.push(newRecordInstance)
        return [...clubRecords]
      } else {
        const newRecord = new ClubRecord(discipline, category, gender, athleticEvent, [newRecordInstance])
        return [...clubRecords, newRecord]
      }
    })
  }

  return {
    subscribe,
    add
  }
}

export const clubRecordStore = createClubRecordStore()
