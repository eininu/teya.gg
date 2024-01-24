const express = require("express");
const { exec } = require("child_process");
const app = express();
const port = 3001;

const build = () => {
  return new Promise((resolve, reject) => {
    exec("node main.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Runtime error: ${error}`);
        reject("Build error");
      } else {
        resolve("Build completed successfully");
      }
    });
  });
};

app.get("/build", async (req, res) => {
  try {
    const result = await build();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
