const fs = require("node:fs");
const path = require("node:path");

const outDir = path.join(process.cwd(), "out");

function cleanTxtFilesRecursively(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      cleanTxtFilesRecursively(fullPath);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const fileName = entry.name.toLowerCase();
    if (fileName.endsWith(".txt") && fileName !== "robots.txt") {
      fs.unlinkSync(fullPath);
    }
  }
}

if (fs.existsSync(outDir) && fs.statSync(outDir).isDirectory()) {
  cleanTxtFilesRecursively(outDir);
}
