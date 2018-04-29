
import { version } from './version';

export const environment = {
  production: true,
  useMapbox: true,
  deployUrl: 'https://evictionlab.org/tool/',
  tileBaseUrl: 'https://tiles.evictionlab.org/',
  evictorsRankingDataUrl: 'https://evictionlab.org/tool/assets/MOCK_EVICTORS.csv',
  cityRankingDataUrl: 'https://evictionlab.org/data/rankings/cities-rankings.csv',
  stateRankingDataUrl: 'https://evictionlab.org/data/rankings/states-rankings.csv',
  nationalDataUrl: 'https://eviction-lab-data-downloads.s3.amazonaws.com/US/national.csv',
  outliersDataUrl: 'https://evictionlab.org/data/cutoffs/99-percentile.json',
  mapboxApiKey: 'pk.' +
    'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqY20zamVpcTBwb3gzM28yb292YzM3dXoifQ.' +
    'uKgAjsMd4qkJNqEtr3XyPQ',
  mapboxCountyUrl: 'https://evictionlab.org/data/search/counties.csv',
  staticSearchUrl: 'https://evictionlab.org/data/search/locations.csv',
  downloadBaseUrl: 'https://exports.evictionlab.org',
  minYear: 2000,
  maxYear: 2016,
  rankingsYear: 2016,
  appVersion: version,
  siteNav: [
    {
      defaultUrl: 'https://evictionlab.org/',
      langKey: 'NAV.HOME',
      langUrls : { 'es': 'https://evictionlab.org/es' }
    },
    {
      defaultUrl: 'https://evictionlab.org/map',
      langKey: 'NAV.MAP',
      langUrls : { 'es': 'https://staging.evictionlab.org/map/#/2016?lang=es' }
    },
    {
      defaultUrl: 'https://evictionlab.org/rankings',
      langKey: 'NAV.RANKINGS',
      langUrls : { 'es': 'https://evictionlab.org/rankings/#/evictions?lang=es' }
    },
    {
      defaultUrl: 'https://evictionlab.org/about',
      langKey: 'NAV.ABOUT',
      langUrls : { 'es': 'https://evictionlab.org/es/about' }
    },
    {
      defaultUrl: 'https://evictionlab.org/why-eviction-matters',
      langKey: 'NAV.PROBLEM',
      langUrls : { 'es': 'https://evictionlab.org/es/why-eviction-matters' }
    },
    {
      defaultUrl: 'https://evictionlab.org/methods',
      langKey: 'NAV.METHODS',
      langUrls : { 'es': 'https://evictionlab.org/es/methods' }
    },
    {
      defaultUrl: 'https://evictionlab.org/help-faq',
      langKey: 'NAV.HELP',
      langUrls : { 'es': 'https://evictionlab.org/es/help-faq' }
    },
    {
      defaultUrl: 'https://evictionlab.org/updates',
      langKey: 'NAV.UPDATES'
    }
  ],
  footerNav: [
    {
      defaultUrl: 'https://evictionlab.org/',
      langKey: 'NAV.HOME',
      langUrls : { 'es': 'https://evictionlab.org/es' }
    },
    {
      defaultUrl: 'https://evictionlab.org/map',
      langKey: 'NAV.MAP',
      langUrls : { 'es': 'https://staging.evictionlab.org/map/#/2016?lang=es' }
    },
    {
      defaultUrl: 'https://evictionlab.org/rankings',
      langKey: 'NAV.RANKINGS',
      langUrls : { 'es': 'https://evictionlab.org/rankings/#/evictions?lang=es' }
    },
    {
      defaultUrl: 'https://evictionlab.org/about',
      langKey: 'NAV.ABOUT',
      langUrls : { 'es': 'https://evictionlab.org/es/about' }
    },
    {
      defaultUrl: 'https://evictionlab.org/why-eviction-matters',
      langKey: 'NAV.PROBLEM',
      langUrls : { 'es': 'https://evictionlab.org/es/why-eviction-matters' }
    },
    {
      defaultUrl: 'https://evictionlab.org/methods',
      langKey: 'NAV.METHODS',
      langUrls : { 'es': 'https://evictionlab.org/es/methods' }
    },
    {
      defaultUrl: 'https://evictionlab.org/help-faq',
      langKey: 'NAV.HELP',
      langUrls : { 'es': 'https://evictionlab.org/es/help-faq' }
    },
    {
      defaultUrl: 'https://evictionlab.org/updates',
      langKey: 'NAV.UPDATES'
    },
    {
      defaultUrl: 'https://evictionlab.org/contact',
      langKey: 'NAV.CONTACT_US',
      langUrls : { 'es': 'https://evictionlab.org/es/contact' }
    },
    {
      defaultUrl: 'https://evictionlab.org/get-the-data',
      langKey: 'NAV.GET_DATA',
      langUrls : { 'es': 'https://evictionlab.org/es/get-the-data' }
    },
    {
      defaultUrl: 'https://evictionlab.org/data-merge',
      langKey: 'NAV.DATA_MERGE',
      langUrls : { 'es': 'https://evictionlab.org/es/data-merge' }
    },
    {
      defaultUrl: 'https://evictionlab.org/updates/media/media-guide',
      langKey: 'NAV.MEDIA_GUIDE'
    }
  ]
};
