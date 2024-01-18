const path = require("path");
const fs = require("fs-extra");

const dataDir = path.resolve(__dirname, "_data");
const outputDir = path.resolve(__dirname, "dist");

module.exports = function (eleventyConfig) {
  function cleanOutputDir() {
    fs.emptyDirSync(outputDir);
  }

  cleanOutputDir();

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

  // disable rendering for .html files
  eleventyConfig.addPassthroughCopy("content");
  //eleventyConfig.addTemplateFormats("njk");

  // Return your Object options:
  return {
    dir: {
      input: "content",
      output: "dist",
    },

    // disable rendering for .html files
    // htmlTemplateEngine: "njk"
    htmlTemplateEngine: "html",
  };
};
