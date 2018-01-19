export const environment = {
  production: true,
  tileBaseUrl: 'https://tiles.evictionlab.org/',
  cityRankingDataUrl: 'https://s3.amazonaws.com/eviction-lab-data/rankings/city-rankings.csv',
  usAverageDataUrl: 'https://s3.amazonaws.com/eviction-lab-data/avg/us.json',
  mapboxKey: 'pk.' +
    'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqY20zamVpcTBwb3gzM28yb292YzM3dXoifQ.' +
    'uKgAjsMd4qkJNqEtr3XyPQ',
  mapboxCountyUrl: 'https://s3.amazonaws.com/eviction-lab-data/search/counties.csv',
  downloadBaseUrl: 'https://exports.evictionlab.org',
  minYear: 2000,
  maxYear: 2016
};
