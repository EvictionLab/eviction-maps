// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { version } from './version';

export const environment = {
  production: false,
  deployUrl: './',
  tileBaseUrl: 'https://tiles.evictionlab.org/',
  evictorsRankingDataUrl: './assets/MOCK_EVICTORS.csv',
  cityRankingDataUrl: 'https://staging.evictionlab.org/data/rankings/cities-rankings.csv',
  stateRankingDataUrl: 'https://staging.evictionlab.org/data/rankings/states-rankings.csv',
  usAverageDataUrl: 'https://staging.evictionlab.org/data/avg/us.json',
  mapboxApiKey: 'pk.' +
    'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqYzJoNzVxdzAwMTMzM255dmsxM2YwZWsifQ.' +
    '4et5d5nstXWM5P0JG67XEQ',
  mapboxCountyUrl: 'https://staging.evictionlab.org/data/search/counties.csv',
  downloadBaseUrl: 'https://exports-dev.evictionlab.org',
  minYear: 2000,
  maxYear: 2016,
  appVersion: version + '-dev'
};
