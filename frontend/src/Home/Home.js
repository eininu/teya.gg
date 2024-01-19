import { useEffect, useState } from "react";
import Websites from "../Websites/Websites";

export default function Home() {
  const [websitesLength, setWebsitesLength] = useState(0);

  const fetchWebsites = async () => {
    const response = await fetch("/api/websites");
    const data = await response.json();
    console.log(data);
    setWebsitesLength(data.length);
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  return (
    <>
      {/* Placeholder */}
      {/*<div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-64 text-gray-400 dark:border-gray-700 dark:bg-gray-800">*/}
      {/*  You have <span className={"text-green-500 m-1"}>{websitesLength}</span>{" "}*/}
      {/*  websites!*/}
      {/*</div>*/}
      <p className={"pl-4 text-xs"}>
        You have <span className={"text-green-500"}>{websitesLength}</span>{" "}
        websites!
      </p>
      <Websites />
    </>
  );
}
