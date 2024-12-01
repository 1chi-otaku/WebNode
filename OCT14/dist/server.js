import express from ;
import https from "node:https";
import path from "node:path";
import fs from "node:fs";
const PORT = 443;
const app = express();
const __dirname = import.meta.dirname;
const options = {
    key: fs.readFileSync(path.join(__dirname, "..", "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "cert", "cert.pem"))
};
https
    .createServer(options, app)
    .listen(PORT, () => console.log("https://127.0.0.1/"));
app.get("/", (req, res) => {
    req.params;
});
