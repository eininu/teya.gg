import React, { useEffect, useState } from "react";

export default function Websites() {
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    fetch("/api/websites")
      .then((response) => response.json())
      .then((data) => setWebsites(data))
      .catch((error) => console.error("Error while receiving data:", error));
  }, []);

  return (
    <div>
      {websites.map((website) => (
        <div key={website.id}>
          {website.isDomainRoskomnadzorBanned ? (
            <s>{website.domainName}</s>
          ) : (
            <span>{website.domainName}</span>
          )}
        </div>
      ))}
    </div>
  );
}
