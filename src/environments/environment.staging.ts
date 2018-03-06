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
    appVersion: version + '-staging'
};
