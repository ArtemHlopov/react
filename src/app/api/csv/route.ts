import { NextResponse, type NextRequest } from 'next/server';
import type { PokemonListResponseResult } from '../../../shared/models';

export async function POST(request: NextRequest) {
  const pokemons: PokemonListResponseResult[] = await request.json();
  const headers = ['Name', 'Details URL'];
  const rows = pokemons.map((p) => `"${p.name || 'Unknown'}","${p.url || ''}"`);
  const csvContent = [headers.join(','), ...rows].join('\n');
  const filename = `${pokemons.length}_items.csv`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8;',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
