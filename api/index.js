import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el template HTML y el módulo SSR al inicio
let htmlTemplate, ssrModule;

async function initializeApp() {
  if (!htmlTemplate || !ssrModule) {
    try {
      // Leer el HTML template compilado (con assets)
      const htmlPath = path.join(__dirname, "../dist/client/index.html");
      htmlTemplate = await fs.readFile(htmlPath, "utf-8");

      // Importar el módulo SSR (buscar el archivo correcto)
      const serverDir = path.join(__dirname, "../dist/server/assets");
      const serverFiles = await fs.readdir(serverDir);
      const serverFile = serverFiles.find(
        (file) => file.startsWith("entry-server-") && file.endsWith(".js")
      );

      if (!serverFile) {
        throw new Error("No se encontró el archivo entry-server");
      }

      ssrModule = await import(`../dist/server/assets/${serverFile}`);
    } catch (error) {
      console.error("Error initializing app:", error);
      throw error;
    }
  }
}

function injectIntoTemplate(template, rendered) {
  const initialDataScript = rendered.initialData
    ? `<script>window.__INITIAL_DATA__ = ${JSON.stringify(
        rendered.initialData
      )};</script>`
    : "";
  const metaTags = rendered.meta || "";
  const headContent = rendered.head || "";

  return template
    .replace(`<!--app-meta-->`, metaTags)
    .replace(`<!--app-data-->`, initialDataScript)
    .replace(`<!--app-head-->`, headContent)
    .replace(`<!--app-html-->`, rendered.html || "");
}

export default async function handler(req, res) {
  try {
    await initializeApp();

    const url = req.url;
    const rendered = await ssrModule.render(url);
    const html = injectIntoTemplate(htmlTemplate, rendered);

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("SSR Error:", error);
    res.status(500).send(`
      <h1>Error del Servidor</h1>
      <p>Ocurrió un error durante el renderizado de la página.</p>
      <pre>${error.message}</pre>
    `);
  }
}
