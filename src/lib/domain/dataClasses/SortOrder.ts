export class SortOrder {
    public static None = new SortOrder("none")
    public static Asc = new SortOrder("asc")
    public static Desc = new SortOrder("desc")

    constructor(
        public direction: "none" | "asc" | "desc",
    ) { }

    get none() {
        return this.direction === "none"
    }
    get asc() {
        return this.direction === "asc"
    }
    get desc() {
        return this.direction === "desc"
    }

    next() {
        switch (this.direction) {
            case "none":
                return SortOrder.Asc
            case "asc":
                return SortOrder.Desc
            case "desc":
                return SortOrder.None
        }
    }
    showUpArrow() {
        return this.direction === "asc" || this.direction === "none"
    }
    showDownArrow() {
        return this.direction === "desc" || this.direction === "none"
    }
    toString() {
        return this.direction
    }
}