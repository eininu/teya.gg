import React, { useEffect, useState } from "react";
import punycode from "punycode";
export default function Websites() {
  const [websites, setWebsites] = useState([]);
  const [websiteFile, setWebsiteFile] = useState(null);
  const [backupFile, setBackupFile] = useState(null);
  const [newWebsite, setNewWebsite] = useState("");
  const [websitesIsRebuilding, setWebsitesIsRebuilding] = useState(false);
  const [loadingBackupToMega, setLoadingBackupToMega] = useState(false);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = () => {
    fetch("/api/websites")
      .then((response) => response.json())
      .then((data) => {
        const convertedData = data.map((website) => ({
          ...website,
          domainName: punycode.toUnicode(website),
        }));
        setWebsites(convertedData);
      })
      .catch((error) => console.error("Error while receiving data:", error));
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

  const deleteWebsite = async (domainName) => {
    if (window.confirm(`Are you sure you want to delete ${domainName}?`)) {
      try {
        const response = await fetch(`/api/websites/deleteSite/${domainName}`, {
          method: "DELETE",
        });

        if (response.ok) {
          //setWebsites(prevWebsites => prevWebsites.filter(website => website.domainName !== domainName));

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
        fetchWebsites();
      })
      .catch((error) => console.error("Error while adding website:", error));
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

  return (
    <div className="p-4">
      <h2 className={"py-2 font-bold text-2xl"}>Websites</h2>
      {websites.length === 0 && (
        <div className="text-gray-600">No websites found.</div>
      )}
      {websites.length > 0 &&
        websites.map((website) => (
          <div
            key={website.domain}
            className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded"
          >
            {website.isDomainRoskomnadzorBanned ? (
              <s className="text-red-500">{website.domainName}</s>
            ) : (
              <span>{website.domainName}</span>
            )}
            <button
              onClick={() => deleteWebsite(website.domainName)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300 ease-in-out"
            >
              Delete
            </button>
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

      <form
        onSubmit={uploadBackup}
        encType="multipart/form-data"
        className="mt-4"
      >
        <input
          type="file"
          name="backupFile"
          accept=".zip"
          onChange={(e) => setBackupFile(e.target.files[0])}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 ease-in-out ml-2"
        >
          Upload Backup
        </button>
      </form>
    </div>
  );
}
