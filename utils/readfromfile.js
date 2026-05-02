const fs = require("fs");
const path = require("path");



function readFromFile(name) {
    const jsonFilePath = path.join(__dirname, "..", "public", `${name}.json`);
    try {
        const data = fs.readFileSync(jsonFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading from file:", error);
        return null;
    }
}

module.exports = readFromFile;