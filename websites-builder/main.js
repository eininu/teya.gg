const fs = require("fs");
const path = require("path");
const util = require("util");

const readdir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);

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

async function clearDirectory(directory) {
  if (fs.existsSync(directory)) {
    const files = await readdir(directory);
    for (const file of files) {
      const curPath = path.join(directory, file);
      if ((await lstat(curPath)).isDirectory()) {
        await clearDirectory(curPath);
        await rmdir(curPath);
      } else {
        await unlink(curPath);
      }
    }
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

function copyFile(filePath, siteName) {
  const relativePath = path.relative(path.join(contentDir, siteName), filePath);
  const distFilePath = path.join(distDir, siteName, relativePath);
  if (!fs.existsSync(path.dirname(distFilePath))) {
    fs.mkdirSync(path.dirname(distFilePath), { recursive: true });
  }
  fs.copyFileSync(filePath, distFilePath); // Копируем файл
  console.log(`Copied to: ${distFilePath}`);
}

function processDirectory(directory, siteName) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(directory, dirent.name);
    if (dirent.isDirectory()) {
      processDirectory(fullPath, siteName);
    } else if (dirent.isFile()) {
      if (path.extname(fullPath) === ".html") {
        processFile(fullPath, siteName);
      } else {
        copyFile(fullPath, siteName);
      }
    }
  });
}

async function main() {
  await clearDirectory(distDir);
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
