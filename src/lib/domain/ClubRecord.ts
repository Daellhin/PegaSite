import { AthleticEvent } from './data-classes/AthleticEvent';
import { Category } from './data-classes/Category';
import { Discipline } from './data-classes/Discipline';
import { Gender } from './data-classes/Gender';
import { RecordInstance, type RecordInstanceJson } from './RecordInstance';

export interface ClubRecordJson {
    discipline: string
    category: string
    gender: string
    athleticEvent: string
    records: RecordInstanceJson[]
}

export class ClubRecord {
    public searchableString: string;

    constructor(
        public discipline: Discipline,
        public category: Category,
        public gender: Gender,
        public athleticEvent: AthleticEvent,
        public records: RecordInstance[]
    ) {
        this.searchableString = `${discipline.name.toLowerCase()} ${category.pluralName.toLowerCase()} ${gender.adultSingularName.toLowerCase()} ${athleticEvent.name.toLowerCase()} ${records.map((e) => e.searchableString.toLowerCase())}`
    }

    hasPreviousRecords() {
        return this.records.length > 1;
    }

    static fromJSON(json: ClubRecordJson): ClubRecord {
        try {
            return new ClubRecord(
                Discipline.match(json.discipline),
                Category.match(json.category),
                Gender.match(json.gender),
                AthleticEvent.match(json.athleticEvent),
                json.records.map(RecordInstance.fromJSON)
            );
        } catch (error) {
            console.error("Error while convertering json", json)
            throw error;
        }
    }

    static fromFirebaseData(toMap: any) {
        const json = Object.keys(toMap).flatMap((gender) => {
            return Object.keys(toMap[gender]).flatMap((athleticEvent) => {
                return Object.keys(toMap[gender][athleticEvent]).flatMap((discipline) => {
                    return Object.keys(toMap[gender][athleticEvent][discipline]).flatMap((category) => {
                        const records = toMap[gender][athleticEvent][discipline][category] as RecordInstanceJson[];
                        return { discipline, category, gender, athleticEvent, records } as ClubRecordJson
                    })
                })
            })
        })
        return json.map(this.fromJSON);
    }
}
