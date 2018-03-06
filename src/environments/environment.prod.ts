
import { version } from './version';

export const environment = {
  production: true,
  deployUrl: 'https://beta.evictionlab.org/tool/',
  tileBaseUrl: 'https://tiles.evictionlab.org/',
  evictorsRankingDataUrl: 'https://beta.evictionlab.org/tool/assets/MOCK_EVICTORS.csv',
  cityRankingDataUrl: 'https://s3.amazonaws.com/eviction-lab-data/rankings/cities-rankings.csv',
  stateRankingDataUrl: 'https://s3.amazonaws.com/eviction-lab-data/rankings/states-rankings.csv',
  usAverageDataUrl: 'https://s3.amazonaws.com/eviction-lab-data/avg/us.json',
  mapboxApiKey: 'pk.' +
    'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqY20zamVpcTBwb3gzM28yb292YzM3dXoifQ.' +
    'uKgAjsMd4qkJNqEtr3XyPQ',
  mapboxCountyUrl: 'https://s3.amazonaws.com/eviction-lab-data/search/counties.csv',
  downloadBaseUrl: 'https://exports.evictionlab.org',
  minYear: 2000,
  maxYear: 2016,
  appVersion: version
};
