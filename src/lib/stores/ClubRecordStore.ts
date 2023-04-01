import { browser } from '$app/environment';
import { ClubRecord } from '$lib/domain/ClubRecord';
import type { RecordInstance } from '$lib/domain/RecordInstance';
import type { AthleticEvent } from '$lib/domain/data-classes/AthleticEvent';
import type { Category } from '$lib/domain/data-classes/Category';
import type { Discipline } from '$lib/domain/data-classes/Discipline';
import type { Gender } from '$lib/domain/data-classes/Gender';
import { Collections } from '$lib/firebase/firebase';
import { writable } from 'svelte/store';

function createClubRecordStore() {
  const store = writable([] as ClubRecord[], set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const unsubscribe = () => { }

    async function init() {
      if (browser) {
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
    }
    init()

    return unsubscribe
  })
  const { subscribe, update } = store

  async function add(discipline: Discipline, category: Category, gender: Gender, athleticEvent: AthleticEvent, newRecordInstance: RecordInstance) {
    if (!browser) {
      console.error("Why are you adding an event from the server")
      return
    }
    // TODO https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array

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
