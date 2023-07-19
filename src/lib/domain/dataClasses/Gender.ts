export class Gender {
    public static Female = new Gender("Vrouw", "Vrouwen", "Meisje", "Meisjes", ["Dame", "Dames"])
    public static Male = new Gender("Man", "Mannen", "Jongen", "Jongens", ["Heer", "Heren"])

    public static Genders = [this.Female, this.Male]

    public adultSingularName: string
    public adultPluralName: string
    public childSingularName: string
    public childPluralName: string
    public aliases: string[]

    constructor(adultSingularName: string, adultPluralName: string, childSingularName: string, childPluralName: string, aliases: string[]) {
        this.adultSingularName = adultSingularName
        this.adultPluralName = adultPluralName
        this.childSingularName = childSingularName
        this.childPluralName = childPluralName
        this.aliases = aliases
    }

    getAllNames() {
        return [this.adultSingularName,this.adultPluralName, this.childSingularName, this.childPluralName, ...this.aliases]
    }

    get keyName() {
        return this.adultSingularName.toLowerCase()
    }

    static match(gender: string) {
        const result = this.Genders.find((e) =>
            e.getAllNames().map(f =>
                f.toLowerCase()
            ).includes(gender.toLowerCase())
        )

        if (!result)
            throw new Error(`Gender (${gender}) not found`)
        return result
    }
}