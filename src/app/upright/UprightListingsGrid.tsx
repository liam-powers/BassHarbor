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
            {listings.map((listing, index) => (
                <div key={index}>
                    {listing?.imgLink?.toString() ? <Image
                        src={listing?.imgLink?.toString()}
                        width={500}
                        height={500}
                        alt={`Picture of listing ${listing.title}`}
                    /> : null}
                    <a
                        className="text-pastel-red underline"
                        href={listing.listingLink}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {listing.title}
                    </a>
                    {/* TODO: Unscuff this */}
                    <div>
                        {listing.source === "talkbass" ? (
                            <span>
                                <span className="font-extrabold">Price:</span> ${listing.price}
                            </span>
                        ) : listing.source === "basschat" ? (
                            <span>
                                <span className="font-extrabold">Price:</span> £{listing.price}
                            </span>
                        ) : (
                            <span>
                                <span className="font-extrabold">Price:</span> {listing.price}
                            </span>
                        )}
                    </div>
                    {listing.location ? (
                        <div>
                            <span className="font-extrabold">Location:</span>{" "}
                            {listing.location}
                        </div>
                    ) : null}
                    {listing.year ? (
                        <div>
                            <span className="font-extrabold">Year:</span> {listing.year}
                        </div>
                    ) : null}
                    <div>
                        {" "}
                        <span className="font-extrabold">{listing.saleStatus}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};