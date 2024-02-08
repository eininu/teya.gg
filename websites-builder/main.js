// TODO: There is a problem: Need to unify html code part, cauz if all websites
// will have same <!-- fJlpVeUpnQpUnJCwBbmRuOaIO --> it will connect them as PBN
// and it's not good. Need to make it unique for each website.

// And if we willmake this code for websites which not be used in pbn links - it's still bad

// TODO: Add code minification
// TODO: Delete images less than 100B, cauz it's placeholder images from restored archives
// TODO: Anyway remove html comment <!-- fJlpVeUpnQpUnJCwBbmRuOaIO --> from html files, if link is not found

const fs = require("fs").promises;
const path = require("path");
const util = require("util");
const fsBase = require("fs");

let requestAttempted = false;

const getLinks = async () => {
  if (requestAttempted) {
    return {};
  }

  requestAttempted = true;

  try {
    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));
    const response = await fetch("http://backend:3000/pbn-links", {
      timeout: 5000,
    });

    if (!response.ok) {
      console.log("Network response was not ok");
      return {};
    }

    return response.json();
  } catch (error) {
    console.log("Fetch error:", error);
    return {};
  }
};

const contentDir = path.resolve("./content");
const distDir = path.resolve("./dist");

async function clearDirectory(directory) {
  try {
    await fs.access(directory);
    const files = await fs.readdir(directory);
    for (const file of files) {
      const curPath = path.join(directory, file);
      const stat = await fs.lstat(curPath);
      if (stat.isDirectory()) {
        await clearDirectory(curPath);
        await fs.rmdir(curPath);
      } else {
        await fs.unlink(curPath);
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

async function processFile(filePath, siteName, linksConfig) {
  try {
    let fileContent = await fs.readFile(filePath, "utf8");

    let relativePath = path
      .relative(path.join(contentDir, siteName), filePath)
      .replace(/\\/g, "/");

    let configPath = "/" + relativePath.replace(/\/index\.html$/, "");
    if (configPath === "/index.html") {
      // Исправление для корректной обработки корневого пути
      configPath = "/";
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
    if (!fsBase.existsSync(path.dirname(distFilePath))) {
      fsBase.mkdirSync(path.dirname(distFilePath), { recursive: true });
    }
    fsBase.writeFileSync(distFilePath, fileContent);
    // console.log(`Processed and written to: ${distFilePath}`);
  } catch (error) {
    // console.error(`Error processing ${filePath}: ${error}`);
  }
}

async function copyFile(filePath, siteName) {
  const relativePath = path.relative(path.join(contentDir, siteName), filePath);
  const distFilePath = path.join(distDir, siteName, relativePath);
  await fs.mkdir(path.dirname(distFilePath), { recursive: true });
  await fs.copyFile(filePath, distFilePath);
  // console.log(`Copied to: ${distFilePath}`);
}

async function processDirectory(directory, siteName, linksConfig) {
  const dirents = await fs.readdir(directory, { withFileTypes: true });
  const tasks = dirents.map(async (dirent) => {
    let direntName = dirent.name;
    try {
      const decodedName = decodeURIComponent(direntName);
      if (direntName !== decodedName) {
        const oldPath = path.join(directory, direntName);
        const newPath = path.join(directory, decodedName);

        // Проверка на длину пути
        if (newPath.length > 260) {
          // Пример для Windows
          console.error(`Error: Decoded path is too long: ${newPath}`);
        } else if (/[*?"<>|]/.test(decodedName)) {
          // Проверка на спецсимволы для Windows
          console.error(
            `Error: Decoded name contains invalid characters: ${decodedName}`,
          );
        } else {
          await fs.rename(oldPath, newPath);
          direntName = decodedName;
        }
      }
    } catch (e) {
      // console.error(`Error decoding directory name '${direntName}': ${e}`);
    }

    const fullPath = path.join(directory, direntName);
    if (dirent.isDirectory()) {
      await processDirectory(fullPath, siteName, linksConfig);
    } else if (dirent.isFile() && path.extname(fullPath) === ".html") {
      await processFile(fullPath, siteName, linksConfig);
    } else {
      await copyFile(fullPath, siteName);
    }
  });
  await Promise.all(tasks);
}

async function main() {
  const linksConfig = await getLinks();
  await clearDirectory(distDir);
  try {
    const dirents = await fs.readdir(contentDir, { withFileTypes: true });
    await Promise.all(
      dirents.map((dirent) => {
        if (dirent.isDirectory()) {
          return processDirectory(
            path.join(contentDir, dirent.name),
            dirent.name,
            linksConfig,
          );
        }
      }),
    );
  } catch (error) {
    console.error(`Error: ${error}`);
  } finally {
    console.log("Websites build finished!");
  }
}

main();
