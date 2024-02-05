import React, { useEffect, useState } from "react";

export default function Search({ onSearch }) {

    useEffect(() => {
    }, []);



    return (
        <div className="space-y-1">
            <input
                type="text"
                id="search"
                name="search"
                placeholder="Search"
                className="block w-full rounded-lg border border-gray-200 px-3 py-2 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                onChange={(e) =>  onSearch({ value: e.target.value })}
            />
        </div>
    );
}
