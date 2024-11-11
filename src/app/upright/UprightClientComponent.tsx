"use client";
import { useState, useEffect } from "react";
import { UprightBassFilters, UprightBassListing } from "../interfaces/Interfaces";
import UprightFilterButton from "./UprightFilterButton";
import PriceRangeComponent from "./PriceRangeComponent";
import UprightListingsGrid from "./UprightListingsGrid";
// import { ofetch } from "ofetch";
import dbFetchListings from "@/app/utils/dbFetchListings";
import "rc-slider/assets/index.css";

const updateListings = async (filters: UprightBassFilters): Promise<UprightBassListing[]> => {
    // const functionUrl = "https://fetchlistings-jgzal2tqsa-uc.a.run.app"; // production URL

    try {
        console.log("updateListings: received filters: ", filters);
        // const response = await ofetch(functionUrl, {
        //     method: "POST",
        //     body: {
        //         priceRange: filters.priceRange,
        //         keywords: filters.keywords,
        //         carved: filters.carved,
        //         hybrid: filters.hybrid,
        //         plywood: filters.plywood,
        //     }
        // });
        const response = await dbFetchListings(filters);
        if (!response) {
            throw new Error("fetchListings response is undefined!");
        }
        console.log("Fetch listings completed. ");
        console.log("Response: ", response);

        return response;
    } catch (error) {
        console.error("Error triggering scrape and add:", error);
        throw error;
    }
};

const renderKeywords = (
    keywords: string[],
    removeKeyword: (keyword: string) => void,
) => {
    return (
        <div className="flex gap-2 pt-4 flex-wrap" style={{ maxWidth: "300px" }}>
            {keywords.map((keyword) => (
                <button
                    key={keyword}
                    className="hover:line-through bg-pastel-red outline-black text-white font-bold py-2 px-4 rounded-lg"
                    onClick={() => removeKeyword(keyword)}
                >
                    {keyword}
                </button>
            ))}
        </div>
    );
};

export default function UprightClientComponent() {
    const [filters, setFilters] = useState<UprightBassFilters>({
        keywords: [],
        carved: false,
        hybrid: false,
        plywood: false,
    });

    const [listings, setListings] = useState<UprightBassListing[]>([]);

    useEffect(() => {
        const tryUpdateListings = async () => {
            try {
                const updatedListings = await updateListings(filters);
                console.log("Listings fetched: ", updatedListings);
                setListings(updatedListings);
            } catch (error) {
                console.error("Error fetching listings:", error);
            }
        };

        tryUpdateListings();
    }, [filters]);

    const toggleFilter = (filterToToggle: keyof UprightBassFilters) => {
        const updatedFilters = {
            ...filters,
            [filterToToggle]: !filters[filterToToggle],
        };
        setFilters(updatedFilters);
        console.log("Successfully updated filters to: ", updatedFilters);
    };

    const removeKeyword = (keyword: string) => {
        const updatedFilters = {
            ...filters,
            keywords: filters.keywords?.filter((kw) => kw !== keyword),
        };
        setFilters(updatedFilters);
        console.log("Successfully updated filters to: ", updatedFilters);
    };

    const [keyword, setKeyword] = useState("");

    const handleKeywordAdd = (keyword: string) => {
        if (keyword.trim() !== "") {
            // Check if the keyword is not empty
            const updatedFilters = {
                ...filters,
                keywords: filters.keywords
                    ? [...filters.keywords, keyword.trim()]
                    : [keyword.trim()],
            };
            setFilters(updatedFilters);
            setKeyword(""); // Clear keyword input after adding
            console.log("Successfully updated filters to: ", updatedFilters);
        }
    };

    if (!filters) {
        return <div>Loading...</div>;
    }

    return (
        <div className="pt-20">
            <div className="flex flex-row w-full pl-20 pr-40 gap-40 justify-between">
                <div className="sticky top-0 h-full flex flex-row pt-">
                    <div className="min-w-[20rem]">
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold pb-6">filters</div>
                            <div className="flex flex-col gap-8">
                                <div>
                                    <div className="text-2xl font-bold pb-2">wood type:</div>
                                    <div className="flex flex-row flex-wrap gap-2">
                                        <UprightFilterButton
                                            filterToToggle="carved"
                                            filters={filters}
                                            toggleFilter={toggleFilter}
                                        >
                                            carved
                                        </UprightFilterButton>
                                        <UprightFilterButton
                                            filterToToggle="hybrid"
                                            filters={filters}
                                            toggleFilter={toggleFilter}
                                        >
                                            hybrid
                                        </UprightFilterButton>
                                        <UprightFilterButton
                                            filterToToggle="plywood"
                                            filters={filters}
                                            toggleFilter={toggleFilter}
                                        >
                                            plywood
                                        </UprightFilterButton>
                                    </div>
                                </div>
                                <div>
                                    <div></div>
                                    <div>
                                        <div className="text-2xl font-bold pb-2">keywords:</div>
                                        <div className="flex flex-row items-center gap-6 text-2xl font-bold">
                                            <input
                                                className="text-black"
                                                placeholder="enter keyword here"
                                                onChange={(e) => setKeyword(e.target.value)}
                                                value={keyword}
                                            />
                                            <button onClick={() => handleKeywordAdd(keyword)}>
                                                +
                                            </button>
                                        </div>
                                        {renderKeywords(filters.keywords ?? [], removeKeyword)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold pb-2">price range:</div>
                                    <PriceRangeComponent
                                        filters={filters}
                                        setFilters={setFilters}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pb-40 pr-20">
                    <div className="text-3xl font-bold pb-6">
                        your matches ({listings.length}):
                    </div>
                    <UprightListingsGrid listings={listings} />
                </div>
            </div>
        </div>
    );
};
