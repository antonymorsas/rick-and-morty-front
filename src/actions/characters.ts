'use server';

import { getCharacters } from 'rickmortyapi';
import type { CharactersResponse } from '@/types/api';
import { successResult, errorResult } from '@/lib/core/errors/result';

export async function getCharactersPage(
  page: number
): Promise<import('@/lib/core/errors/result').ActionResult<CharactersResponse>> {
  try {
    const response = await getCharacters({ page });
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch characters: ${response.statusMessage}`);
    }
    
    return successResult(response.data as CharactersResponse);
  } catch (error) {
    return errorResult(
      error instanceof Error ? error : new Error('Failed to fetch characters')
    );
  }
}

export async function searchCharacters(
  name: string,
  page: number = 1
): Promise<import('@/lib/core/errors/result').ActionResult<CharactersResponse>> {
  try {
    const response = await getCharacters({ name, page });
    
    // If the search returns 404 (Not Found), treat it as a successful empty result
    // This is a valid state when no characters match the search query
    if (response.status === 404) {
      return successResult({
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null,
        },
        results: [],
      });
    }
    
    if (response.status !== 200) {
      throw new Error(`Failed to search characters: ${response.statusMessage}`);
    }
    
    return successResult(response.data as CharactersResponse);
  } catch (error) {
    // Check if it's a 404 error (Not Found) - treat as empty result, not an error
    // The API returns 404 when no characters match the search query
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes('404') || 
      errorMessage.includes('Not Found') ||
      errorMessage.toLowerCase().includes('not found')
    ) {
      return successResult({
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null,
        },
        results: [],
      });
    }
    
    return errorResult(
      error instanceof Error ? error : new Error('Failed to search characters')
    );
  }
}

