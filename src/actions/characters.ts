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
    
    if (response.status !== 200) {
      throw new Error(`Failed to search characters: ${response.statusMessage}`);
    }
    
    return successResult(response.data as CharactersResponse);
  } catch (error) {
    return errorResult(
      error instanceof Error ? error : new Error('Failed to search characters')
    );
  }
}

