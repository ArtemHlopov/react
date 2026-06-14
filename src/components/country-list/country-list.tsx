import { memo, useMemo } from 'react';
import type { Country } from '../../types';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';
import { List, useDynamicRowHeight } from 'react-window';
import { CountryWindowRow, type CountryWindowRowProps } from './country-window-row';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const filteredCountries = useMemo(() => {
      const filtered = countries.filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
        return matchesSearch && matchesRegion;
      });

      if (sortField === 'name') {
        return filtered.sort((a, b) =>
          sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
        );
      }

      const populationCache = new Map(
        filtered.map((country) => [
          country.id,
          getPopulationForYear(createYearDataMap(country.data), selectedYear) || 0,
        ])
      );

      return filtered.sort((a, b) => {
        const popA = populationCache.get(a.id) ?? 0;
        const popB = populationCache.get(b.id) ?? 0;
        return sortOrder === 'asc' ? popA - popB : popB - popA;
      });
    }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

    const dynamicRowHeight = useDynamicRowHeight({
      defaultRowHeight: 280,
    });

    const countryWindowProps = useMemo<CountryWindowRowProps>(
      () => ({
        countries: filteredCountries || [],
        selectedYear,
        selectedColumns,
      }),
      [filteredCountries, selectedYear, selectedColumns]
    );

    return (
      <div className={styles.countryList}>
        <List
          rowComponent={CountryWindowRow}
          rowCount={filteredCountries.length}
          rowHeight={dynamicRowHeight}
          rowProps={countryWindowProps}
          overscanCount={3}
        ></List>
      </div>
    );
  }
);
