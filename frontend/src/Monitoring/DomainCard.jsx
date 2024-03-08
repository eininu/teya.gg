import React, { useEffect, useState } from "react";
import ExpiredDate from "../ExpiredDate/ExpiredDate";


export default function DomainCard({ domain, updateDomain,  selectedDomains, setSelectedDomains, deleteDomain, updateExpiredDate }) {
    const [isOpenCommentEdit, setIsOpenCommentEdit] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (selectedDomains.length === 0) {
            setIsChecked(false);
        }
    }, [selectedDomains]);

    const remove = () => {
        deleteDomain(domain)
    }

    const saveComment = () => {
        updateDomain(domain.id, { comment: newComment })
        setIsOpenCommentEdit(false)
        setNewComment('')
    }

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        const domainId = domain.id
        setIsChecked(isChecked);
        if (isChecked) {
            setSelectedDomains([...selectedDomains, domainId]);
        } else {
            setSelectedDomains(selectedDomains.filter(id => id !== domainId));
        }
    };

    const updateDate = () => {
        updateExpiredDate(domain.id)
    }

    return (
        <div className="p-4 flex flex-col gap-1">
            <div className="flex justify-between gap-4">
                <div  className="flex gap-2 items-center">
                <input
                    type="checkbox"
                    onChange={handleCheckboxChange}
                    checked={isChecked}
                    className="size-4 rounded border border-gray-200 text-blue-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:checked:border-transparent dark:checked:bg-blue-500 dark:focus:border-blue-500"
                />
                <span>
                    { domain.name }
                </span>
                    {!domain.comment &&
                        <i
                            className="fas fa-edit cursor-pointer"
                            style={{ color: '#63E6BE' }}
                            onClick={() => setIsOpenCommentEdit(true)}
                        />
                    }

                    {
                         domain.tags.map((tag, i) => (
                            <small key={tag.id} className="text-red-500 text-xs">[{ tag.name }]</small>
                        ))
                    }
                </div>

                <div className="flex gap-1 items-center">
                    <ExpiredDate expiredDate={domain.expiredAt}
                                 updateDate={(data) => updateDomain(domain.id, data)}
                    />

                    <button
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-300 ease-in-out"
                        onClick={remove}
                    >
                        <i
                            className="fas fa-trash cursor-pointer"
                        />
                    </button>

                    <button
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-700 transition duration-300 ease-in-out"
                        onClick={updateDate}
                    >
                        <i
                            className="fas fa-angle-double-up"
                        />
                    </button>
                </div>

            </div>
            <div className="text-xs flex gap-3 text-gray-500 font-thin items-center">
                {isOpenCommentEdit ? (
                    <>
                        <input
                            className="block w-full rounded-lg border border-gray-200 px-3 py-1 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                            type="text"
                            id="url"
                            name="url"
                            placeholder="Enter comment"
                            defaultValue={domain.comment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button className="py-1 px-2 rounded bg-green-400" onClick={() => saveComment()}>
                            <i className="fas fa-check" style={{ color: '#fff' }} />
                        </button>

                        <button className="py-1 px-2.5 rounded bg-red-400" onClick={() => setIsOpenCommentEdit(false)}>
                            <i className="fas fa-times" style={{ color: '#fff' }} />
                        </button>
                    </>
                ) : (
                    <>
                        {domain.comment && (
                            <>
                                <span>{domain.comment}</span>
                                <i
                                    className="fas fa-edit cursor-pointer"
                                    style={{ color: '#63E6BE' }}
                                    onClick={() => setIsOpenCommentEdit(true)}
                                />
                            </>
                        )}
                    </>
                )}

            </div>
        </div>

    );
}
