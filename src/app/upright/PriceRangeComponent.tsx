"use client";
import React from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { UprightBassFilters } from '../interfaces/Interfaces';

interface PriceRangeComponentProps {
    filters: UprightBassFilters;
    setFilters: React.Dispatch<React.SetStateAction<UprightBassFilters>>;
};

export default function PriceRangeComponent({ filters, setFilters }: PriceRangeComponentProps) {
    const [priceRange, setPriceRange] = React.useState([0, 100000]);

    const handleChange = (newPriceRange: number[]) => {
        setPriceRange(newPriceRange);
        const updatedFilters = { ...filters, priceRange: newPriceRange };
        setFilters(updatedFilters);
        console.log(updatedFilters);
    };

    const styles = {
        track: { backgroundColor: '#FD5353' },
        handle: { borderColor: '#a63737' },
        rail: { backgroundColor: '#FFFFFF' },
        mark: { color: '#4caf50' },
    };

    return (
        <div>
            <div className="pb-10">
                <Slider range
                    min={0}
                    max={100000}
                    marks={{ 0: "$0", 100000: "$100,000+" }}
                    value={priceRange}
                    onChange={(newPriceRange: number | number[]) => handleChange(newPriceRange as number[])}
                    onChangeComplete={(newPriceRange: number | number[]) => setTimeout(handleChange, 1500, (newPriceRange as number[]))}
                    allowCross={false}
                    step={50}
                    styles={styles}
                />
            </div>
            <div className="">
                ${priceRange[0]} - ${priceRange[1]}
            </div>

        </div>
    );
};