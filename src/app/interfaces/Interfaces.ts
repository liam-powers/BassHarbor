export interface UprightBassListing {
    title?: string,
    imgLink: string,
    listingLink?: string,
    location?: string,
    saleStatus?: string,
    price?: number,
    year?: number,
    maker?: string,
    source?: string,
    createdAt?: number,
}

export interface CommonFilters {
    priceRange?: number[],
    location?: string,
    yearsBetween?: number[],
    keywords?: string[],
}

export interface UprightBassFilters extends CommonFilters {
    carved: boolean,
    hybrid: boolean,
    plywood: boolean,
}

export interface BassGuitarFilters extends CommonFilters {
    jazzBass: boolean,
    precisionBass: boolean,
    active: boolean,
    passive: boolean,
    numstrings?: number,
}