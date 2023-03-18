export class Category {
    // source: https://www.atletiek.be/jeugd/kids-aanbod/hoe-zien-wedstrijden-eruit
    public static Benjamins = new Category("Benjamin", "Benjamins", [], 8, 9)
    public static Pupillen = new Category("Pupil", "Pupillen", [], 10, 11)
    public static Miniemen = new Category("Miniem", "Miniemen", [], 12, 13)
    public static Cadetten = new Category("Cadet", "Cadetten", [], 14, 15)
    public static Scholieren = new Category("Scholier", "Scholieren", [], 16, 17)
    public static Juniors = new Category("Junior", "Junioren", ["Juniors", "Juniores"], 16, 17)
    public static Senioren = new Category("Senior", "Senioren", ["Seniors"], 18, 34)
    public static Masters35 = new Category("Master 35", "Masters 35", [], 35, 39)
    public static Masters40 = new Category("Master 40", "Masters 40", [], 40, 44)
    public static Masters45 = new Category("Master 45", "Masters 45", [], 45, 49)
    public static Masters50 = new Category("Master 50", "Masters 50", [], 50, 54)
    public static Masters55 = new Category("Master 55", "Masters 55", [], 55, 59)
    public static Masters60 = new Category("Master 60", "Masters 60", [], 60, 64)
    public static Masters65 = new Category("Master 65", "Masters 65", [], 65, 69)
    public static AlleCat = new Category("Alle categorie", "Alle categoriën", [], -1, -1)

    public static Categories = [this.Benjamins, this.Pupillen, this.Miniemen, this.Cadetten, this.Scholieren, this.Juniors, this.Senioren, this.Masters35, this.Masters40, this.Masters45, this.Masters50, this.Masters55, this.Masters60, this.Masters65, this.AlleCat]

    public singularName: string
    public pluralName: string
    public aliases: string[]
    public minAge: number
    public maxAge: number

    constructor(name: string, pluralName: string, aliases: string[], minAge: number, maxAge: number) {
        this.singularName = name
        this.pluralName = pluralName
        this.aliases = aliases
        this.minAge = minAge
        this.maxAge = maxAge
    }

    getAllNames() {
        return [this.singularName, this.pluralName, ...this.aliases]
    }

    static match(category: string) {
        const result = this.Categories.find((e) =>
            e.getAllNames().map(f =>
                f.toLowerCase()
            ).includes(category.toLowerCase())
        )

        if (!result)
            throw new Error(`Category (${category}) not found`)
        return result
    }
}
