import React from 'react';
import { Link, useLocation } from 'react-router';
import './DebugLayout.css';

interface DebugLayoutProps {
  children: React.ReactNode;
  debugInfo?: {
    route?: string;
    data?: any;
    error?: string;
    currentPath: string;
  };
}

const DebugLayout: React.FC<DebugLayoutProps> = ({ children, debugInfo }) => {
  const location = useLocation();

  return (
    <div className="debug-app">
      <header className="debug-header">
        <div className="header-container">
          <div className="header-brand">
            <h1>🔍 Debug SSR Demo</h1>
            <p>React + Vite + SSR</p>
          </div>

          <nav className="header-nav">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              📚 Home
            </Link>
            <Link
              to="/trainer"
              className={`nav-link ${location.pathname === '/trainer' ? 'active' : ''}`}
            >
              👤 Trainer
            </Link>
          </nav>
        </div>
      </header>

      <main className="debug-main">
        <div className="debug-container">
          <section className="debug-info-section">
            <h2>🔧 Información de Debug</h2>

            <div className="debug-panels">
              <div className="debug-panel">
                <h3>🌐 Información de Rutas</h3>
                <div className="debug-item">
                  <span className="label">Ruta Actual (Cliente):</span>
                  <code className="value client">{location.pathname}</code>
                </div>
                <div className="debug-item">
                  <span className="label">Ruta SSR (Servidor):</span>
                  <code className="value server">{debugInfo?.route || 'N/A'}</code>
                </div>
                <div className="debug-item">
                  <span className="label">Coincidencia:</span>
                  <span className={`status ${debugInfo?.route === location.pathname ? 'match' : 'no-match'}`}>
                    {debugInfo?.route === location.pathname ? '✅ Rutas coinciden' : '❌ Rutas diferentes'}
                  </span>
                </div>
              </div>

              <div className="debug-panel">
                <h3>📊 Estado de los Datos</h3>
                <div className="debug-item">
                  <span className="label">Modo de Renderizado:</span>
                  <span className={`mode ${debugInfo?.data ? 'ssr' : 'csr'}`}>
                    {debugInfo?.data ? 'SSR (Server-Side)' : 'CSR (Client-Side)'}
                  </span>
                </div>
                <div className="debug-item">
                  <span className="label">Datos Disponibles:</span>
                  <span className={`status ${debugInfo?.data ? 'available' : 'loading'}`}>
                    {debugInfo?.data ? '✅ Precargados en servidor' : '⏳ Se cargarán en cliente'}
                  </span>
                </div>
                <div className="debug-item">
                  <span className="label">Origen de Datos:</span>
                  <span className={`origin ${debugInfo?.data ? 'server' : 'client'}`}>
                    {debugInfo?.data ? '🖥️ Servidor (getServerSideProps)' : '💻 Cliente (useEffect/fetch)'}
                  </span>
                </div>
              </div>

              {debugInfo?.error && (
                <div className="debug-panel error">
                  <h3>❌ Errores Detectados</h3>
                  <div className="debug-item">
                    <span className="label">Error:</span>
                    <code className="value error">{debugInfo.error}</code>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="page-content">
            <div className="content-header">
              <h2>📄 Contenido de la Página</h2>
              <div className="content-meta">
                <span className={`data-source ${debugInfo?.data ? 'server' : 'client'}`}>
                  {debugInfo?.data ? '🖥️ Datos del Servidor' : '💻 Datos del Cliente'}
                </span>
              </div>
            </div>

            <div className="content-body">
              {children}
            </div>
          </section>
        </div>
      </main>

    </div>
  );
};

export default DebugLayout;