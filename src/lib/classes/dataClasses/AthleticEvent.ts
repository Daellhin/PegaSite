export class AthleticEvent {
    public static Indoor = new AthleticEvent("Indoor")
    public static Outdoor = new AthleticEvent("Outdoor")

    public static AthleticEvents = [this.Indoor, this.Outdoor]

    public name: string

    constructor(name: string) {
        this.name = name
    }

    static match(athleticEvent: string) {
        const result = this.AthleticEvents.find((e) =>
            e.name.toLowerCase() === athleticEvent.toLowerCase()
        )

        if (!result)
            throw new Error(`AthleticEvent (${athleticEvent}) not found`)
        return result
    }
}