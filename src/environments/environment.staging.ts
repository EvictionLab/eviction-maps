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
    mapboxApiKey: 'pk.' +
        'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqYzJoNzVxdzAwMTMzM255dmsxM2YwZWsifQ.' +
        '4et5d5nstXWM5P0JG67XEQ',
    mapboxCountyUrl: 'https://staging.evictionlab.org/data/search/counties.csv',
    downloadBaseUrl: 'https://exports-dev.evictionlab.org',
    minYear: 2000,
    maxYear: 2016,
    rankingsYear: 2015,
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
    ]
};
