
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
      defaultUrl: 'https://evictionlab.org/',
      langKey: 'NAV.HOME',
      langUrls : { 'es': 'https://evictionlab.org/es' }
    },
    {
      defaultUrl: '',
      langKey: 'NAV.DATA',
      children: [
        {
          defaultUrl: 'https://evictionlab.org/eviction-tracking',
          langKey: 'NAV.TRACKING'
        },
        {
          defaultUrl: 'https://evictionlab.org/covid-eviction-policies',
          langKey: 'NAV.DATABASE'
        },
        {
          defaultUrl: 'https://evictionlab.org/covid-policy-scorecard',
          langKey: 'NAV.SCORECARD'
        }
      ]
    },
    {
      defaultUrl: '',
      langKey: 'NAV.FINDINGS',
      children: [
        {
          defaultUrl: 'https://evictionlab.org/updates',
          langKey: 'NAV.UPDATES',
          children: [
            {
              defaultUrl: 'https://evictionlab.org/updates/blog',
              langKey: 'NAV.BLOG'
            },
            {
              defaultUrl: 'https://evictionlab.org/updates/research',
              langKey: 'NAV.RESEARCH'
            },
            {
              defaultUrl: 'https://evictionlab.org/updates/reporting',
              langKey: 'NAV.REPORTING'
            }
          ]
        }
      ]
    },
    {
      defaultUrl: '',
      langKey: 'NAV.NATIONAL',
      children: [
        {
          defaultUrl: 'https://evictionlab.org/map',
          langKey: 'NAV.MAP',
          langUrls : { 'es': 'https://evictionlab.org/map/#/2016?lang=es' }
        },
        {
          defaultUrl: 'https://evictionlab.org/rankings',
          langKey: 'NAV.RANKINGS',
          langUrls : { 'es': 'https://evictionlab.org/rankings/#/evictions?lang=es' }
        }
      ]
    },
    {
      defaultUrl: '',
      langKey: 'NAV.ABOUT',
      children: [
        {
          defaultUrl: 'https://evictionlab.org/about',
          langKey: 'NAV.MISSION',
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
        }
      ]
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
      defaultUrl: 'https://evictionlab.org/covid-policy-scorecard',
      langKey: 'NAV.SCORECARD',
      langUrls: { 'es': 'https://evictionlab.org/es/covid-policy-scorecard' }
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
      defaultUrl: 'https://evictionlab.org/data-request',
      langKey: 'NAV.DATA_MERGE',
      langUrls : { 'es': 'https://evictionlab.org/es/data-request' }
    },
    {
      defaultUrl: 'https://evictionlab.org/media-guide',
      langKey: 'NAV.MEDIA_GUIDE'
    }
  ]
};
