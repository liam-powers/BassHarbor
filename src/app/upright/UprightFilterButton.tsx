"use client";
import React, { useState, useEffect } from 'react';
import { UprightBassFilters } from '../interfaces/Interfaces';

interface FilterButtonProps {
    filterToToggle: keyof UprightBassFilters;
    filters: UprightBassFilters;
    toggleFilter: (filterToToggle: keyof UprightBassFilters) => void;
    children: React.ReactNode;
}

export default function UprightFilterButton({ filterToToggle, filters, toggleFilter, children }: FilterButtonProps) {
    const [buttonBgColor, setButtonBgColor] = useState("bg-pastel-red");
    const [buttonTextColor, setButtonTextColor] = useState("text-easy-black");

    const clickHandle = () => {
        toggleFilter(filterToToggle);
    };

    useEffect(() => {
        if (filters[filterToToggle]) {
            setButtonBgColor("bg-pastel-red");
            setButtonTextColor("text-[#FFFFFF]");
        } else {
            setButtonBgColor("bg-[#FFFFFF]");
            setButtonTextColor("text-easy-black");
        }
    }, [filters, filterToToggle]);

    return (
        <div>
            <button
                onClick={clickHandle}
                className={`hover:underline ${buttonBgColor} outline-black ${buttonTextColor} font-bold py-2 px-4 rounded-lg`}
            >
                {children}
            </button>
        </div>
    );
};