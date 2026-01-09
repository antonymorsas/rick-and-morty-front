import { getCharactersPage, searchCharacters, getCharacterById } from '../characters';
import type { CharactersResponse } from '@/types/api';
import type { Character } from '@/types/character';

jest.mock('rickmortyapi', () => ({
  getCharacters: jest.fn(),
  getCharacter: jest.fn(),
}));

import { getCharacters, getCharacter } from 'rickmortyapi';

const mockedGetCharacters = getCharacters as jest.MockedFunction<typeof getCharacters>;
const mockedGetCharacter = getCharacter as jest.MockedFunction<typeof getCharacter>;

// Type for error responses in mocks
type ErrorResponse = {
  status: number;
  statusMessage: string;
  data: null;
};

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

const mockCharactersResponse: CharactersResponse = {
  info: {
    count: 826,
    pages: 42,
    next: 'https://rickandmortyapi.com/api/character?page=2',
    prev: null,
  },
  results: [mockCharacter],
};

describe('characters server actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCharactersPage', () => {
    it('should return success result with characters data', async () => {
      mockedGetCharacters.mockResolvedValue({
        status: 200,
        statusMessage: 'OK',
        data: mockCharactersResponse,
      });

      const result = await getCharactersPage(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.results).toHaveLength(1);
        expect(result.data.results[0]).toEqual(mockCharacter);
      }
    });

    it('should handle API error responses', async () => {
      const errorResponse: ErrorResponse = {
        status: 500,
        statusMessage: 'Internal Server Error',
        data: null,
      };
      mockedGetCharacters.mockResolvedValue(errorResponse as unknown as Awaited<ReturnType<typeof mockedGetCharacters>>);

      const result = await getCharactersPage(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toContain('Failed to fetch characters');
      }
    });
  });

  describe('searchCharacters', () => {
    it('should return success result with search results', async () => {
      mockedGetCharacters.mockResolvedValue({
        status: 200,
        statusMessage: 'OK',
        data: mockCharactersResponse,
      });

      const result = await searchCharacters('Rick', 1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.results).toHaveLength(1);
      }
    });

    it('should handle 404 as empty results', async () => {
      const errorResponse: ErrorResponse = {
        status: 404,
        statusMessage: 'Not Found',
        data: null,
      };
      mockedGetCharacters.mockResolvedValue(errorResponse as unknown as Awaited<ReturnType<typeof mockedGetCharacters>>);

      const result = await searchCharacters('NonExistent', 1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.results).toHaveLength(0);
      }
    });
  });

  describe('getCharacterById', () => {
    it('should return success result with character data', async () => {
      mockedGetCharacter.mockResolvedValue({
        status: 200,
        statusMessage: 'OK',
        data: mockCharacter,
      });

      const result = await getCharacterById(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockCharacter);
        expect(result.data.id).toBe(1);
      }
    });

    it('should handle API error responses', async () => {
      const errorResponse: ErrorResponse = {
        status: 404,
        statusMessage: 'Not Found',
        data: null,
      };
      mockedGetCharacter.mockResolvedValue(errorResponse as unknown as Awaited<ReturnType<typeof mockedGetCharacter>>);

      const result = await getCharacterById(99999);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toContain('Failed to fetch character');
      }
    });
  });
});
