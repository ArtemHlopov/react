export interface FilterProps extends CustomComponentProps {
  filter: string;
  onFilterChange?: Callback;
}

export interface PaginationProps extends CustomComponentProps {
  total: number | string;
  next: string | null;
  previous: string | null;
  disabled: boolean;
  onLimitChange?: Callback;
  onOffsetChange?: Callback;
}

export type CustomComponentProps = Record<string, unknown>;

export type Callback = (value?: unknown) => void;

export interface PokemonListResponse {
  count: number | string;
  next: string | null;
  previous: string | null;
  results: PokemonListResponseResult[];
}

export interface PokemonListResponseResult {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites?: {
    front_default: string | null;
    other?: PokemonSpritesOtherInfo;
  };
  types?: PokemonType[];
}

export interface PokemonType {
  slot: number;
  type: PokemonTypeDetails;
}

export interface PokemonTypeDetails {
  name: string;
  url: string;
}

export interface PokemonSpritesOtherInfo {
  'official-artwork'?: PokemonSpritesInfoCategoryDetailsType;
  home?: PokemonSpritesInfoCategoryDetailsType;
  dream_world?: PokemonSpritesInfoCategoryDetailsType;
}

export interface PokemonSpritesInfoCategoryDetails {
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
}

export type PokemonSpritesInfoCategoryDetailsType =
  Partial<PokemonSpritesInfoCategoryDetails>;
