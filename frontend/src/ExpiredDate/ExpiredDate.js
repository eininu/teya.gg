import { differenceInDays, format, parse } from "date-fns";
import React, { useState } from "react";

export default function ExpiredDate({expiredDate, updateDate}) {
    const [isEditable, setIsEditable] = useState(false)
    const [newDate, setNewDate] = useState('');
    const [hasError, setHasError] = useState(false)

    const getDifferenceDays = (date) => {
        return differenceInDays(
            new Date(date),
            new Date()
        )
    }

    const getFormattedDate = (date) => {
        return format(new Date(date), 'MM.dd.yyyy')
    }

    const openEditable = () => {
        setIsEditable(true)
    }

    const closeEditable = () => {
        setIsEditable(false)
        setNewDate('')
    }

    const handleSetNewDate = (e) => {
        const { value } = e.target
        const isValidFormat = /^\d{2}\.\d{2}\.\d{4}$/.test(value);
        setHasError(!isValidFormat)

        setNewDate(value)
    }

    const saveEditable = () => {
        if (hasError) {
            return;
        }

        updateDate({ expiredAt: parse(newDate, 'dd.MM.yyyy', new Date()) })
        closeEditable()
    }

    return (
        <div >
            {isEditable ? (
                <div className="flex gap-2 items-start">
                    <div className="flex flex-col">
                        <input
                            type="text"
                            value={newDate}
                            onChange={handleSetNewDate}
                            placeholder="DD.MM.YYYY"
                            className={`py-1 px-3 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded mr-2`}
                        />
                        {hasError && <small className="text-red-500">Please enter in DD.MM.YYYY format.</small>}

                    </div>


                    <div className="flex gap-2">
                        <button  className="py-1 px-2 rounded bg-green-400"  onClick={saveEditable}>
                            <i className="fas fa-check" style={{ color: '#fff' }} />
                        </button>

                        <button  className="py-1 px-2.5 rounded bg-red-400"  onClick={closeEditable}>
                            <i className="fas fa-times" style={{ color: '#fff' }} />
                        </button>
                    </div>

                </div>
            ) : (
                <div className="flex gap-2 items-center">
                  <span>
                    {expiredDate !== null
                        ? (<span> { getDifferenceDays(expiredDate) } days ({ getFormattedDate(expiredDate)} )</span> )
                        : 'Empty'}
                  </span>
                    <button  onClick={openEditable}>
                        <i className="fas fa-edit" style={{ color: '#63E6BE' }} />
                    </button>
                </div>
            )}

        </div>
    );
}
