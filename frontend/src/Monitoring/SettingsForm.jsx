import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TgSettingsForm() {
    const [showForm, setShowForm] = useState(false);

    const [token, setToken] = useState(null);
    const [chatId, setChaDd] = useState(null);

    useEffect(() => {
    }, []);

    const saveEdit = async () => {
        try {
            const { data } = await axios.post(`/api/telegram-settings/create-settings`, { token, chatId });
            setShowForm(false)
        } catch (error) {
            alert(`ERROR ${error}`);
        }

    }

    const handleShowForm = () => {
        setShowForm(!showForm)
    }

    return (
        <div className="w-1/2 p-5 flex flex-col gap-1">
            <button  className="w-fit py-1 px-2 rounded bg-red-400" onClick={handleShowForm} >
                {showForm ? 'Hide' : 'Show'}
            </button>

            {
                showForm && <>
                    <input
                        className="block w-full rounded-lg border border-gray-200 px-3 py-2 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                        type="text"
                        id="token"
                        name="token"
                        placeholder="Enter tg token"
                        onChange={(e) => setToken(e.target.value)}
                    />

                    <input
                        className="block w-full rounded-lg border border-gray-200 px-3 py-2 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                        type="text"
                        id="chatId"
                        name="chatId"
                        placeholder="Enter tg chatId"
                        onChange={(e) => setChaDd(e.target.value)}
                    />

                    <button  className="py-1 px-2 rounded bg-green-400" onClick={saveEdit} disabled={!token && !chatId}>
                        <i className="fas fa-check" style={{ color: '#fff' }} />
                    </button>
                </>
            }


        </div>
    );
}
