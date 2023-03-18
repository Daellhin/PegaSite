export interface RecordInstanceJson {
    Name: string
    Result: string
    Location: string
    Date: string
}

export class RecordInstance {
    public searchAbleString: string

    constructor(
        public name: string,
        public result: string,
        public location: string,
        public date: string
    ) {
        this.searchAbleString = `${name.toLowerCase()} ${result.toLowerCase()} ${location.toLowerCase()} ${date.toLowerCase()}`
     }

    static fromJSON(json: RecordInstanceJson): RecordInstance {
        return new RecordInstance(
            json.Name,
            json.Result,
            json.Location,
            json.Date
        );
    }

    // toJSON(): RecordInstanceJson {
    //     return {
    //         Name: this.name,
    //         Result: this.result,
    //         Location: this.location,
    //         Date: this.date
    //     } as RecordInstanceJson;
    // }
}
