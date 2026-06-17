const fs = require('fs');
const path = require('path');

const url =
  'https://raw.githubusercontent.com/railsstudent/cities-json/refs/heads/master/cities500.json';
fetch(url)
  .then((response) => {
    if (!response.ok) {
      console.error('Failed to fetch cities data from GitHub. Status:', response.status);
      process.exit(1);
    }
    return response.json();
  })
  .then((data) => {
    const countries = require('../../public/countries.json').countries;
    const minPopulation = 500000;
    const seen = [];
    const pairs = [];
    for (const item of data) {
      const { id, name, country, pop } = item;
      if (seen.includes(id)) {
        continue;
      }
      seen.push(id);
      const population = parseInt(pop);
      const countryName = countries.find((c) => c.code === country)?.name || 'Unknown';
      if (population >= minPopulation) {
        const pair = {
          id,
          city: name,
          country: countryName,
          population,
        };
        pairs.push(pair);
      }
    }

    const sortedCountriesAndCities = pairs.sort(
      (a, b) => a.country.localeCompare(b.country) || a.city.localeCompare(b.city),
    );
    const result = {
      results: sortedCountriesAndCities,
    };
    const targetPath = path.resolve(process.cwd(), 'public/cities.json');

    fs.writeFileSync(targetPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(
      '✅ ' +
        pairs.length +
        ' cities with population greater than ' +
        minPopulation +
        ' have been processed.',
    );
    console.log('✅ Firebase configuration generated successfully at ' + targetPath);
  })
  .catch((error) => {
    console.error('Error fetching cities data from GitHub:', error);
    process.exit(1);
  });
