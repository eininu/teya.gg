import { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";
import {HeaderIcons} from "./header.constant";

export default function HeaderLink({name, link}) {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <a
                href={`/${link}`}
                className={`${
                    isActive(`/${link}`)
                        ? "group flex items-center space-x-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 dark:border-transparent dark:bg-gray-700 dark:text-white"
                        : "group flex items-center space-x-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
                }`}
            >
                <svg
                    className={`${
                        isActive(`/${link}`)
                            ? "hi-mini hi-home inline-block size-5"
                            : "hi-mini hi-users inline-block size-5 opacity-25 group-hover:opacity-100"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <g dangerouslySetInnerHTML={{ __html: HeaderIcons[name] }} />
                </svg>

                <span>{ name }</span>
            </a>

        </>
    );
}

