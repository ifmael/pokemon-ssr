import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache para evitar lecturas múltiples
let htmlTemplate, ssrModule;

async function getHtmlTemplate() {
  if (!htmlTemplate) {
    try {
      const htmlPath = path.join(__dirname, "../dist/index.html");
      htmlTemplate = await fs.readFile(htmlPath, "utf-8");
    } catch (error) {
      console.error("Error leyendo template HTML:", error);
      throw error;
    }
  }
  return htmlTemplate;
}

async function getSsrModule() {
  if (!ssrModule) {
    try {
      ssrModule = await import("../dist/server/entry-server.js");
    } catch (error) {
      console.error("Error importando módulo SSR:", error);
      throw error;
    }
  }
  return ssrModule;
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
    const template = await getHtmlTemplate();
    const ssr = await getSsrModule();

    const rendered = await ssr.render(req.url);
    const html = injectIntoTemplate(template, rendered);

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("Error en SSR:", error);
    res.status(500).send(`
      <h1>Error del Servidor</h1>
      <p>Ocurrió un error durante el renderizado: ${error.message}</p>
    `);
  }
}
