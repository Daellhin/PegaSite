
import { browser } from '$app/environment'
import { ClubRecord, type ClubRecordJson } from '$lib/domain/ClubRecord'
import { writable } from 'svelte/store'
import ClubRecords from '$data/Clubrecords.json';
import type { Discipline } from '$lib/domain/data-classes/Discipline';
import type { Category } from '$lib/domain/data-classes/Category';
import type { Gender } from '$lib/domain/data-classes/Gender';
import type { AthleticEvent } from '$lib/domain/data-classes/AthleticEvent';
import type { RecordInstance } from '$lib/domain/RecordInstance';
import { Collections } from '$lib/firebase/firebase';

function createClubRecordStore() {
  const store = writable([] as ClubRecord[], set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const unsubscribe = () => { }

    async function init() {
      if (browser) {
        const records = (ClubRecords as unknown as ClubRecordJson[]).map(ClubRecord.fromJSON);
        set(records)
      }
    }
    init()

    return unsubscribe
  })
  const { subscribe, update } = store

  async function add(discipline: Discipline, category: Category, gender: Gender, athleticEvent: AthleticEvent, newRecord: RecordInstance) {
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
      [objectKey]: arrayUnion(newRecord.toJSON())
    })

    // -- Update store --
    //update((clubRecords) => ([...clubRecords, newClubRecord]))
  }

  return {
    subscribe,
    add
  }
}

export const clubRecordStore = createClubRecordStore()
