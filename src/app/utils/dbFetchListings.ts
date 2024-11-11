'use client';
import { UprightBassFilters } from "@/app/interfaces/Interfaces";
import { getDB } from '@/app/db';
import { UprightBassListing } from '../interfaces/Interfaces';

export default async function dbFetchListings(filters: UprightBassFilters) {
    try {
        const { priceRange, keywords, location, yearsBetween, carved, hybrid, plywood } = filters;

        const db = getDB();
        if (!db) {
            return;
        }

        // Build our query.
        // priceRange: upright.price must be greater than or equal to priceRange[0] and less than or equal to priceRange[1].
        // keywords: upright.title must contain at least one of keywords
        // location: upright.location must contain location
        // yearsBetween: upright.year must be >= yearsBetween[0] and <= yearsBetween[1]
        // carved, hybrid, plywood: if any are true, must have a match in at least one for upright.carved, upright.hybrid, and upright.plywood
        // all filters are optional!

        const query = { upright: {} }
        const { data } = await db.queryOnce(query);

        const filteredData: UprightBassListing[] = data.upright.filter((listing) => {
            if (priceRange && listing.price && !(priceRange[0] <= listing.price && listing.price <= priceRange[1])) {
                console.log("filtering out on priceRange")
                return false;
            }

            if (keywords && listing.title && (keywords.length > 0) && !(keywords.some(keyword => listing.title?.toLowerCase().includes(keyword.toLowerCase())))) {
                console.log("filtering out on keywords")
                return false;
            }

            if (location && !(location === listing.location)) {
                console.log("filtering out on location")
                return false;
            }

            if (yearsBetween && listing.year && !(yearsBetween[0] <= listing.year && listing.year <= yearsBetween[1])) {
                console.log("filtering out on year")
                return false;
            }

            if ((carved || hybrid || plywood) && !
                ((carved && listing.title?.includes("carved")) ||
                    (hybrid && listing.title?.includes("hybrid")) ||
                    (plywood && listing.title?.includes("plywood")))) {
                console.log("filtering out on carved/hybrid/plywood");
                return false;
            }

            return true;
        });

        console.log("End of fetchListings() function!");
        console.log("data: ", filteredData);
        return filteredData;
    } catch (error) {
        console.error("Error fetching upright bass listings:", error);
    }
}