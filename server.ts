import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createApiApp } from "./server-app";

async function startServer() {
  const { app } = createApiApp();

  const portArgIdx = process.argv.indexOf("--port");
  const cliPort = portArgIdx !== -1 ? Number(process.argv[portArgIdx + 1]) : NaN;
  const PORT =
    Number.isFinite(cliPort) && cliPort > 0
      ? cliPort
      : Number(process.env.PORT) || 3000;

  const isProduction =
    process.env.NODE_ENV === "production" ||
    Boolean(process.argv[1]?.endsWith("server.cjs")) ||
    Boolean(process.argv[1]?.endsWith("server.js"));

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const currentDir =
      typeof __dirname !== "undefined"
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url));
    const cwdDist = path.join(process.cwd(), "dist");
    const distPath = fs.existsSync(path.join(cwdDist, "index.html"))
      ? cwdDist
      : fs.existsSync(path.join(currentDir, "index.html"))
        ? currentDir
        : cwdDist;

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API route not found" });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
