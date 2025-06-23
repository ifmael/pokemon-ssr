import React, { useState } from 'react';
import { Link } from 'react-router';
import { PokédexPageProps } from './types';
import './HomePage.css';

const HomePage: React.FC<PokédexPageProps> = ({ serverData }) => {
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadClientData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=5&offset=0');
      const data = await response.json();

      const pokemonList = await Promise.all(
        data.results.map(async (pokemon: any, index: number) => {
          const id = index + 1;
          return {
            name: pokemon.name,
            url: pokemon.url,
            id,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          };
        })
      );

      setClientData({
        pokemonList,
        totalCount: data.count,
        page: 1,
        loadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h1>🏠 Página Principal - Demo SSR vs CSR</h1>
      <p>Esta página demuestra la diferencia entre datos cargados en el servidor vs el cliente.</p>

      <section className="section">
        <h2>🖥️ Datos del Servidor (SSR)</h2>
        {serverData ? (
          <div className="server-data-available">
            <p><strong>Estado:</strong> ✅ Datos disponibles inmediatamente</p>
            <p><strong>Total Pokémon:</strong> {serverData.totalCount}</p>
            <p><strong>Pokémon cargados:</strong> {serverData.pokemonList?.length || 0}</p>
            <p><strong>Página:</strong> {serverData.page}</p>

            <h4>Primeros 5 Pokémon:</h4>
            <div className="pokemon-grid">
              {serverData.pokemonList?.slice(0, 5).map((pokemon: any) => (
                <Link
                  key={pokemon.id}
                  to={`/pokemon/${pokemon.name}`}
                  className="pokemon-card-link"
                >
                  <div className="pokemon-card">
                    <img src={pokemon.sprite} alt={pokemon.name} />
                    <p><strong>#{pokemon.id.toString().padStart(3, '0')}</strong></p>
                    <p>{pokemon.name}</p>
                  </div>
                </Link>
              ))}
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
            <p><strong>Estado:</strong> ✅ Datos cargados por el cliente</p>
            <p><strong>Total Pokémon:</strong> {clientData.totalCount}</p>
            <p><strong>Pokémon cargados:</strong> {clientData.pokemonList?.length || 0}</p>
            <p><strong>Cargado en:</strong> {new Date(clientData.loadedAt).toLocaleTimeString()}</p>

            <h4>Pokémon cargados por el cliente:</h4>
            <div className="pokemon-grid">
              {clientData.pokemonList?.map((pokemon: any) => (
                <Link
                  key={pokemon.id}
                  to={`/pokemon/${pokemon.name}`}
                  className="pokemon-card-link"
                >
                  <div className="pokemon-card">
                    <img src={pokemon.sprite} alt={pokemon.name} />
                    <p><strong>#{pokemon.id.toString().padStart(3, '0')}</strong></p>
                    <p>{pokemon.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="client-data-pending">
            <p><strong>Estado:</strong> ⏳ Sin datos del cliente</p>
            <p>Haz clic en el botón para cargar datos usando fetch en el cliente</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default HomePage;