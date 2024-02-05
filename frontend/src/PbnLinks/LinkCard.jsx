import React, { useEffect, useState } from "react";
import CreateLinkForm from "./CreateLinkForm";
import axios from "axios";

export default function LinkCard({ link, getPbnLinks }) {
    const [isEdit, setIsEdit] =useState(false)

    useEffect(() => {
    }, []);

    const deleteLink = async (id, url) => {
        if (window.confirm(`Are you sure you want to delete ${url}?`)) {
            try {
                const response = await fetch(`/api/links/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert(`Site ${url} deleted successfully`);
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

    const startEdit = () => {
      setIsEdit(true)
    }

    const endEdit = () => {
        setIsEdit(false)
    }

    const save = async (dto) => {
        const response = await axios.patch(`/api/links/update/${link.id}`, dto);
        if(response.status === 200) {
            getPbnLinks();
            endEdit()
        }
    }

    return (
        <div className="">

                {isEdit
                ? <CreateLinkForm url={link.url} text={link.text} endEdit={endEdit} save={save} />
                    : (
                        <div className="flex gap-10 items-center justify-between">
                            <div className="flex gap-4 items-center">
                             <span>
                                { link.url }
                            </span>
                                <span>
                                { link.text }
                             </span>
                            </div>

                            <div  className="flex gap-4	 items-center">
                                <button
                                    onClick={() => deleteLink(link.id, link.url)}
                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300 ease-in-out"
                                >
                                    <svg className="hi-solid hi-trash inline-block size-5" fill="currentColor" viewBox="0 0 20 20"
                                         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path fillRule="evenodd"
                                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </button>

                                <button
                                    onClick={startEdit}
                                    className="bg-fuchsia-500 text-white py-1 px-3 rounded hover:bg-fuchsia-700 transition duration-300 ease-in-out"
                                >
                                    <svg className="hi-solid hi-pencil inline-block size-5" fill="currentColor" viewBox="0 0 20 20"
                                         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path
                                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                }

            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        </div>
    );
}
