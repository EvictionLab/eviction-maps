// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { version } from './version';

export const environment = {
  production: false,
  deployUrl: './',
  useMapbox: true,
  tileBaseUrl: 'https://staging-tiles.evictionlab.org/2019-10-23/',
  evictorsRankingDataUrl: './assets/MOCK_EVICTORS.csv',
  // tslint:disable-next-line:max-line-length
  cityRankingDataUrl: 'https://s3.amazonaws.com/eviction-lab-tool-data/data/rankings/cities-rankings.csv',
  stateRankingDataUrl: 'https://s3.amazonaws.com/eviction-lab-tool-data/data/rankings/states-rankings.csv',
  nationalDataUrl: 'https://s3.amazonaws.com/eviction-lab-tool-data/data/us/national.csv',
  // tslint:disable-next-line:max-line-length
  outliersDataUrl: 'https://s3.amazonaws.com/eviction-lab-tool-data/data/cutoffs/99-percentile.json',
  mapboxApiKey: 'pk.' +
    'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqYzJoNzVxdzAwMTMzM255dmsxM2YwZWsifQ.' +
    '4et5d5nstXWM5P0JG67XEQ',
  mapboxCountyUrl: 'https://s3.amazonaws.com/eviction-lab-tool-data/data/search/counties.csv',
  staticSearchUrl: 'https://staging.evictionlab.org/data/search/locations.csv',
  downloadBaseUrl: 'https://exports-dev.evictionlab.org',
  minYear: 2000,
  maxYear: 2016,
  rankingsYear: 2016,
  appVersion: version + '-dev',
  siteNav: [
    {
      defaultUrl: '/',
      langKey: 'NAV.HOME',
      langUrls: { 'es': '/es' }
    },
    {
      defaultUrl: '/',
      langKey: 'NAV.MAP',
      langUrls: { 'es': '/#/2016?lang=es' }
    },
    {
      defaultUrl: '/#/evictions',
      langKey: 'NAV.RANKINGS',
      langUrls: { 'es': '/#/evictions?lang=es' }
    },
    {
      defaultUrl: '/covid-policy-scorecard',
      langKey: 'NAV.SCORECARD',
      langUrls: { 'es': '/es/covid-policy-scorecard' }
    },
    {
      defaultUrl: '/about',
      langKey: 'NAV.ABOUT',
      langUrls: { 'es': '/es/about' }
    },
    {
      defaultUrl: '/why-eviction-matters',
      langKey: 'NAV.PROBLEM',
      langUrls: { 'es': '/es/why-eviction-matters' }
    },
    {
      defaultUrl: '/methods',
      langKey: 'NAV.METHODS',
      langUrls: { 'es': '/es/methods' }
    },
    {
      defaultUrl: '/help-faq',
      langKey: 'NAV.HELP',
      langUrls: { 'es': '/es/help-faq' }
    },
    {
      defaultUrl: '/updates',
      langKey: 'NAV.UPDATES',
      langUrls: { 'es': '/es/updates' }
    }
  ],
  footerNav: [
    {
      defaultUrl: '/',
      langKey: 'NAV.HOME',
      langUrls: { 'es': '/es' }
    },
    {
      defaultUrl: '/',
      langKey: 'NAV.MAP',
      langUrls: { 'es': '/#/2016?lang=es' }
    },
    {
      defaultUrl: '/#/evictions',
      langKey: 'NAV.RANKINGS',
      langUrls: { 'es': '/#/evictions?lang=es' }
    },
    {
      defaultUrl: '/covid-policy-scorecard',
      langKey: 'NAV.SCORECARD',
      langUrls: { 'es': '/es/covid-policy-scorecard' }
    },
    {
      defaultUrl: '/about',
      langKey: 'NAV.ABOUT',
      langUrls: { 'es': '/es/about' }
    },
    {
      defaultUrl: '/why-eviction-matters',
      langKey: 'NAV.PROBLEM',
      langUrls: { 'es': '/es/why-eviction-matters' }
    },
    {
      defaultUrl: '/methods',
      langKey: 'NAV.METHODS',
      langUrls: { 'es': '/es/methods' }
    },
    {
      defaultUrl: '/help-faq',
      langKey: 'NAV.HELP',
      langUrls: { 'es': '/es/help-faq' }
    },
    {
      defaultUrl: '/updates',
      langKey: 'NAV.UPDATES',
      langUrls: { 'es': '/es/updates' }
    },
    {
      defaultUrl: '/contact',
      langKey: 'NAV.CONTACT_US',
      langUrls: { 'es': '/es/contact' }
    },
    {
      defaultUrl: '/get-the-data',
      langKey: 'NAV.GET_DATA',
      langUrls: { 'es': '/es/get-the-data' }
    },
    {
      defaultUrl: '/data-request',
      langKey: 'NAV.DATA_MERGE',
      langUrls: { 'es': '/es/data-request' }
    },
    {
      defaultUrl: '/media-guide/',
      langKey: 'NAV.MEDIA_GUIDE',
      langUrls: { 'es': '/es/media-guide/' }
    }
  ]
};
