const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const writeToFile = require("./utils/writetofile.js")
const readFromFile = require("./utils/readfromfile.js")
const open = (...args) => import('open').then(mod => mod.default(...args));

const app = express();
const PORT = 3000;

// EJS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));







// Home route
app.get("/", async (req, res) => {
    const data = await readFromFile("episodes");
    const lastwatched = await readFromFile("lastwatched");
    if (data.episodes.length == 0) {
        res.render("index", { files: [], lastwatched: "" });
    } else if (data.episodes.length > 0 && lastwatched == null) {
        res.render("index", { files: data.episodes, lastwatched: "" });
    }
    else {
        res.render("index", { files: data.episodes, lastwatched: lastwatched });
    }
});



app.post("/scan", (req, res) => {
    writeToFile("", "lastwatched")
    const folderPath = req.body.folderPath;
    console.log(folderPath)

    const files = fs.readdirSync(folderPath);

    const parsed = files.map(file => {
        const match = file.match(/EP\.(\d+)/i);
        console.log(match) // case-insensitive
        // const episodeNumber = match ? parseInt(match[1], 10) : null;
        return {
            name: file,
            episode: match ? parseInt(match[1], 10) : null
        };
    });
    const data = {
        folderPath,
        episodes: parsed
    }
    writeToFile(data);
    res.render("index", { files: parsed, lastwatched: "" });
});

app.post("/play", (req, res) => {
    const { episodes } = req.body;
    const folderPath = readFromFile("episodes").folderPath;
    const filePaths = episodes.map(episode => path.join(folderPath, episode));
    const vlcPath = "C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe";
    const command = `"${vlcPath}" ${filePaths.map(p => `"${p}"`).join(" ")}`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error launching VLC");
        }
        res.send("VLC launched successfully");
    });
})



app.post("/lastwatched", (req, res) => {
    try {
        const { episode } = req.body;
        console.log(episode)
        writeToFile(episode, "lastwatched");
        res.json({ message: "Last watched updated successfully" });
        console.log("Last watched updated")
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error updating last watched" });
    }
})

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Browser Opening Now")
    await open(`http://localhost:${PORT}`)
});