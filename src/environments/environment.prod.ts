
import { version } from './version';

export const environment = {
  production: true,
  useMapbox: true,
  deployUrl: 'https://evictionlab.org/tool/',
  tileBaseUrl: 'https://tiles.evictionlab.org/',
  evictorsRankingDataUrl: 'https://evictionlab.org/tool/assets/MOCK_EVICTORS.csv',
  cityRankingDataUrl: 'https://evictionlab.org/data/rankings/cities-rankings.csv',
  stateRankingDataUrl: 'https://evictionlab.org/data/rankings/states-rankings.csv',
  usAverageDataUrl: 'https://evictionlab.org/data/avg/us.json',
  outliersDataUrl: 'https://evictionlab.org/data/cutoffs/99-percentile.json',
  mapboxApiKey: 'pk.' +
    'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqY20zamVpcTBwb3gzM28yb292YzM3dXoifQ.' +
    'uKgAjsMd4qkJNqEtr3XyPQ',
  mapboxCountyUrl: 'https://evictionlab.org/data/search/counties.csv',
  downloadBaseUrl: 'https://exports.evictionlab.org',
  minYear: 2000,
  maxYear: 2016,
  rankingsYear: 2016,
  appVersion: version,
  siteNav: [
    { url: 'https://evictionlab.org/', langKey: 'NAV.HOME' },
    { url: 'https://evictionlab.org/map', langKey: 'NAV.MAP' },
    { url: 'https://evictionlab.org/rankings', langKey: 'NAV.RANKINGS' },
    { url: 'https://evictionlab.org/about', langKey: 'NAV.ABOUT' },
    { url: 'https://evictionlab.org/why-eviction-matters', langKey: 'NAV.PROBLEM' },
    { url: 'https://evictionlab.org/methods', langKey: 'NAV.METHODS' },
    { url: 'https://evictionlab.org/help-faq', langKey: 'NAV.HELP' },
    { url: 'https://evictionlab.org/updates', langKey: 'NAV.UPDATES' }
  ],
  footerNav: [
    { url: 'https://evictionlab.org/', langKey: 'NAV.HOME' },
    { url: 'https://evictionlab.org/map', langKey: 'NAV.MAP' },
    { url: 'https://evictionlab.org/rankings', langKey: 'NAV.RANKINGS' },
    { url: 'https://evictionlab.org/about', langKey: 'NAV.ABOUT' },
    { url: 'https://evictionlab.org/why-eviction-matters', langKey: 'NAV.PROBLEM' },
    { url: 'https://evictionlab.org/methods', langKey: 'NAV.METHODS' },
    { url: 'https://evictionlab.org/help-faq', langKey: 'NAV.HELP' },
    { url: 'https://evictionlab.org/updates', langKey: 'NAV.UPDATES' },
    { url: 'https://evictionlab.org/contact', langKey: 'NAV.CONTACT_US' },
    { url: 'https://evictionlab.org/get-the-data', langKey: 'NAV.GET_DATA' },
    { url: 'https://evictionlab.org/data-merge', langKey: 'NAV.DATA_MERGE' }
  ]
};
