import React, { useEffect, useState } from "react";

export default function Websites() {
  const [websites, setWebsites] = useState([]);
  const [newDomainName, setNewDomainName] = useState("");

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = () => {
    fetch("/api/websites")
      .then((response) => response.json())
      .then((data) => setWebsites(data))
      .catch((error) => console.error("Error while receiving data:", error));
  };

  const deleteWebsite = (id) => {
    fetch(`/api/websites/${id}`, { method: "DELETE" })
      .then(() => {
        setWebsites(websites.filter((website) => website.id !== id));
      })
      .catch((error) => console.error("Error while deleting:", error));
  };

  const addWebsite = (e) => {
    e.preventDefault();
    fetch("/api/websites/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainName: newDomainName }),
    })
      .then(() => {
        setNewDomainName("");
        fetchWebsites(); // Reload the list of sites after adding
      })
      .catch((error) => console.error("Error while adding website:", error));
  };

  return (
    <div className="p-4">
      {websites.length === 0 && (
        <div className="text-gray-600">No websites found.</div>
      )}
      {websites.length > 0 &&
        websites.map((website) => (
          <div
            key={website.id}
            className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded"
          >
            {website.isDomainRoskomnadzorBanned ? (
              <s className="text-red-500">{website.domainName}</s>
            ) : (
              <span>{website.domainName}</span>
            )}
            <button
              onClick={() => deleteWebsite(website.id)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300 ease-in-out"
            >
              Delete
            </button>
          </div>
        ))}
      <form onSubmit={addWebsite} className="mt-4">
        <input
          type="text"
          value={newDomainName}
          onChange={(e) => setNewDomainName(e.target.value)}
          placeholder="Enter your domain name"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Add
        </button>
      </form>
    </div>
  );
}
