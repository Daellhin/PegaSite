import { AthleticEvent } from './data-classes/AthleticEvent';
import { Category } from './data-classes/Category';
import { Discipline } from './data-classes/Discipline';
import { Gender } from './data-classes/Gender';
import { RecordInstance, type RecordInstanceJson } from './NamedRecord';

export interface ClubRecordJson {
    Discipline: string
    Category: string
    Gender: string
    AthleticEvent: string
    Records: RecordInstanceJson[]
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
        this.searchableString = `${discipline.name.toLowerCase()} ${category.pluralName.toLowerCase()} ${gender.adultSingularName.toLowerCase()} ${athleticEvent.name.toLowerCase()} ${records.map((e) => e.searchAbleString.toLowerCase())}`
    }

    hasPreviousRecords() {
        return this.records.length > 1;
    }

    static fromJSON(json: ClubRecordJson): ClubRecord {
        return new ClubRecord(
            Discipline.match( json.Discipline),
            Category.match(json.Category),
            Gender.match(json.Gender),
            AthleticEvent.match(json.AthleticEvent),
            json.Records.map(RecordInstance.fromJSON)
        );
    }

    // toJSON(): ClubRecordJson {
    //     return {
    //         Discipline: this.discipline,
    //         Category: this.category,
    //         Gender: this.gender,
    //         AthleticEvent: this.athleticEvent,
    //         Records: this.records.map((e) => e.toJSON())
    //     } as ClubRecordJson;
    // }
}
