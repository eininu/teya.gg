const path = require("path");
const fs = require("fs");

const dataDir = path.resolve(__dirname, "_data");

module.exports = function (eleventyConfig) {
  // read global _data objects as json (possums.[json/js] --> {{ possums }})
  fs.readdirSync(dataDir).forEach((file) => {
    let fileExt = path.extname(file);
    if (fileExt === ".json" || fileExt === ".js") {
      const fileName = path.basename(file, fileExt);
      eleventyConfig.addGlobalData(fileName, () => {
        return require(path.join(dataDir, file));
      });
    }
  });

  eleventyConfig.addFilter("extractDirName", function (url) {
    if (typeof url !== "string") return "";

    const parts = url.split("/").filter(Boolean);
    return parts[0] || "";
  });

  // Return your Object options:
  return {
    dir: {
      input: "content",
      output: "dist",
    },
    htmlTemplateEngine: "njk",
  };
};
