import { PokemonDetailData, PokemonMove } from './types';

export async function getServerSideProps(url?: string): Promise<{ props: PokemonDetailData | null }> {
  console.log('🔍 getServerSideProps de PokemonDetailPage ejecutándose...');

  try {
    const pathParts = url?.split('/') || [];
    const pokemonName = pathParts[pathParts.length - 1];

    if (!pokemonName) {
      throw new Error('No se proporcionó nombre de Pokémon');
    }

    console.log(`🎯 Buscando datos para: ${pokemonName}`);

    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    if (!pokemonResponse.ok) {
      throw new Error(`Pokémon ${pokemonName} no encontrado`);
    }
    const pokemonData = await pokemonResponse.json();

    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();

    const description = speciesData.flavor_text_entries
      .find((entry: any) => entry.language.name === 'es')?.flavor_text ||
      speciesData.flavor_text_entries
      .find((entry: any) => entry.language.name === 'en')?.flavor_text ||
      'Descripción no disponible';

    const abilitiesWithDescriptions = await Promise.all(
      pokemonData.abilities.map(async (abilityData: any) => {
        try {
          const abilityResponse = await fetch(abilityData.ability.url);
          const abilityDetail = await abilityResponse.json();

          const abilityDescription = abilityDetail.flavor_text_entries
            .find((entry: any) => entry.language.name === 'es')?.flavor_text ||
            abilityDetail.flavor_text_entries
            .find((entry: any) => entry.language.name === 'en')?.flavor_text ||
            '';

          return {
            name: abilityData.ability.name,
            isHidden: abilityData.is_hidden,
            description: abilityDescription.replace(/\n/g, ' ')
          };
        } catch {
          return {
            name: abilityData.ability.name,
            isHidden: abilityData.is_hidden,
            description: ''
          };
        }
      })
    );

    const maxStats = { hp: 255, attack: 190, defense: 230, 'special-attack': 194, 'special-defense': 230, speed: 200 };
    const stats = pokemonData.stats.map((stat: any) => ({
      name: stat.stat.name,
      value: stat.base_stat,
      maxValue: maxStats[stat.stat.name as keyof typeof maxStats] || 255
    }));

    const movesByMethod: { [key: string]: PokemonMove[] } = {};
    pokemonData.moves.forEach((moveData: any) => {
      moveData.version_group_details.forEach((versionDetail: any) => {
        const method = versionDetail.move_learn_method.name;
        if (!movesByMethod[method]) {
          movesByMethod[method] = [];
        }
        if (movesByMethod[method].length < 20) {
          movesByMethod[method].push({
            name: moveData.move.name,
            level: versionDetail.level_learned_at,
            method: method
          });
        }
      });
    });

    const allMoves = Object.values(movesByMethod).flat();

    return {
      props: {
        id: pokemonData.id,
        name: pokemonData.name,
        height: pokemonData.height,
        weight: pokemonData.weight,
        types: pokemonData.types.map((t: any) => t.type.name),
        abilities: abilitiesWithDescriptions,
        stats: stats,
        sprites: {
          front_default: pokemonData.sprites.front_default || '',
          front_shiny: pokemonData.sprites.front_shiny || '',
          back_default: pokemonData.sprites.back_default || '',
          back_shiny: pokemonData.sprites.back_shiny || ''
        },
        moves: allMoves,
        species: {
          description: description.replace(/\n/g, ' '),
          habitat: speciesData.habitat?.name || 'desconocido',
          generation: speciesData.generation?.name || 'desconocida'
        }
      }
    };
  } catch (error) {
    console.error('❌ Error obteniendo datos del Pokémon:', error);
    return { props: null };
  }
}