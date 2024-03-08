import { Fragment, useState, React } from "react";

import { Dialog, Transition } from "@headlessui/react";

export default function AddDomainsModal({ addDomains, tags }) {
    const [domains, setDomains] = useState('')
    const [tag, setTag] = useState(null)
    const [selectedTags, setSelectedTags] = useState([]);

    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    }

    const openModal = (e) => {
        e.stopPropagation()
        setIsOpen(true);
    }

    const submit = async () => {
        addDomains({ domains, tag: tag ? tag : selectedTags })
        setTag(null)
        setDomains('')
        closeModal()
    }

    const handleCheckboxChange = (key) => {
        const isSelected = selectedTags.includes(key);

        setSelectedTags((prevSelectedTags) =>
            isSelected
                ? prevSelectedTags.filter((selected) => selected !== key)
                : [...prevSelectedTags, key]
        );
    }

    return (
        <>
            {/* Modals: Default */}
            <div>
                {/* Placeholder */}
                {/* Modal Toggle Button */}
                <button
                    onClick={(e) => openModal(e)}
                    type="button"
                    className="inline-flex items-center justify-center space-x-2 rounded-lg border border-blue-700 bg-blue-700 px-3 py-2 text-sm font-semibold leading-5 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400 focus:ring-opacity-50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-90"
                >
                    <span>Add new domains</span>
                </button>
                {/* END Modal Toggle Button */}
                {/* END Placeholder */}

                {/* Modal Container */}
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-90" onClose={ closeModal}>
                        {/* Modal Backdrop */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" />
                        </Transition.Child>
                        {/* END Modal Backdrop */}

                        {/* Modal Dialog */}
                        <div className="fixed inset-0 overflow-y-auto p-4 lg:p-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 scale-125"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-100"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-125"
                            >
                                <Dialog.Panel className="mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:text-gray-100">
                                    <div className="flex items-center justify-between bg-gray-50 px-5 py-4 dark:bg-gray-700/50">
                                        <Dialog.Title as="h3" className="font-medium">
                                            Create link
                                        </Dialog.Title>

                                        <div className="-my-4">
                                            <button
                                                onClick={closeModal}
                                                type="button"
                                                className="inline-flex items-center justify-center space-x-2 rounded-lg border border-transparent px-3 py-2 text-sm font-semibold leading-5 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:border-gray-200 active:shadow-none dark:border-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
                                            >
                                                <svg
                                                    className="hi-solid hi-x -mx-1 inline-block size-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <form className="grow p-5 flex flex-col gap-2">
                                        <textarea
                                            id="domains"
                                            name="domains"
                                            rows={4}
                                            placeholder="Enter domains"
                                            className="block w-full rounded-lg border border-gray-200 px-3 py-2 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                                            defaultValue={""}
                                            onChange={(e) => setDomains(e.target.value)}
                                        />

                                        <input
                                            className="block w-full rounded-lg border border-gray-200 px-3 py-2 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                                            type="text"
                                            id="tag"
                                            name="tag"
                                            placeholder="Enter new tag"
                                            onChange={(e) => setTag(e.target.value)}
                                        />

                                        {tags.length > 0 && (
                                            <>
                                                <div>{"OR SELECT"}</div>

                                                <div className="flex gap-3 flex-wrap">
                                                    {
                                                        tags.map((t) => (
                                                            <div key={t.key} className="flex gap-2 items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={() => handleCheckboxChange(t.key)}
                                                                    className="size-4 rounded border border-gray-200 text-blue-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:checked:border-transparent dark:checked:bg-blue-500 dark:focus:border-blue-500"
                                                                />
                                                                <span >{t.label}</span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>

                                                {/*<SelectMenu options={tags} placeholder={'select tag'} handler={setTag}/>*/}
                                            </>
                                        )}
                                    </form>

                                    <div className="space-x-2 bg-gray-50 px-5 py-4 text-right dark:bg-gray-700/50">
                                        <button
                                            onClick={ closeModal}
                                            type="button"
                                            className="inline-flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={ submit }
                                            disabled={!domains}
                                            type="button"
                                            className="inline-flex items-center justify-center space-x-2 rounded-lg border border-blue-700 bg-blue-700 px-3 py-2 text-sm font-semibold leading-5 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400 focus:ring-opacity-50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-90"
                                        >
                                            Submit
                                        </button>
                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                        {/* END Modal Dialog */}
                    </Dialog>
                </Transition>
                {/* END Modal Container */}
            </div>
            {/* END Modals: Default */}
        </>
    );
}
