import {Fragment, useEffect, useState} from "react";
import { Listbox, Transition } from "@headlessui/react";

export default function SelectMenu({ options, label, placeholder, value, handler }) {
    const [selected, setSelected] = useState(value);

    useEffect(() => {
        if (selected) {
            handler(selected.key)
        }
    }, [selected]);

    useEffect(() => {
        setSelected(value)
    }, [options]);

    return (
        <>
            {/* Select Menus: Simple */}
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative w-64">
                    {/* Select Menu Toggle */}
                    <div className="space-y-1">
                        {label && <Listbox.Label className="font-medium">{label}</Listbox.Label>}
                        <Listbox.Button className="group flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left leading-6 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-500">
                            <span className={`grow truncate ${!selected?.label ? 'text-gray-500 font-thin' : ''}`}>{selected?.label ?? placeholder}</span>
                            <svg
                                className="hi-mini hi-chevron-up-down inline-block size-5 flex-none opacity-40 transition group-hover:opacity-60 group-active:scale-90"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Listbox.Button>
                    </div>
                    {/* END Select Menu Toggle */}

                    {/* Select Menu */}
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Listbox.Options className="absolute inset-x-0 z-10 mt-2 max-h-60 origin-top overflow-y-auto rounded-lg bg-white py-2.5 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:shadow-gray-900 dark:ring-gray-700">
                            {options && options.map((option) => (
                                <Listbox.Option
                                    key={option.key}
                                    className={({ active, selected }) =>
                                        `group flex cursor-pointer items-center justify-between gap-2 border-y border-transparent px-3 text-sm focus:outline-none ${
                                            selected ? "font-semibold dark:font-medium" : null
                                        } ${
                                            selected || active
                                                ? "text-gray-950 dark:text-white"
                                                : "text-gray-600 dark:text-gray-300"
                                        } ${active ? "bg-blue-50 dark:bg-gray-700/75" : null}`
                                    }
                                    value={option}
                                >
                                    {({ selected }) => (
                                        <>
                                            <div className="grow truncate py-1.5 ">{option.label}</div>
                                            <div
                                                className={`pointer-events-none size-5 flex-none text-blue-600 dark:text-blue-500 ${
                                                    !selected ? "invisible" : null
                                                }`}
                                            >
                                                {selected ? (
                                                    <svg
                                                        className="hi-mini hi-check-circle inline-block size-5"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                ) : null}
                                            </div>
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                    {/* END Select Menu */}
                </div>
            </Listbox>
            {/* END Select Menus: Simple */}
        </>
    );
}
