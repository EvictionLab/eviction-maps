
import { version } from './version';

export const environment = {
  production: true,
  useMapbox: true,
  deployUrl: 'https://evictionlab.org/tool/',
  tileBaseUrl: 'https://tiles.evictionlab.org/2018-12-14/',
  evictorsRankingDataUrl: 'https://evictionlab.org/tool/assets/MOCK_EVICTORS.csv',
  cityRankingDataUrl: 'https://evictionlab.org/data/rankings/cities-rankings.csv',
  stateRankingDataUrl: 'https://evictionlab.org/data/rankings/states-rankings.csv',
  nationalDataUrl: 'https://evictionlab.org/data/us/national.csv',
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
      defaultUrl: 'https://kiosk.evictionlab.org/',
      langKey: 'NAV.MAP',
      langUrls : { 'es': '/map/#/2016?lang=es' }
    },
    {
      defaultUrl: 'https://kiosk.evictionlab.org/rankings',
      langKey: 'NAV.RANKINGS',
      langUrls : { 'es': '/rankings/#/evictions?lang=es' }
    },
  ],
  footerNav: [
    {
      defaultUrl: '/',
      langKey: 'NAV.MAP',
      langUrls : { 'es': '/#/2016?lang=es' }
    },
    {
      defaultUrl: '/rankings',
      langKey: 'NAV.RANKINGS',
      langUrls : { 'es': '/rankings/#/evictions?lang=es' }
    },
    {
      defaultUrl: '',
      langKey: 'NAV.ABOUT',
      langUrls : { 'es': '' }
    },
    {
      defaultUrl: '',
      langKey: 'NAV.PROBLEM',
      langUrls : { 'es': '' }
    },
    {
      defaultUrl: '',
      langKey: 'NAV.METHODS',
      langUrls : { 'es': '' }
    },
    {
      defaultUrl: '',
      langKey: 'NAV.HELP',
      langUrls : { 'es': '' }
    },
    {
      defaultUrl: '',
      langKey: 'NAV.UPDATES'
    },
    {
      defaultUrl: '',
      langKey: 'NAV.CONTACT_US',
      langUrls : { 'es': '' }
    },
    {
      defaultUrl: '',
      langKey: 'NAV.GET_DATA',
      langUrls : { 'es': '' }
    },
    {
      defaultUrl: '',
      langKey: 'NAV.DATA_MERGE',
      langUrls : { 'es': '' }
    },
    {
      defaultUrl: '',
      langKey: 'NAV.MEDIA_GUIDE'
    }
  ]
};
