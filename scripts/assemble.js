import fs from "fs";
import path from "path";
import clipboard from "clipboardy";

const basePath = "/home/atari-monk/atari-monk/project/box-game";

const inputFile = process.argv[2];

if (!inputFile) {
    console.error("Usage: prompt <file.md>");
    process.exit(1);
}

function loadFile(relPath) {
    const fullPath = path.resolve(basePath, relPath.trim());

    if (!fs.existsSync(fullPath)) {
        return `// FILE NOT FOUND: ${relPath}`;
    }

    return fs.readFileSync(fullPath, "utf-8").replace(/\s+$/, "");
}

let content = fs.readFileSync(inputFile, "utf-8");

content = content.replace(/{{include:(.*?)}}/g, (_, relPath) => {
    const fileContent = loadFile(relPath);

    return [
        `// FILE: ${relPath.trim()}`,
        fileContent
    ].join("\n");
});

// normalize excessive blank lines
content = content.replace(/\n{3,}/g, "\n\n").trim() + "\n";

// 🔥 COPY DIRECTLY TO CLIPBOARD
clipboard.writeSync(content);

console.log("✅ Prompt copied to clipboard");