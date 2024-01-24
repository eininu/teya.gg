const express = require("express");
const { exec } = require("child_process");
const app = express();
const port = 3001;

const build = async () => {
  await exec("npm run build", (error, stdout, stderr) => {
    if (error) {
      console.error(`Runtime error: ${error}`);
      return "Build error";
    }
  });
  return "Build completed successfully";
};

app.get("/build", async (req, res) => {
  res.send(await build());
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(await build());
});
