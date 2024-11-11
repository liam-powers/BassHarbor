"use client";
import React from 'react';

interface ButtonProps {
    link: string;
    children: React.ReactNode;
}

export default function Button({ link, children }: ButtonProps) {
    const handleClick = () => {
        window.location.href = link;
    };

    return (
        <button
            onClick={handleClick}
            className={`hover:underline font-body bg-[#FD5353] text-easy-black font-bold py-4 px-8 rounded-[40px]`}
        >
            {children}
        </button>
    );
}