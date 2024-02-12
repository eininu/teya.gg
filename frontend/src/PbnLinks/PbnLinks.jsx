import React, { useEffect, useState } from "react";
import axios from "axios";
import PbnLinkCard from "./PbnLinkCard";
import Search from "../components/Search";
import Pagination from "../components/Pagination";
import { saveAs } from "file-saver";

const DEFAULT_LIMIT = 30;

export default function PbnLinks() {
  const [pbnLinks, setPbnLinks] = useState([]);
  const [totalPbnLinks, setTotalPbnLinks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [newWebsite, setNewWebsite] = useState("");
  const [linksQuery, setLinksQuery] = useState({
    limit: DEFAULT_LIMIT,
    skip: 0,
  });
  const [isImportJson, setIsImportJson] = useState(false);
  const [newPbnLinks, setNewPbnLinks] = useState("");

  useEffect(() => {
    getPbnLinks();
  }, [linksQuery]);

  const getPbnLinks = async () => {
    const { data } = await axios.get("/api/pbn-links/get-all", {
      params: linksQuery,
    });
    setPbnLinks(data.data);
    setTotalPbnLinks(data.total);
  };

  const addPbnWebsite = async () => {
    if (isLoading || !newWebsite) {
      return;
    }

    setIsLoading(true);
    const { data } = await axios.post("/api/pbn-links/add-new-website", {
      website: newWebsite,
    });
    setIsLoading(false);
    setNewWebsite("");

    if (!data) {
      return;
    }

    getPbnLinks();
  };

  const setQuery = (query) => {
    setLinksQuery({ ...linksQuery, ...query });
  };

  const exportJSON = async () => {
    const { data } = await axios.get("/api/pbn-links/get-all");
    if (!data) {
      return;
    }

    const websitesWithoutIds = data.data.map((website) => {
      const { id, ...restWebsite } = website;

      if (restWebsite.links && restWebsite.links.length > 0) {
        restWebsite.links = restWebsite.links.map((link) => {
          const { id: linkId, ...linkRest } = link;
          return linkRest;
        });
      }

      return restWebsite;
    });

    const parsedData = JSON.stringify(websitesWithoutIds, null, 2);
    const blob = new Blob([parsedData], { type: "application/json" });
    saveAs(blob, "pbnLinks.txt");
  };

  const importJSON = async () => {
    if (isImportJson) {
      try {
        const parsed = JSON.parse(newPbnLinks);
        const response = await axios.post("/api/pbn-links/import-json", parsed);
        if (response) {
          getPbnLinks();
          setIsImportJson(false);
        }
      } catch (error) {
        alert(`JSON parsing error: ${error.message}`);
      }
    } else {
      setIsImportJson(true);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {isImportJson ? (
          <textarea
            id="text"
            name="text"
            rows={4}
            placeholder="Enter JSON"
            className="block w-full rounded-lg border border-gray-200 px-3 py-2 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
            defaultValue={""}
            onChange={(e) => setNewPbnLinks(e.target.value)}
          />
        ) : (
          <button
            onClick={exportJSON}
            type="button"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Export JSON
          </button>
        )}
        <button
          onClick={importJSON}
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Import JSON
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8 justify-between">
        <form className="flex items-center gap-4">
          <input
            type="text"
            value={newWebsite}
            onChange={(e) => setNewWebsite(e.target.value)}
            placeholder="Enter your website domain name"
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
            disabled={isLoading || !newWebsite}
            onClick={addPbnWebsite}
          >
            Add
          </button>
        </form>

        <Search onSearch={setQuery} />
      </div>

      <div className="flex flex-col gap-4">
        {pbnLinks.length > 0 &&
          pbnLinks.map((pbn) => (
            <PbnLinkCard key={pbn.id} pbn={pbn} getPbnLinks={getPbnLinks} />
          ))}
      </div>

      {totalPbnLinks > DEFAULT_LIMIT && (
        <Pagination
          total={totalPbnLinks}
          limit={linksQuery.limit}
          setQuery={setQuery}
        />
      )}
    </div>
  );
}
