// server.js
import express from "express";
import path from "path";
import compression from "compression";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const distDir = path.join(__dirname, "dist");

app.use(compression());
app.use(express.json());

// (Optional) simple API example
app.get("/api/hello", (req, res) => {
  res.json({ ok: true, message: "Hello from App Service!" });
});

// Serve static assets from Vite build
app.use(express.static(distDir, { maxAge: "1d", index: false }));

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on ${port}`));
