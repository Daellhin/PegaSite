export enum Category {
    "Belangrijk",
    "Eigen organisaties",
    "Wedstrijden",
    "Indoor",
    "Outdoor",
}

export const CategoryValues = Object.keys(Category).filter((v) => isNaN(Number(v)));