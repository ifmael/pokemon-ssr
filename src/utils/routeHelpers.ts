export interface RouteConfig {
  path: string;
  getServerSideProps?: (url?: string) => Promise<{ props: any }>;
}

import { getServerSideProps as homeGetServerSideProps } from '../pages/HomePage';
import { getServerSideProps as pokemonDetailGetServerSideProps } from '../pages/PokemonDetailPage';
import { getServerSideProps as trainerGetServerSideProps } from '../pages/TrainerProfilePage';

// Configuración de rutas con sus respectivos getServerSideProps
export const routeConfigs: Record<string, RouteConfig> = {
  '/': {
    path: '/',
    getServerSideProps: homeGetServerSideProps
  },
  '/trainer': {
    path: '/trainer',
    getServerSideProps: trainerGetServerSideProps
  }
};

// Función para obtener los datos del servidor según la ruta
export async function getServerSidePropsForRoute(pathname: string): Promise<any> {
  console.log(`🔍 Buscando getServerSideProps para ruta: ${pathname}`);

  // Normalizar la ruta (remover query params y hash)
  const cleanPath = pathname.split('?')[0].split('#')[0];

  // Manejar ruta dinámica de Pokémon (/pokemon/:pokemonName)
  if (cleanPath.startsWith('/pokemon/')) {
    console.log(`✅ Encontrado getServerSideProps para ruta dinámica de Pokémon: ${cleanPath}`);
    try {
      const result = await pokemonDetailGetServerSideProps(pathname);
      return {
        route: cleanPath,
        data: result.props
      };
    } catch (error) {
      console.error(`❌ Error ejecutando getServerSideProps para ${cleanPath}:`, error);
      return {
        route: cleanPath,
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Buscar configuración exacta para rutas estáticas
  const routeConfig = routeConfigs[cleanPath];

  if (routeConfig && routeConfig.getServerSideProps) {
    console.log(`✅ Encontrado getServerSideProps para: ${cleanPath}`);
    try {
      const result = await routeConfig.getServerSideProps(pathname);
      return {
        route: cleanPath,
        data: result.props
      };
    } catch (error) {
      console.error(`❌ Error ejecutando getServerSideProps para ${cleanPath}:`, error);
      return {
        route: cleanPath,
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  console.log(`⚠️ No se encontró getServerSideProps para: ${cleanPath}`);
  return {
    route: cleanPath,
    data: null
  };
}

// Función para generar meta tags específicos por ruta
export function generateMetaTagsForRoute(pathname: string, data: any): string {
  const cleanPath = pathname.split('?')[0].split('#')[0];

  // Manejar meta tags para página de inicio
  if (cleanPath === '/') {
    const pokemonCount = data?.totalCount || 0;
    return `
      <title>Pokédex Nacional - ${pokemonCount} Pokémon disponibles</title>
      <meta name="description" content="Explora la Pokédex Nacional con ${pokemonCount} Pokémon. Información completa con estadísticas, habilidades y sprites." />
      <meta property="og:title" content="Pokédex Nacional - SSR Demo" />
      <meta property="og:description" content="Pokédex interactiva con datos en tiempo real desde la PokéAPI" />
      <meta property="og:image" content="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" />
    `.trim();
  }

  if (cleanPath.startsWith('/pokemon/')) {
    const pokemonName = cleanPath.split('/pokemon/')[1];
    const pokemonData = data;

    if (pokemonData) {
      return `
        <title>${pokemonData.name} (#${pokemonData.id}) - Pokédex</title>
        <meta name="description" content="Información completa de ${pokemonData.name}: estadísticas, habilidades, tipos y movimientos. ${pokemonData.species?.description || ''}" />
        <meta property="og:title" content="${pokemonData.name} - Pokédex" />
        <meta property="og:description" content="${pokemonData.species?.description || `Información completa de ${pokemonData.name}`}" />
        <meta property="og:image" content="${pokemonData.sprites?.front_default || ''}" />
        <meta name="keywords" content="pokemon, ${pokemonData.name}, pokedex, ${pokemonData.types?.join(', ')}, estadísticas" />
      `.trim();
    } else {
      return `
        <title>${pokemonName} - Pokémon no encontrado</title>
        <meta name="description" content="El Pokémon ${pokemonName} no fue encontrado en la Pokédex" />
      `.trim();
    }
  }

  if (cleanPath === '/trainer') {
    const trainerName = data?.trainer?.name || 'Entrenador';
    const pokemonCaught = data?.trainer?.stats?.pokemonCaught || 0;
    return `
      <title>Perfil de ${trainerName} - Entrenador Pokémon</title>
      <meta name="description" content="Perfil del entrenador ${trainerName}. Ha capturado ${pokemonCaught} Pokémon y cuenta con ${data?.badges?.length || 0} medallas de gimnasio." />
      <meta property="og:title" content="Perfil del Entrenador - ${trainerName}" />
      <meta property="og:description" content="Aventura Pokémon de ${trainerName}" />
    `.trim();
  }

  return `
    <title>Página no encontrada - Pokédex</title>
    <meta name="description" content="La página solicitada no existe en esta Pokédex" />
  `.trim();
}

// Función para generar contenido adicional del head por ruta
export function generateHeadContentForRoute(pathname: string): string {
  const cleanPath = pathname.split('?')[0].split('#')[0];

  switch (cleanPath) {
    case '/':
      return `
        <link rel="preconnect" href="https://pokeapi.co">
        <link rel="dns-prefetch" href="//raw.githubusercontent.com">
        <link rel="prefetch" href="https://pokeapi.co/api/v2/pokemon?limit=20&offset=0">
      `.trim();

    case '/trainer':
      return `
        <link rel="preconnect" href="https://pokeapi.co">
      `.trim();

    default:
      if (cleanPath.startsWith('/pokemon/')) {
        return `
          <link rel="preconnect" href="https://pokeapi.co">
          <link rel="dns-prefetch" href="//raw.githubusercontent.com">
        `.trim();
      }
      return '';
  }
}