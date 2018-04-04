// Staging should use prod mode, but different specifics
import { version } from './version';

export const environment = {
    production: true,
    deployUrl: 'https://staging.evictionlab.org/tool/',
    tileBaseUrl: 'https://tiles.evictionlab.org/',
    evictorsRankingDataUrl: 'https://staging.evictionlab.org/tool/assets/MOCK_EVICTORS.csv',
    cityRankingDataUrl: 'https://staging.evictionlab.org/data/rankings/cities-rankings.csv',
    stateRankingDataUrl: 'https://staging.evictionlab.org/data/rankings/states-rankings.csv',
    usAverageDataUrl: 'https://staging.evictionlab.org/data/avg/us.json',
    outliersDataUrl: 'https://staging.evictionlab.org/data/cutoffs/99-percentile.json',
    mapboxApiKey: 'pk.' +
        'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqYzJoNzVxdzAwMTMzM255dmsxM2YwZWsifQ.' +
        '4et5d5nstXWM5P0JG67XEQ',
    mapboxCountyUrl: 'https://staging.evictionlab.org/data/search/counties.csv',
    downloadBaseUrl: 'https://exports-dev.evictionlab.org',
    minYear: 2000,
    maxYear: 2016,
    rankingsYear: 2016,
    appVersion: version + '-staging',
    siteNav: [
      { url: 'https://staging.evictionlab.org/', langKey: 'NAV.HOME' },
      { url: 'https://staging.evictionlab.org/map', langKey: 'NAV.MAP' },
      { url: 'https://staging.evictionlab.org/rankings', langKey: 'NAV.RANKINGS' },
      { url: 'https://staging.evictionlab.org/about', langKey: 'NAV.ABOUT' },
      { url: 'https://staging.evictionlab.org/why-eviction-matters', langKey: 'NAV.PROBLEM' },
      { url: 'https://staging.evictionlab.org/methods', langKey: 'NAV.METHODS' },
      { url: 'https://staging.evictionlab.org/help-faq', langKey: 'NAV.HELP' },
      { url: 'https://staging.evictionlab.org/updates', langKey: 'NAV.UPDATES' }
    ],
    footerNav: [
      { url: 'https://staging.evictionlab.org/', langKey: 'NAV.HOME' },
      { url: 'https://staging.evictionlab.org/map', langKey: 'NAV.MAP' },
      { url: 'https://staging.evictionlab.org/rankings', langKey: 'NAV.RANKINGS' },
      { url: 'https://staging.evictionlab.org/about', langKey: 'NAV.ABOUT' },
      { url: 'https://staging.evictionlab.org/why-eviction-matters', langKey: 'NAV.PROBLEM' },
      { url: 'https://staging.evictionlab.org/methods', langKey: 'NAV.METHODS' },
      { url: 'https://staging.evictionlab.org/help-faq', langKey: 'NAV.HELP' },
      { url: 'https://staging.evictionlab.org/updates', langKey: 'NAV.UPDATES' },
      { url: 'https://staging.evictionlab.org/contact', langKey: 'NAV.CONTACT_US' },
      { url: 'https://staging.evictionlab.org/get-the-data', langKey: 'NAV.GET_DATA' },
      { url: 'https://staging.evictionlab.org/data-merge', langKey: 'NAV.DATA_MERGE' }
    ]
};
