import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { PokemonDetailPageProps } from './types';
import './PokemonDetailPage.css';

const PokemonDetailPage: React.FC<PokemonDetailPageProps> = ({ serverData }) => {
  const { pokemonName } = useParams<{ pokemonName: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadClientData = async () => {
    if (!pokemonName) return;

    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemon = await response.json();

      setClientData({
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        sprites: pokemon.sprites,
        loadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pokemon-detail-page">
      <h1>🔍 Detalle de Pokémon: {pokemonName} - Demo SSR vs CSR</h1>
      <p>Esta página demuestra cómo se cargan los detalles de un Pokémon desde servidor vs cliente.</p>

      <section className="section">
        <h2>🖥️ Datos del Servidor (SSR)</h2>
        {serverData ? (
          <div className="server-data-available">
            <div className="pokemon-info-grid">
              <div className="pokemon-info-section">
                <h3>📝 Información Básica</h3>
                <p><strong>ID:</strong> #{serverData.id.toString().padStart(3, '0')}</p>
                <p><strong>Nombre:</strong> {serverData.name}</p>
                <p><strong>Altura:</strong> {(serverData.height / 10).toFixed(1)} m</p>
                <p><strong>Peso:</strong> {(serverData.weight / 10).toFixed(1)} kg</p>
              </div>
              <div className="pokemon-info-section">
                <h3>🎨 Sprite Principal</h3>
                <img
                  src={serverData.sprites.front_default}
                  alt={serverData.name}
                  className="pokemon-sprite"
                />
              </div>
            </div>

            {serverData.types && (
              <div className="pokemon-types">
                <h4>🏷️ Tipos:</h4>
                <div className="types-container">
                  {serverData.types.map((type: string) => (
                    <span key={type} className="type-badge">
                      {type}
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
        <h2>💻 Datos del Cliente (CSR)</h2>
        <button
          onClick={loadClientData}
          disabled={loading}
          className="client-data-button"
        >
          {loading ? 'Cargando...' : 'Cargar datos desde el cliente'}
        </button>

        {clientData ? (
          <div className="client-data-available">
            <div className="pokemon-info-grid">
              <div className="pokemon-info-section">
                <h3>📝 Información Básica</h3>
                <p><strong>ID:</strong> #{clientData.id.toString().padStart(3, '0')}</p>
                <p><strong>Nombre:</strong> {clientData.name}</p>
                <p><strong>Altura:</strong> {(clientData.height / 10).toFixed(1)} m</p>
                <p><strong>Peso:</strong> {(clientData.weight / 10).toFixed(1)} kg</p>
                <p><strong>Cargado en:</strong> {new Date(clientData.loadedAt).toLocaleTimeString()}</p>
              </div>
              <div className="pokemon-info-section">
                <h3>🎨 Sprite Principal</h3>
                <img
                  src={clientData.sprites.front_default}
                  alt={clientData.name}
                  className="pokemon-sprite"
                />
              </div>
            </div>

            <div className="data-source">
              <p><strong>Fuente:</strong> Datos cargados por fetch en el cliente</p>
            </div>
          </div>
        ) : (
          <div className="client-data-pending">
            <p><strong>Estado:</strong> ⏳ Sin datos del cliente</p>
            <p>Haz clic en el botón para cargar datos usando fetch en el cliente</p>
          </div>
        )}
      </section>

      <section>
        <Link to="/" className="back-link">
          ← Volver al inicio
        </Link>
      </section>
    </div>
  );
};

export default PokemonDetailPage;