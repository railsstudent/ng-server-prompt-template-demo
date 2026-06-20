import { getStringValue } from '@/core/form-generator/utils/value-transformer.util';
import { City } from '@/core/location/types/city.type';
import { Country } from '@/core/location/types/country.type';
import cityList from '@/public/cities.json';
import countryList from '@/public/countries.json';

export function getCities(): City[] {
  return cityList.results;
}

export function getCountries(): Country[] {
  return countryList.countries;
}

export function findCityByName(name: string | string[] | number | number[]): City | undefined {
  const cityValue = getStringValue(name);
  return cityList.results.find((c) => c.city === cityValue);
}

export function findCountry(value: string | string[] | number | number[]): Country | undefined {
  const countryValue = getStringValue(value);
  return countryList.countries.find((c) => c.name === countryValue || c.code === countryValue);
}
