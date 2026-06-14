import type { RowComponentProps } from 'react-window';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';

export type CountryWindowRowProps = {
  countries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

export const CountryWindowRow = ({
  index,
  style,
  countries,
  selectedYear,
  selectedColumns,
}: RowComponentProps<CountryWindowRowProps>) => (
  <div style={style}>
    {countries[index] && (
      <CountryCard
        country={countries[index]}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    )}
  </div>
);
