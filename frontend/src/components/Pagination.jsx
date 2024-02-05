import React, { useEffect, useState } from "react";

const DEFAULT_LIMIT = 5;

export default function Pagination({ total, limit, setQuery }) {
    const [pageLimit, setPageLimit] = useState(DEFAULT_LIMIT)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        setPageLimit(prevLimit => limit ?? prevLimit);
    }, [limit]);

    useEffect(() => {
        setTotalPages(Math.ceil(total / pageLimit));
    }, [pageLimit, total]);


    const handleSetPage = (step) => {
        const newPage = page + step
        setPage(newPage)
        setQuery({ skip: (newPage - 1) * pageLimit, limit: pageLimit });
    }

    const prev = () => {
        if(page === 1) {
            return;
        }

        handleSetPage(-1)
    }

    const next = () => {
        if(page === totalPages) {
            return;
        }

        handleSetPage(1)
    }

    return (
        <>
            {/* Pagination: Simple */}
            <div className="text-center dark:text-gray-100">
                {/* Visible on mobile */}
                <nav className="flex sm:hidden">
                    <button
                        onClick={prev}
                        disabled={page === 1}
                        className="inline-flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 font-semibold leading-6 text-gray-800 hover:z-1 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:z-1 focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:z-1 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
                    >
                        <svg
                            className="hi-mini hi-chevron-left -mx-1.5 inline-block size-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <div className="flex grow items-center justify-center px-2 sm:px-4">
            <span>
              Page <span className="font-semibold">{ page }</span> of
              <span className="font-semibold"> { totalPages }</span>
            </span>
                    </div>
                    <button
                        onClick={next}
                        disabled={page === totalPages}
                        className="inline-flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 font-semibold leading-6 text-gray-800 hover:z-1 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:z-1 focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:z-1 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
                    >
                        <svg
                            className="hi-mini hi-chevron-right -mx-1.5 inline-block size-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </nav>
                {/* END Visible on mobile */}

                {/* Visible on desktop */}
                <nav className="hidden sm:inline-flex">
                    <button
                        onClick={prev}
                        disabled={page === 1}
                        className="-mr-px inline-flex items-center justify-center space-x-2 rounded-l-lg border border-gray-200 bg-white px-4 py-2 font-semibold leading-6 text-gray-800 hover:z-1 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:z-1 focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:z-1 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
                    >
                        <svg
                            className="hi-mini hi-chevron-left -mx-1.5 inline-block size-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <button
                        className="-mr-px inline-flex items-center justify-center space-x-2 border border-gray-200 bg-white px-4 py-2 font-semibold leading-6 text-gray-800 hover:z-1 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:z-1 focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:z-1 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
                    >
                        { page }
                    </button>

                    <button
                        onClick={next}
                        disabled={page === totalPages}
                        className="inline-flex items-center justify-center space-x-2 rounded-r-lg border border-gray-200 bg-white px-4 py-2 font-semibold leading-6 text-gray-800 hover:z-1 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:z-1 focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:z-1 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
                    >
                        <svg
                            className="hi-mini hi-chevron-right -mx-1.5 inline-block size-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </nav>
                {/* END Visible on desktop */}
            </div>
            {/* END Pagination: Simple */}
        </>
    );
}
