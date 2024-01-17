// module.exports = {
//   "example1.com": ["test11.com", "test22.com"],
//   "example2.com": ["test33.com", "test44.com"],
// };
const getLinks = async () => {
  try {
    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));
    const response = await fetch("http://backend:3000/pbn-links");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.log("Fetch error:", error);
    return {};
  }
};

module.exports = getLinks();
