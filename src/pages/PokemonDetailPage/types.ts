export interface PokemonStat {
  name: string;
  value: number;
  maxValue: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
  description?: string;
}

export interface PokemonMove {
  name: string;
  level: number;
  method: string;
}

export interface PokemonDetailData {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  sprites: {
    front_default: string;
    front_shiny: string;
    back_default: string;
    back_shiny: string;
  };
  moves: PokemonMove[];
  species: {
    description: string;
    habitat: string;
    generation: string;
  };
}

export interface PokemonDetailPageProps {
  serverData?: PokemonDetailData;
}