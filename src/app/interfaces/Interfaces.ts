export interface UprightBassListing {
    title: string,
    link: string,
    image: string,
    price: number,
    currency: string,
    source: string,
    lastActivity: number,
    location: string,
    year?: number,
    maker?: string,
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