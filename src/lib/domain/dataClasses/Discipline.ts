export class DisciplineType {
	// Source: https://www.wikiwand.com/nl/Atletiek
	public static Distance = new DisciplineType("Afstand")
	public static Hurdle = new DisciplineType("Horde")
	public static Relay = new DisciplineType("Estafette")
	public static Jump = new DisciplineType("Springen")
	public static Throw = new DisciplineType("Werpen")
	public static Camp = new DisciplineType("Meerkamp")

	public name: string

	constructor(name: string) {
		this.name = name
	}
}

/**
 * Legend
 * - D: distance
 * - H: hurdle
 * - S: steeple
 * - Rnx: relay, n = amount of runners
 * - Cnx: combined/camp events, n = amount of events
 */
export class Discipline {
	// Are ordered on specificity, from least specific (e.g. 60 is less specific than 60m or 60mh) (order is reversed during matching)
	// !!! Name property can not contain a dot(.), as this is seen as a firebase nested property
	public static D60 = new Discipline("60m", [], DisciplineType.Distance)
	public static D80 = new Discipline("80m", [], DisciplineType.Distance)
	public static D100 = new Discipline("100m", [], DisciplineType.Distance)
	public static D150 = new Discipline("150m", [], DisciplineType.Distance)
	public static D200 = new Discipline("200m", [], DisciplineType.Distance)
	public static D300 = new Discipline("300m", [], DisciplineType.Distance)
	public static D400 = new Discipline("400m", [], DisciplineType.Distance)
	public static D600 = new Discipline("600m", [], DisciplineType.Distance)
	public static D800 = new Discipline("800m", [], DisciplineType.Distance)
	public static D1000 = new Discipline("1K", ["1000m", "1.000m"], DisciplineType.Distance)
	public static D1500 = new Discipline("1,5K", ["1.5K", "1500m", "1.500m"], DisciplineType.Distance)
	public static D1Mile = new Discipline("1mijl", ["mijl"], DisciplineType.Distance)
	public static D2Mile = new Discipline("2mijl", [], DisciplineType.Distance)
	public static D2000 = new Discipline("2K", ["2000m", "2.000m"], DisciplineType.Distance)
	public static D3000 = new Discipline("3K", ["3000m", "3.000m"], DisciplineType.Distance)
	public static D4000 = new Discipline("4K", ["4000m", "4.000m"], DisciplineType.Distance)
	public static D5000 = new Discipline("5K", ["5000m", "5.000m"], DisciplineType.Distance)
	public static D10000 = new Discipline("10K", ["10000m", "10.000m"], DisciplineType.Distance)
	public static DMarathon = new Discipline("marathon", [], DisciplineType.Distance)
	public static H60 = new Discipline("60mh", ["60h"], DisciplineType.Hurdle)
	public static H80 = new Discipline("80mh", ["80h"], DisciplineType.Hurdle)
	public static H100 = new Discipline("100mh", ["100h"], DisciplineType.Hurdle)
	public static H110 = new Discipline("110mh", ["110h"], DisciplineType.Hurdle)
	public static H150 = new Discipline("150mh", ["150h"], DisciplineType.Hurdle)
	public static H400 = new Discipline("400mh", ["400h"], DisciplineType.Hurdle)
	public static S1500 = new Discipline("1Kst", ["1000mst", "1000st"], DisciplineType.Hurdle)
	public static S2000 = new Discipline("2Kst", ["2000mst", "2000st"], DisciplineType.Hurdle)
	public static S3000 = new Discipline("3Kst", ["3000mst", "3000st"], DisciplineType.Hurdle)
	public static R3x600 = new Discipline("3x600m", ["3x600"], DisciplineType.Relay)
	public static R4x60 = new Discipline("4x60m", ["4x60"], DisciplineType.Relay)
	public static R4x80 = new Discipline("4x80m", ["4x80"], DisciplineType.Relay)
	public static R4x100 = new Discipline("4x100m", ["4x100"], DisciplineType.Relay)
	public static R4x200 = new Discipline("4x200m", ["4x200"], DisciplineType.Relay)
	public static R4x400 = new Discipline("4x400m", ["4x400"], DisciplineType.Relay)
	public static R4x800 = new Discipline("4x800m", ["4x800"], DisciplineType.Relay)
	public static R4x1500 = new Discipline("4x1500m", ["4x1500", "4x1500m"], DisciplineType.Relay)
	public static RMedley = new Discipline("medley", ["zw.est."], DisciplineType.Relay)
	public static LongJump = new Discipline("ver", ["vs", "verspringen"], DisciplineType.Jump)
	public static TripleJump = new Discipline("hinkstap", ["hss", "hinkstapspringen"], DisciplineType.Jump)
	public static HighJump = new Discipline("hoog", ["hs", "hoogspringen"], DisciplineType.Jump)
	public static PoleVault = new Discipline("polsstok", ["polstok", "polsstokspringen"], DisciplineType.Jump)
	public static Javelin = new Discipline("speer", ["speerwerpen"], DisciplineType.Throw)
	public static Hockey = new Discipline("hockey", ["hockeybal"], DisciplineType.Throw)
	public static ShotPut = new Discipline("kogel", ["kogelstoten"], DisciplineType.Throw)
	public static Discus = new Discipline("discus", ["discuswerpen"], DisciplineType.Throw)
	public static Cx3 = new Discipline("3-kamp", ["3kamp", "driekamp"], DisciplineType.Camp)
	public static Cx4 = new Discipline("4-kamp", ["4kamp", "vierkamp"], DisciplineType.Camp)
	public static Cx5 = new Discipline("5-kamp", ["5kamp", "vijfkamp"], DisciplineType.Camp)
	public static Cx7 = new Discipline("7-kamp", ["7kamp", "zevenkamp"], DisciplineType.Camp)
	public static Cx8 = new Discipline("8-kamp", ["8kamp", "achtkamp"], DisciplineType.Camp)
	public static Cx9 = new Discipline("9-kamp", ["9kamp", "negenkamp"], DisciplineType.Camp)
	public static Cx10 = new Discipline("10-kamp", ["10kamp", "tienkamp"], DisciplineType.Camp)

