import { PokédexPageData } from './types';

export async function getServerSideProps(url?: string): Promise<{ props: PokédexPageData }> {
  console.log('🏠 getServerSideProps de PokédexPage ejecutándose...');

  try {
    const urlParams = new URLSearchParams(url?.split('?')[1] || '');
    const page = parseInt(urlParams.get('page') || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon: any) => {
        try {
          const detailResponse = await fetch(pokemon.url);
          const detail = await detailResponse.json();

          return {
            name: pokemon.name,
            url: pokemon.url,
            id: detail.id,
            sprite: detail.sprites.front_default || 'https://via.placeholder.com/96x96?text=?',
            types: detail.types.map((t: any) => t.type.name)
          };
        } catch (error) {
          console.error(`Error obteniendo detalles de ${pokemon.name}:`, error);
          return {
            name: pokemon.name,
            url: pokemon.url,
            id: 0,
            sprite: 'https://via.placeholder.com/96x96?text=?',
            types: ['unknown']
          };
        }
      })
    );

    return {
      props: {
        pokemonList: pokemonDetails,
        totalCount: data.count,
        page: page,
        hasNext: !!data.next,
        hasPrevious: !!data.previous
      }
    };
  } catch (error) {
    console.error('❌ Error obteniendo datos de la PokéAPI:', error);

    return {
      props: {
        pokemonList: [],
        totalCount: 0,
        page: 1,
        hasNext: false,
        hasPrevious: false
      }
    };
  }
}