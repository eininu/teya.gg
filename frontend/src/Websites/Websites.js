import React, { useEffect, useState } from "react";
import axios from 'axios';

import ExpiredDate from "../ExpiredDate/ExpiredDate";
import { convertedDomainNames } from "../helpers/common";

export default function Websites() {
  const [websites, setWebsites] = useState([]);
  const [websiteFile, setWebsiteFile] = useState(null);
  const [backupFile, setBackupFile] = useState(null);
  const [newWebsite, setNewWebsite] = useState("");
  const [websitesIsRebuilding, setWebsitesIsRebuilding] = useState(false);
  const [loadingBackupToMega, setLoadingBackupToMega] = useState(false);
  const [uploadingBackup, setUploadingBackup] = useState(false);
  const [isBannedDomainsChecking, setIsBannedDomainsChecking] = useState(false);
  const [loadingWebsites, setLoadingWebsites] = useState(false);

  // backup
  const [fileSizeError, setFileSizeError] = useState(false);
  const maxFileSize = 2 * 1024 * 1024 * 1024;
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = () => {
    setLoadingWebsites(true);
    fetch("/api/websites")
      .then((response) => response.json())
      .then((data) => {
        const parsedData = convertedDomainNames(data)

        setLoadingWebsites(false);
        setWebsites(parsedData);
      })
      .catch((error) => {
        console.error("Error while receiving data:", error);
        setLoadingWebsites(false);
      });
  };

  const addWebsite = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("siteName", newWebsite);
    if (websiteFile) {
      formData.append("file", websiteFile);
    }

    fetch("/api/websites/createSite", {
      method: "POST",
      body: formData,
    })
      .then(() => {
        setNewWebsite("");
        setWebsiteFile(null);
        fetchWebsites();
      })
      .catch((error) => console.error("Error while adding website:", error));
  };

  const deleteWebsite = async (id, domainName) => {
    if (window.confirm(`Are you sure you want to delete ${domainName}?`)) {
      try {
        const response = await fetch(`/api/websites/deleteSite/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert(`Site ${domainName} deleted successfully`);
          fetchWebsites();
        } else {
          alert("Error deleting site");
        }
      } catch (error) {
        alert("Error sending request to delete the site");
        console.error(error);
      }
    }
  };

  const runBpnRebuild = () => {
    setWebsitesIsRebuilding(true);
    fetch("/api/websites/triggerBuild")
      .catch((error) =>
        console.error("Error while running websites rebuild task:", error),
      )
      .finally(() => {
        setWebsitesIsRebuilding(false);
      });
  };

  const downloadBackup = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/api/websites/download";
    downloadLink.target = "_blank";
    downloadLink.click();
  };

  const uploadBackup = (e) => {
    e.preventDefault();
    setUploadingBackup(true);
    const formData = new FormData();
    if (backupFile) {
      formData.append("file", backupFile);
    }

    fetch("/api/websites/upload", {
      method: "POST",
      body: formData,
    })
      .then(() => {
        setNewWebsite("");
        setWebsiteFile(null);
        setUploadingBackup(false);
        fetchWebsites();
      })
      .catch((error) => {
        console.error("Error while adding website:", error);
        setUploadingBackup(false);
      });
  };

  const handleUploadBackup = async () => {
    setLoadingBackupToMega(true);

    fetch("/api/websites/mega-backup")
      .catch((error) =>
        console.error("Error while loading mega backup:", error),
      )
      .finally(() => {
        setLoadingBackupToMega(false);
      });
  };

  const startCheckingDomainBans = () => {
    setIsBannedDomainsChecking(true);
    fetch("/api/domain-ban-checker/start-checking")
      .then(() => {
        fetchWebsites(); // Reload the list of sites after adding
      })
      .catch((error) => console.error("Error while running cron task:", error))
      .finally(() => {
        setIsBannedDomainsChecking(false);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > maxFileSize) {
      setShowButton(false);
    } else {
      setShowButton(true);
      setBackupFile(file);
    }
  };


  const setExpiredDate = async (id) => {
    const { data } = await axios.patch(`/api/websites/update-date/${id}`);

    if(!data) {
      return;
    }

    updateWebsitesStata(data)
  }

  const updateAllExpiredDates = async () => {
    const { data } = await axios.patch('/api/websites/update-all-dates');
    const parsedData = convertedDomainNames(data)
    setWebsites(parsedData);
  }

  const updateWebsite = async (id, dto) => {
    const { data } = await axios.patch(`/api/websites/update/${id}`, dto);

    if(!data) {
      return;
    }

    updateWebsitesStata(data)
  }

  const updateWebsitesStata = (website) => {
    const updatedData = websites.map((w) => w.id === website.id ? website : w)
    const parsedData = convertedDomainNames(updatedData)
    setWebsites(parsedData);
  }

  return (
    <div className="p-4">
      <h2 className={"py-2 font-bold text-2xl"}>Websites</h2>
      {websites.length === 0 && !loadingWebsites && (
        <div className="text-gray-600">No websites found.</div>
      )}
      {websites.length === 0 && loadingWebsites && (
        <div className="text-gray-600 animate-bounce">Loading websites...</div>
      )}
      {websites.length > 0 &&
        websites.map((website) => (
          <div
            key={website.id} // Используем id в качестве ключа
            className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded"
          >
            <div className="basis-3/6">
              {website.isDomainRoskomnadzorBanned ? (
                  <s className="text-red-500">{website.domainName}</s>
              ) : (
                  <span>{website.domainName}</span>
              )}
            </div>


            <ExpiredDate expiredDate={website.expiredAt}
              updateDate={(data) => updateWebsite(website.id, data)}
            />


            <div  className="flex gap-4	 items-center">
              <button
                  onClick={() => deleteWebsite(website.id, website.domainName)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300 ease-in-out"
              >
                Delete
              </button>

              <button
                  onClick={() => setExpiredDate(website.id)}
                  className="bg-fuchsia-500 text-white py-1 px-3 rounded hover:bg-fuchsia-700 transition duration-300 ease-in-out"
              >
                Update Date
              </button>
            </div>


          </div>
        ))}

      <form onSubmit={addWebsite} className="mt-4 flex items-center">
        <input
          type="text"
          value={newWebsite}
          onChange={(e) => setNewWebsite(e.target.value)}
          placeholder="Enter your website domain name"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="file"
          onChange={(e) => {
            setWebsiteFile(e.target.files[0]);
            // console.log(e.target.files[0]);
          }}
          className="p-2 border border-gray-300 rounded mr-2"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Add
        </button>
        <button
          onClick={startCheckingDomainBans}
          type="button"
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300 ease-in-out ml-4"
        >
          {isBannedDomainsChecking ? "Loading..." : "Check domain bans task"}
        </button>
      </form>
      <button
        onClick={runBpnRebuild}
        type="button"
        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300 ease-in-out mt-4"
      >
        {websitesIsRebuilding ? "Loading..." : "Run websites rebuild task"}
      </button>
      <button
        onClick={downloadBackup}
        type="button"
        className="ml-5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Download Backup
      </button>

      <button
        type="button"
        onClick={handleUploadBackup}
        className={`ml-5 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300 ease-in-out ${
          loadingBackupToMega ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loadingBackupToMega}
      >
        {loadingBackupToMega
          ? "Uploading backup to Mega..."
          : "Upload Backup to Mega"}
      </button>

      <button
          onClick={() => updateAllExpiredDates()}
          className="bg-fuchsia-500 text-white ml-5 py-2 px-4 rounded hover:bg-fuchsia-700 transition duration-300 ease-in-out"
      >
        Update All Dates
      </button>

      <form
        onSubmit={uploadBackup}
        encType="multipart/form-data"
        className="mt-4"
      >
        <input
          type="file"
          name="backupFile"
          accept=".zip"
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={uploadingBackup || fileSizeError}
          className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 ease-in-out ml-2
      ${
        uploadingBackup || fileSizeError ? "opacity-50 cursor-not-allowed" : ""
      }`}
        >
          {uploadingBackup ? "Uploading backup" : "Upload Backup"}
        </button>
        {!showButton && (
          <span className="text-red-500 ml-2 block pt-3">
            <p>Your backup file size more than 2GB</p>
            <p className="text-yellow-500">
              Please upload your websites manually by ftp into
              ./backend/_websites/content/ OR use{" "}
            </p>
          </span>
        )}

        <a className={"block text-blue-500 mt-4"} href="/websites-filebrowser">
          Websites Filebrowser
        </a>
        <p className={"-mt-1"}>
          <span className="text-red-500">* </span>
          <span className="text-black-400 font-light text-sm">
            Don't forget to delete .zip file after uploading and unpacking
          </span>
        </p>
      </form>
    </div>
  );
}
