const fs = require("fs");
const path = require("path");


function writeToFile(data, name = "episodes") {
    const jsonFilePath = path.join(__dirname, "..", "public", `${name}.json`);
    fs.writeFileSync(jsonFilePath, JSON.stringify(data));
}

module.exports = writeToFile;