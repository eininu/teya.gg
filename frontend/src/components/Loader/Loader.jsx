import React from "react";
import './_loader.css';

export default function Loader({ isLoading }) {
    return (
        <div>
            {isLoading && (
                <div className="loader-overlay">
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
