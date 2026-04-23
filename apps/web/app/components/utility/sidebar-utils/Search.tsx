"use client"

import React, { useEffect, useRef } from 'react'
import { SearchCode } from 'lucide-react';

const Search = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    return (
        <div className="mb-3 relative">

            <SearchCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />

            <input
                type="text"
                ref={inputRef}
                placeholder="Search..."
                className="placeholder:text-sm  w-full px-3 py-2 pl-9  text-opacity-70 text-gray-300   border-1 border-dk_border rounded-md bg-lg_grey outline-none"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 
                  text-xs px-[7.5px] py-0.4 rounded-md bg-[rgb(50,49,54)] border-2 border-[rgb(50,49,54)]">
                /
            </div>
        </div>
    )
}

export default Search