// server.cjs
const express = require("express");
const compression = require("compression");
const path = require("path");

const app = express();
const www = path.join(__dirname, "dist"); // change to "build" if that's your Vite outDir

app.use(compression());
app.use(express.json());

app.get("/api/hello", (_req, res) => res.json({ ok: true }));

app.use(express.static(www, { maxAge: "1d", index: false }));
app.get("*", (_req, res) => res.sendFile(path.join(www, "index.html")));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${port}`));
