'use server';

import { API_BASE_URL } from '@/types/api';
import type { CharactersResponse } from '@/types/api';
import { successResult, errorResult } from '@/lib/core/errors/result';

export async function getCharactersPage(
  page: number
): Promise<import('@/lib/core/errors/result').ActionResult<CharactersResponse>> {
  try {
    const url = `${API_BASE_URL}/character?page=${page}`;
    const response = await fetch(url, {
      next: { revalidate: 60 }, 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch characters: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data)
    return successResult(data);
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
    const url = `${API_BASE_URL}/character?name=${encodeURIComponent(name)}&page=${page}`;
    const response = await fetch(url, {
      next: { revalidate: 60 }, 
    });

    if (!response.ok) {
      throw new Error(`Failed to search characters: ${response.statusText}`);
    }

    const data = await response.json();
    return successResult(data);
  } catch (error) {
    return errorResult(
      error instanceof Error ? error : new Error('Failed to search characters')
    );
  }
}

