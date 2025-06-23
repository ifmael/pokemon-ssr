import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateHTML() {
  try {
    // Leer los archivos generados en dist/client/assets
    const assetsDir = path.join(__dirname, "../dist/client/assets");
    const files = await fs.readdir(assetsDir);

    // Encontrar los archivos JS y CSS
    const jsFile = files.find(
      (file) => file.startsWith("main-") && file.endsWith(".js")
    );
    const cssFile = files.find(
      (file) => file.startsWith("main-") && file.endsWith(".css")
    );

    if (!jsFile) {
      throw new Error("No se encontró el archivo JS principal");
    }

    // Generar el HTML template
    const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>

    <!-- Placeholder para meta tags dinámicos -->
    <!--app-meta-->

    <!-- Placeholder para scripts de datos iniciales -->
    <!--app-data-->

    <!-- Placeholder para otros elementos del head -->
    <!--app-head-->${
      cssFile
        ? `
    <link rel="stylesheet" crossorigin href="/assets/${cssFile}">`
        : ""
    }
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" crossorigin src="/assets/${jsFile}"></script>
  </body>
</html>`;

    // Escribir el archivo HTML
    const htmlPath = path.join(__dirname, "../dist/client/index.html");
    await fs.writeFile(htmlPath, htmlContent);

    console.log("✅ HTML generado exitosamente con assets:", {
      jsFile,
      cssFile,
    });
  } catch (error) {
    console.error("❌ Error generando HTML:", error);
    process.exit(1);
  }
}

generateHTML();
