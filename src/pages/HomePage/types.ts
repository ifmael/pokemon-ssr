export interface Pokemon {
  name: string;
  url: string;
  id: number;
  sprite: string;
  types: string[];
}

export interface PokédexPageData {
  pokemonList: Pokemon[];
  totalCount: number;
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PokédexPageProps {
  serverData?: PokédexPageData;
}