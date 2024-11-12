"use client";
import React from "react";
import Image from "next/image";
import { UprightBassListing } from "../interfaces/Interfaces";

interface UprightListingsProps {
    listings: UprightBassListing[];
}

export default function UprightListingsGrid({ listings }: UprightListingsProps) {
    return (
        <div className="grid grid-cols-4 gap-10">
            {listings.map((listing, index) => {
                const lastActivityDate = new Date(listing.lastActivity);
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const formattedLastActivity = monthNames[lastActivityDate.getMonth()] + " " + lastActivityDate.getDate() + ", " + lastActivityDate.getFullYear();
                return (
                    <div key={index}>
                        {listing.image.toString() ?
                            <Image
                                src={listing.image.toString()}
                                width={400}
                                height={400}
                                alt={`Picture of listing ${listing.title}`}
                                className="w-full h-[300px] object-cover"
                            /> : null}
                        <a
                            className="text-pastel-red underline"
                            href={listing.link}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {listing.title}
                        </a>
                        <div>
                            <span className="font-extrabold">Price:</span> {listing.currency}{listing.price}
                        </div>
                        <div>
                            <span className="font-extrabold">Location:</span>{" "}
                            {listing.location}
                        </div>
                        {listing.year ? (
                            <div>
                                <span className="font-extrabold">Year:</span> {listing.year}
                            </div>
                        ) : null}
                        <div>
                            <span className="font-extrabold">Last Active</span>: {formattedLastActivity}
                        </div>
                        <div>
                            <span className="font-extrabold">Source</span>: {listing.source}
                        </div>

                    </div>
                )
            })}
        </div>
    );
};