import { ClubRecord, type ClubRecordJson } from '$lib/domain/ClubRecord';
import type { AthleticEvent } from '$lib/domain/data-classes/AthleticEvent';
import type { Category } from '$lib/domain/data-classes/Category';
import type { Gender } from '$lib/domain/data-classes/Gender';
import ClubRecords from '$lib/mock/Clubrecords.json';

export class DataService {
    private static allRecords = this.fetchAllRecords();

    private static fetchAllRecords() {
        return (ClubRecords as ClubRecordJson[]).map(ClubRecord.fromJSON);
    }

    public static getRecords(category: Category, gender: Gender, athleticEvent: AthleticEvent,) {
        return this.allRecords.filter((e) => e.category === category && e.gender === gender && e.athleticEvent === athleticEvent)
    }

}

