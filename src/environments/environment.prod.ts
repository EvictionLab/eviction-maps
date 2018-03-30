
import { version } from './version';

export const environment = {
  production: true,
  deployUrl: 'https://beta.evictionlab.org/tool/',
  tileBaseUrl: 'https://tiles.evictionlab.org/',
  evictorsRankingDataUrl: 'https://beta.evictionlab.org/tool/assets/MOCK_EVICTORS.csv',
  cityRankingDataUrl: 'https://beta.evictionlab.org/data/rankings/cities-rankings.csv',
  stateRankingDataUrl: 'https://beta.evictionlab.org/data/rankings/states-rankings.csv',
  usAverageDataUrl: 'https://beta.evictionlab.org/data/avg/us.json',
  mapboxApiKey: 'pk.' +
    'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqY20zamVpcTBwb3gzM28yb292YzM3dXoifQ.' +
    'uKgAjsMd4qkJNqEtr3XyPQ',
  mapboxCountyUrl: 'https://beta.evictionlab.org/data/search/counties.csv',
  downloadBaseUrl: 'https://exports.evictionlab.org',
  minYear: 2000,
  maxYear: 2016,
  rankingsYear: 2015,
  appVersion: version,
  siteNav: [
    { url: 'https://beta.evictionlab.org/', langKey: 'NAV.HOME' },
    { url: 'https://beta.evictionlab.org/map', langKey: 'NAV.MAP' },
    { url: 'https://beta.evictionlab.org/rankings', langKey: 'NAV.RANKINGS' },
    { url: 'https://beta.evictionlab.org/about', langKey: 'NAV.ABOUT' },
    { url: 'https://beta.evictionlab.org/why-eviction-matters', langKey: 'NAV.PROBLEM' },
    { url: 'https://beta.evictionlab.org/methods', langKey: 'NAV.METHODS' },
    { url: 'https://beta.evictionlab.org/help-faq', langKey: 'NAV.HELP' },
    { url: 'https://beta.evictionlab.org/updates', langKey: 'NAV.UPDATES' }
  ]
};