	public static Disciplines = [this.D60, this.D80, this.D100, this.D150, this.D200, this.D300, this.D400, this.D600, this.D800, this.D1000, this.D1500, this.D1Mile, this.D2Mile, this.D2000, this.D3000, this.D4000, this.D5000, this.D10000, this.DMarathon, this.H60, this.H80, this.H100, this.H110, this.H150, this.H400, this.S1500, this.S2000, this.S3000, this.R3x600, this.R4x60, this.R4x80, this.R4x100, this.R4x200, this.R4x400, this.R4x800, this.R4x1500, this.RMedley, this.LongJump, this.TripleJump, this.HighJump, this.PoleVault, this.Javelin, this.Hockey, this.ShotPut, this.Discus, this.Cx3, this.Cx4, this.Cx5, this.Cx7, this.Cx8, this.Cx9, this.Cx10,]

	// Name and aliases must be without spaces(spaces are removed in input string when matching)
	public name: string
	public aliases: string[]
	public type: DisciplineType

	constructor(name: string, aliases: string[], type: DisciplineType) {
		this.name = name
		this.aliases = aliases
		this.type = type
	}

	getAllNames() {
		return [this.name, ...this.aliases]
	}

	toString() {
		return this.name
	}

	static match(discipline: string) {
		const result = this.Disciplines.slice().reverse().find((e) =>
			e.getAllNames()
				.find((f) => (discipline.replace(/ /g, "").toLowerCase() + "").includes(f.toLowerCase()))
		)

		if (!result)
			throw new Error(`Discipline (${discipline}) not found`)
		return result
	}
}