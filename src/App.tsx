import "./App.css";
import React from "react";
import { Routes, Route, useLocation } from "react-router";
import DebugLayout from "./components/DebugLayout";
import HomePage from "./pages/HomePage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import TrainerProfilePage from "./pages/TrainerProfilePage";

interface InitialPageProps {
  route?: string;
  data?: any;
  error?: string;
}

interface AppProps {
  initialPageProps?: InitialPageProps;
}

function App({ initialPageProps }: AppProps) {
  const location = useLocation();

  // Determinar qué datos usar según la ruta actual
  const getPageData = () => {
    if (!initialPageProps) return undefined;

    // Si la ruta del servidor coincide con la ruta actual, usar los datos
    if (initialPageProps.route === location.pathname) {
      return initialPageProps.data;
    }

    // Si no coincide, probablemente sea navegación del cliente
    return undefined;
  };

  const pageData = getPageData();

  // Preparar información de debug para el layout
  const debugInfo = initialPageProps
    ? {
        route: initialPageProps.route,
        data: pageData,
        error: initialPageProps.error,
        currentPath: location.pathname,
      }
    : undefined;

  return (
    <DebugLayout debugInfo={debugInfo}>
      <Routes>
        <Route path="/" element={<HomePage serverData={pageData} />} />
        <Route
          path="/pokemon/:pokemonName"
          element={<PokemonDetailPage serverData={pageData} />}
        />
        <Route
          path="/trainer"
          element={<TrainerProfilePage serverData={pageData} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </DebugLayout>
  );
}

function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La ruta solicitada no existe en esta aplicación.</p>
      <a href="/" style={{ color: "#3498db", textDecoration: "none" }}>
        ← Volver al inicio
      </a>
    </div>
  );
}

export default App;
