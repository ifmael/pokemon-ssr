export interface TrainerProfile {
  id: string;
  name: string;
  title: string;
  region: string;
  startDate: string;
  trainerClass: string;
  stats: {
    pokemonCaught: number;
    pokemonSeen: number;
    gymsDefeated: number;
    favoritePokemon: string;
  };
}

export interface TrainerBadge {
  name: string;
  gym: string;
  dateEarned: string;
  type: string;
}

export interface TrainerProfilePageData {
  trainer: TrainerProfile;
  badges: TrainerBadge[];
    recentActivity: string[];
    achievements: string[];
}

export interface TrainerProfilePageProps {
  serverData?: TrainerProfilePageData;
}