export interface LocationReference {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: LocationReference;
  location: LocationReference;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

