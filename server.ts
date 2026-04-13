import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API to list images in the 06_MASTER LOTEMANETO folder
  app.get("/api/masterplan-images", (req, res) => {
    const dirPath = path.join(process.cwd(), "public", "REF", "06_MASTER LOTEMANETO");
    
    try {
      if (!fs.existsSync(dirPath)) {
        return res.json([]);
      }
      
      const files = fs.readdirSync(dirPath);
      const images = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map(file => `/REF/06_MASTER LOTEMANETO/${file}`);
      
      res.json(images);
    } catch (error) {
      console.error("Error reading directory:", error);
      res.status(500).json({ error: "Failed to read images directory" });
    }
  });

  // API to list images in the 08_PROPOSTA B folder
  app.get("/api/proposta-b-images", (req, res) => {
    const dirPath = path.join(process.cwd(), "public", "REF", "08_PROPOSTA B");
    
    try {
      if (!fs.existsSync(dirPath)) {
        return res.json([]);
      }
      
      const files = fs.readdirSync(dirPath);
      const images = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map(file => `/REF/08_PROPOSTA B/${file}`);
      
      res.json(images);
    } catch (error) {
      console.error("Error reading directory:", error);
      res.status(500).json({ error: "Failed to read images directory" });
    }
  });

  // API to list images in the 01_CAPA folder
  app.get("/api/hero-images", (req, res) => {
    const dirPath = path.join(process.cwd(), "public", "REF", "01_CAPA");
    
    try {
      if (!fs.existsSync(dirPath)) {
        return res.json([]);
      }
      
      const files = fs.readdirSync(dirPath);
      const images = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map(file => `/REF/01_CAPA/${file}`);
      
      res.json(images);
    } catch (error) {
      console.error("Error reading directory:", error);
      res.status(500).json({ error: "Failed to read images directory" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite not found, skipping middleware. This is expected in production if NODE_ENV is not set correctly.");
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
