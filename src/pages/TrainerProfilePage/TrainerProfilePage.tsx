import React, { useState, useEffect } from 'react';
import { TrainerProfilePageProps } from './types';
import './TrainerProfilePage.css';

const TrainerProfilePage: React.FC<TrainerProfilePageProps> = ({ serverData }) => {
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadClientData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const trainerData = {
        name: 'Entrenador Cliente',
        level: Math.floor(Math.random() * 50) + 1,
        badges: Math.floor(Math.random() * 8) + 1,
        pokemonCaught: Math.floor(Math.random() * 100) + 1,
        loadedAt: new Date().toISOString(),
        source: 'client-api'
      };

      setClientData(trainerData);
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trainer-profile-page">
      <h1>👤 Perfil del Entrenador - Demo SSR vs CSR</h1>
      <p>Esta página demuestra cómo se cargan los datos del perfil desde servidor vs cliente.</p>

      <section className="section">
        <h2>🖥️ Perfil del Servidor (SSR)</h2>
        {serverData ? (
          <div className="server-data-available">
            <div className="trainer-info-grid">
              <div className="trainer-info-section">
                <h3>👨‍🦰 {serverData.trainer.name}</h3>
                <p><strong>Nivel:</strong> Experimentado</p>
                <p><strong>Región:</strong> {serverData.trainer.region}</p>
              </div>
              <div className="trainer-info-section">
                <h4>🏆 Logros</h4>
                <p><strong>Medallas:</strong> {serverData.badges?.length || 0}</p>
                <p><strong>Pokémon Capturados:</strong> {serverData.trainer.stats.pokemonCaught}</p>
              </div>
            </div>

            {serverData.badges && serverData.badges.length > 0 && (
              <div className="badges-section">
                <h4>🥇 Medallas Obtenidas:</h4>
                <div className="badges-container">
                  {serverData.badges.map((badge: any) => (
                    <span key={badge.name} className="badge">
                      {badge.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="data-source">
              <p><strong>Fuente:</strong> Datos precargados en el servidor</p>
            </div>
          </div>
        ) : (
          <div className="server-data-unavailable">
            <p><strong>Estado:</strong> ❌ No hay datos del servidor</p>
            <p>Esta página se renderizó en el cliente (CSR)</p>
          </div>
        )}
      </section>

      <section className="section">
        <h2>💻 Perfil del Cliente (CSR)</h2>
        <button
          onClick={loadClientData}
          disabled={loading}
          className="client-data-button"
        >
          {loading ? 'Cargando perfil...' : 'Cargar perfil desde el cliente'}
        </button>

        {clientData ? (
          <div className="client-data-available">
            <div className="trainer-info-grid">
              <div className="trainer-info-section">
                <h3>👨‍💻 {clientData.name}</h3>
                <p><strong>Nivel:</strong> {clientData.level}</p>
                <p><strong>Medallas:</strong> {clientData.badges}</p>
              </div>
              <div className="trainer-info-section">
                <h4>📊 Estadísticas</h4>
                <p><strong>Pokémon Capturados:</strong> {clientData.pokemonCaught}</p>
                <p><strong>Cargado en:</strong> {new Date(clientData.loadedAt).toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="data-source">
              <p><strong>Fuente:</strong> Datos cargados por fetch en el cliente</p>
            </div>
          </div>
        ) : (
          <div className="client-data-pending">
            <p><strong>Estado:</strong> ⏳ Sin datos del cliente</p>
            <p>Haz clic en el botón para simular una carga de datos desde una API</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default TrainerProfilePage;