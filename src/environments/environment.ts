// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { version } from './version';

export const environment = {
  production: false,
  tileBaseUrl: 'https://tiles.evictionlab.org/',
  cityRankingDataUrl: 'https://s3.amazonaws.com/eviction-lab-data/rankings/cities-rankings.csv',
  stateRankingDataUrl: 'https://s3.amazonaws.com/eviction-lab-data/rankings/states-rankings.csv',
  usAverageDataUrl: 'https://s3.amazonaws.com/eviction-lab-data/avg/us.json',
  mapboxApiKey: 'pk.' +
    'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqYzJoNzVxdzAwMTMzM255dmsxM2YwZWsifQ.' +
    '4et5d5nstXWM5P0JG67XEQ',
  mapboxCountyUrl: 'https://s3.amazonaws.com/eviction-lab-data/search/counties.csv',
  downloadBaseUrl: 'https://exports-dev.evictionlab.org',
  minYear: 2000,
  maxYear: 2016,
  appVersion: version + '-dev'
};
