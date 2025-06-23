import { TrainerProfilePageData } from './types';

export async function getServerSideProps(): Promise<{ props: TrainerProfilePageData }> {
  console.log('👤 getServerSideProps de TrainerProfilePage ejecutándose...');

  await new Promise(resolve => setTimeout(resolve, 400));

  const trainerId = 'trainer_ash_001';

  return {
    props: {
      trainer: {
        id: trainerId,
        name: 'Ash Ketchum',
        title: 'Maestro Pokémon en Entrenamiento',
        region: 'Kanto',
        startDate: '1 de abril, 1997',
        trainerClass: 'Entrenador Pokémon',
        stats: {
          pokemonCaught: 89,
          pokemonSeen: 156,
          gymsDefeated: 6,
          favoritePokemon: 'Pikachu'
        }
      },
      badges: [
        { name: 'Medalla Roca', gym: 'Gimnasio de Ciudad Plateada', dateEarned: '5 abr 1997', type: 'rock' },
        { name: 'Medalla Cascada', gym: 'Gimnasio de Ciudad Celeste', dateEarned: '12 abr 1997', type: 'water' },
        { name: 'Medalla Trueno', gym: 'Gimnasio de Ciudad Carmin', dateEarned: '20 abr 1997', type: 'electric' },
        { name: 'Medalla Arcoíris', gym: 'Gimnasio de Ciudad Celadon', dateEarned: '28 abr 1997', type: 'grass' },
        { name: 'Medalla Alma', gym: 'Gimnasio de Ciudad Fucsia', dateEarned: '15 may 1997', type: 'poison' },
        { name: 'Medalla Pantano', gym: 'Gimnasio de Ciudad Azafrán', dateEarned: '25 may 1997', type: 'psychic' }
      ],
      recentActivity: [
        'Capturó un Pidgey salvaje hace 2 horas',
        'Derrotó al Entrenador Joey hace 5 horas',
        'Visitó el Centro Pokémon hace 1 día',
        'Exploró la Ruta 25 hace 2 días',
        'Intercambió un Pokémon hace 3 días'
      ],
      achievements: [
        '🥇 Primera captura del día - 15 días seguidos',
        '🎯 Cazador de tipos - Capturó todos los tipos básicos',
        '🏃‍♂️ Caminante incansable - 10,000 pasos en un día',
        '💪 Entrenador dedicado - 50 batallas ganadas',
        '🔍 Explorador - Visitó 20 ubicaciones diferentes'
      ]
    }
  };
}