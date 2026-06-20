import { DataListConfig } from '@/shared/ui/types/data-list-config.type';
import { citySchema } from './schemas/city.schema';
import { countrySchema } from './schemas/country.schema';
import { getCities, getCountries } from './utils/location.util';

export const LOCATION_SELECT_CONFIG: Record<'city' | 'country', DataListConfig> = {
  city: {
    items: getCities(),
    placeholder: 'Please select a city',
    trackBy: (c: unknown) => citySchema.parse(c).id,
    value: (c: unknown) => citySchema.parse(c).city,
    label: (c: unknown) => {
      const { country, city } = citySchema.parse(c);
      return `${country} - ${city}`;
    },
  },
  country: {
    items: getCountries(),
    placeholder: 'Please select a country',
    trackBy: (c: unknown) => countrySchema.parse(c).code,
    value: (c: unknown) => countrySchema.parse(c).name,
    label: (c: unknown) => countrySchema.parse(c).name,
  },
};
