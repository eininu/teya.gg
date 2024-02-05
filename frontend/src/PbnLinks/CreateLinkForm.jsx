import React, { useEffect, useState } from "react";

export default function CreateLinkForm({ pbnLinkId, url, text, endEdit, save }) {
    const [newUrl, setNewUrl] = useState(url);
    const [newText, setNewText] = useState(text);

    useEffect(() => {
    }, []);

    const saveEdit = () => {
        if(!newUrl || !newText) {
            return;
        }
        save({ url: newUrl, text: newText})
    }

    return (
        <div className="grow p-5 flex flex-col gap-1">
            <input
                className="block w-full rounded-lg border border-gray-200 px-3 py-2 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                type="text"
                id="url"
                name="url"
                placeholder="Enter website url"
                defaultValue={url}
                onChange={(e) => setNewUrl(e.target.value)}
            />

            <textarea
                id="text"
                name="text"
                rows={4}
                placeholder="Enter text"
                className="block w-full rounded-lg border border-gray-200 px-3 py-2 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                defaultValue={text}
                onChange={(e) => setNewText(e.target.value)}
            />

            <div className="flex gap-2" onClick={saveEdit}>
                <button  className="py-1 px-2 rounded bg-green-400" >
                    <i className="fas fa-check" style={{ color: '#fff' }} />
                </button>

                <button  className="py-1 px-2.5 rounded bg-red-400" onClick={endEdit}>
                    <i className="fas fa-times" style={{ color: '#fff' }} />
                </button>
            </div>

        </div>
    );
}
