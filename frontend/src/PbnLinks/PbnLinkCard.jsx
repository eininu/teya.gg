import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import CreateLinkModal from "./CreateLinkModal";
import LinkCard from "./LinkCard";

export default function PbnLinkCard({pbn, getPbnLinks}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpened, setIsOpened] = useState(false)

    useEffect(() => {
    }, []);

    const deleteWebsite = async (id, website) => {
        if (window.confirm(`Are you sure you want to delete ${website}?`)) {
            try {
                const response = await fetch(`/api/pbn-links/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert(`Site ${website} deleted successfully`);
                    getPbnLinks();
                } else {
                    alert("Error deleting site");
                }
            } catch (error) {
                alert("Error sending request to delete the site");
                console.error(error);
            }
        }
    };

    const toggleCard = (e) => {
        const clickedElement = e.target;

        const isClickInsideCard = clickedElement.classList.contains('card-header') || clickedElement.closest('.card-header') !== null;
        if (isClickInsideCard) {
            setIsOpened(!isOpened)
        }
    }


    return (
        <>
            <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:text-gray-100">
                {/* Card Header */}
                <div onClick={(e) => toggleCard(e)} className="card-header space-y-3 bg-gray-50 px-5 py-4 text-center dark:bg-gray-700/50 sm:flex sm:items-center sm:justify-between sm:space-y-0 sm:text-left">
                    <div>
                        <h3 className="mb-1 font-semibold">{ pbn.website }</h3>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            You have {pbn.links?.length ?? 0 } links
                        </h4>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => deleteWebsite(pbn.id, pbn.website)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300 ease-in-out"
                        >
                           Delete
                        </button>

                        <CreateLinkModal pbnLinkId={pbn.id} getPbnLinks={getPbnLinks}/>
                    </div>
                </div>
                {/* END Card Header */}

                {/* Card Body */}
                {isOpened && (
                    <div className="p-5 flex flex-col gap-2">
                        { pbn.links.length !== 0
                            ? pbn.links.map((link) => <LinkCard key={link.id} link={link} getPbnLinks={getPbnLinks}/>)
                            : "Empty" }
                    </div>
                )}
                {/* Card Body */}
            </div>
            {/* END Card Headings: Title with Subtitle and Action */}
        </>
    );
}
