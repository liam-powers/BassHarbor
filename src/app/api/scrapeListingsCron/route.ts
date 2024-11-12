import { NextResponse } from 'next/server';
import { UprightBassListing } from "@/app/interfaces/Interfaces";
import { tx } from '@instantdb/admin';
import scrapeData from "@/server/webscrape";
import { getAdminDB } from "../../db";
import { v5 } from 'uuid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    async function addNewListings(listings: UprightBassListing[]) {
        console.log("inside addListings");
        const db = getAdminDB();
        if (!db) {
            return;
        }

        try {
            let listingsAdded = 0;
            for (const listing of listings) {
                const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

                function generateUUIDFromLink(link: string): string {
                    return v5(link, NAMESPACE);
                }

                const newId = generateUUIDFromLink(listing.link);

                if (!newId) {
                    console.error("Failed to generate a valid document ID");
                    continue;
                }

                const transaction = tx.upright[newId].update({
                    ...listing,
                    createdAt: Date.now(),
                })

                db.transact([
                    transaction
                ]);
                listingsAdded++;
            }

            console.log(`Successfully added or updated ${listingsAdded} listings`);
        } catch (error) {
            console.error("Error adding listings: ", error);
        }
    }

    try {
        console.log("Now inside scrapeAndAdd function...");
        const scrapeObject = {
            scrapeTalkbassData: true,
            scrapeBasschatData: true,
        };

        const uprightListings: UprightBassListing[] = await scrapeData(scrapeObject);
        console.log(`scrapeListingsCron received ${uprightListings.length} listings`);
        await addNewListings(uprightListings);

        return NextResponse.json({
            status: 200,
            message: "Successfully added listings"
        });

    } catch (error) {
        console.error("Error in GET route:", error);
        return NextResponse.json({
            status: 400,
            error: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 400
        });
    }
}