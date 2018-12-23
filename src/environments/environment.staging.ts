// Staging should use prod mode, but different specifics
import { version } from './version';

export const environment = {
    production: true,
    useMapbox: true,
    deployUrl: 'https://staging.evictionlab.org/tool/',
    tileBaseUrl: 'https://staging-tiles.evictionlab.org/2018-12-14/',
    evictorsRankingDataUrl: 'https://staging.evictionlab.org/tool/assets/MOCK_EVICTORS.csv',
    cityRankingDataUrl: 'https://staging.evictionlab.org/data/rankings/cities-rankings.csv',
    stateRankingDataUrl: 'https://staging.evictionlab.org/data/rankings/states-rankings.csv',
    nationalDataUrl: 'https://staging.evictionlab.org/data/us/national.csv',
    outliersDataUrl: 'https://staging.evictionlab.org/data/cutoffs/99-percentile.json',
    mapboxApiKey: 'pk.' +
        'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqYzJoNzVxdzAwMTMzM255dmsxM2YwZWsifQ.' +
        '4et5d5nstXWM5P0JG67XEQ',
    mapboxCountyUrl: 'https://staging.evictionlab.org/data/search/counties.csv',
    staticSearchUrl: 'https://staging.evictionlab.org/data/search/locations.csv',
    downloadBaseUrl: 'https://exports-dev.evictionlab.org',
    minYear: 2000,
    maxYear: 2016,
    rankingsYear: 2016,
    appVersion: version + '-staging',
    siteNav: [
      {
        defaultUrl: 'https://staging.evictionlab.org/',
        langKey: 'NAV.HOME',
        langUrls : { 'es': 'https://staging.evictionlab.org/es' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/map',
        langKey: 'NAV.MAP',
        langUrls : { 'es': 'https://staging.evictionlab.org/map/#/2016?lang=es' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/rankings',
        langKey: 'NAV.RANKINGS',
        langUrls : { 'es': 'https://staging.evictionlab.org/rankings/#/evictions?lang=es' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/about',
        langKey: 'NAV.ABOUT',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/about' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/why-eviction-matters',
        langKey: 'NAV.PROBLEM',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/why-eviction-matters' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/methods',
        langKey: 'NAV.METHODS',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/methods' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/help-faq',
        langKey: 'NAV.HELP',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/help-faq' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/updates',
        langKey: 'NAV.UPDATES'
      }
    ],
    footerNav: [
      {
        defaultUrl: 'https://staging.evictionlab.org/',
        langKey: 'NAV.HOME',
        langUrls : { 'es': 'https://staging.evictionlab.org/es' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/map',
        langKey: 'NAV.MAP',
        langUrls : { 'es': 'https://staging.evictionlab.org/map/#/2016?lang=es' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/rankings',
        langKey: 'NAV.RANKINGS',
        langUrls : { 'es': 'https://staging.evictionlab.org/rankings/#/evictions?lang=es' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/about',
        langKey: 'NAV.ABOUT',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/about' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/why-eviction-matters',
        langKey: 'NAV.PROBLEM',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/why-eviction-matters' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/methods',
        langKey: 'NAV.METHODS',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/methods' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/help-faq',
        langKey: 'NAV.HELP',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/help-faq' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/updates',
        langKey: 'NAV.UPDATES'
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/contact',
        langKey: 'NAV.CONTACT_US',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/contact' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/get-the-data',
        langKey: 'NAV.GET_DATA',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/get-the-data' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/data-request',
        langKey: 'NAV.DATA_MERGE',
        langUrls : { 'es': 'https://staging.evictionlab.org/es/data-request' }
      },
      {
        defaultUrl: 'https://staging.evictionlab.org/media-guide',
        langKey: 'NAV.MEDIA_GUIDE'
      }
    ]
};
