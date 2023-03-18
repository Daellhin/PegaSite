import type { AthleticEvent } from './../classes/dataClasses/AthleticEvent';
import type { Category } from '$lib/classes/dataClasses/Category';
import type { Gender } from '$lib/classes/dataClasses/Gender';
import { ClubRecord, type ClubRecordJson } from '../classes/ClubRecord';
import ClubRecords from '../mock/Clubrecords.json';

export class DataService {
    private static allRecords = this.fetchAllRecords();

    private static fetchAllRecords() {
        return (ClubRecords as ClubRecordJson[]).map(ClubRecord.fromJSON);
    }

    public static getRecords(category: Category, gender: Gender, athleticEvent: AthleticEvent,) {
        return this.allRecords.filter((e) => e.category === category && e.gender === gender && e.athleticEvent === athleticEvent)
    }

}

