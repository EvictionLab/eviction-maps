// Staging should use prod mode, but different specifics

export const environment = {
    production: true,
    tileBaseUrl: 'https://tiles.evictionlab.org/',
    cityRankingDataUrl: 'https://s3.amazonaws.com/eviction-lab-data/rankings/city-rankings.csv',
    usAverageDataUrl: 'https://s3.amazonaws.com/eviction-lab-data/avg/us.json',
    mapboxApiKey: 'pk.' +
        'eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqYzJoNzVxdzAwMTMzM255dmsxM2YwZWsifQ.' +
        '4et5d5nstXWM5P0JG67XEQ',
    mapboxCountyUrl: 'https://s3.amazonaws.com/eviction-lab-data/search/counties.csv',
    downloadBaseUrl: 'https://exports-dev.evictionlab.org',
    minYear: 2000,
    maxYear: 2016
};
