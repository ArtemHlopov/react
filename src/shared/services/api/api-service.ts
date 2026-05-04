import type { PokemonListResponse, PokemonDetails } from '../../models';

class ApiService {
  offset: number = 0;
  limit: number = 10;

  async getItemsList(): Promise<PokemonListResponse> {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`
    );
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  }

  async getPokemonDetails(url: string): Promise<PokemonDetails> {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch Pokemon details');
    return await response.json();
  }

  getPokemonLink(name: string): string {
    return `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
  }

  setOffsetValue(value: number) {
    this.offset = value;
  }

  setLimitValue(value: number) {
    this.limit = value;
  }
}

export const apiService = new ApiService();
