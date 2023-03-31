
import { browser } from '$app/environment'
import { ClubRecord, type ClubRecordJson } from '$lib/domain/ClubRecord'
import { writable } from 'svelte/store'
import ClubRecords from '$data/Clubrecords.json';

function createClubRecordStore() {
  const store = writable([] as ClubRecord[], set => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const unsubscribe = () => { }

    async function init() {
      if (browser) {
        const records = (ClubRecords as ClubRecordJson[]).map(ClubRecord.fromJSON);
        set(records)
      }
    }
    init()

    return unsubscribe
  })
  const { subscribe, update } = store

  async function add(newClubRecord: ClubRecord) {
    if (!browser) {
      console.error("Why are you adding an event from the server")
      return
    }
    // TODO https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array

    // -- Update store --
    update((clubRecords) => ([...clubRecords, newClubRecord]))
  }

  return {
    subscribe,
    add
  }
}

export const clubRecordStore = createClubRecordStore()
