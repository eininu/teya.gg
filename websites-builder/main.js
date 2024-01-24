const fs = require("fs");
const path = require("path");

const linksConfig = {
  "example1.com": {
    "/": [
      'some text for example1 with <a href="https://test.com/">anchor1</a> here',
    ],
    "/smth": [
      'some text for example1 with <a href="https://test.com/">anchor2</a> here',
    ],
    "/about.html": [
      'some text for example1 with <a href="https://test.com/">anchor3</a> here',
    ],
  },
  "example2.com": {
    "/": [
      'some text for example2 with <a href="https://test2.com/">anchor4</a> here',
    ],
    "/smth": [
      'some text for example2 with <a href="https://test2.com/">anchor5</a> here',
    ],
  },
};
const contentDir = path.resolve("./content");
const distDir = path.resolve("./dist");

function clearDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file) => {
      const curPath = path.join(directory, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        clearDirectory(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directory);
  }
}

function processFile(filePath, siteName) {
  try {
    let fileContent = fs.readFileSync(filePath, "utf8");

    let relativePath = path
      .relative(path.join(contentDir, siteName), filePath)
      .replace(/\\/g, "/");

    let configPath = "/" + relativePath.replace(/\/index\.html$/, "");
    if (configPath.endsWith("/")) {
      configPath = configPath.slice(0, -1);
    }

    if (fileContent.includes("<!-- fJlpVeUpnQpUnJCwBbmRuOaIO -->")) {
      if (linksConfig[siteName] && linksConfig[siteName][configPath]) {
        fileContent = fileContent.replace(
          "<!-- fJlpVeUpnQpUnJCwBbmRuOaIO -->",
          linksConfig[siteName][configPath].join(" "),
        );
      }
    }

    const distFilePath = path.join(distDir, siteName, relativePath);
    if (!fs.existsSync(path.dirname(distFilePath))) {
      fs.mkdirSync(path.dirname(distFilePath), { recursive: true });
    }
    fs.writeFileSync(distFilePath, fileContent);
    console.log(`Processed and written to: ${distFilePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error}`);
  }
}

function processDirectory(directory, siteName) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(directory, dirent.name);
    if (dirent.isDirectory()) {
      processDirectory(fullPath, siteName);
    } else if (dirent.isFile() && path.extname(fullPath) === ".html") {
      processFile(fullPath, siteName);
    }
  });
}

function main() {
  clearDirectory(distDir);
  try {
    fs.readdirSync(contentDir, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isDirectory()) {
        processDirectory(path.join(contentDir, dirent.name), dirent.name);
      }
    });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

main();
