import { MapDataAttribute } from '../map/map-data-attribute';

export const DataAttributes: Array<MapDataAttribute> = [
    {
        'id': 'poverty-rate',
        'name': 'Poverty Rate',
        'fillStops' : {
            'default': [
                [0, 'yellow'],
                [0.5, 'red']
            ]
        }
    },
    {
        'id': 'population',
        'name': 'Population',
        'fillStops' : {
            'default': [
                [0, 'yellow'],
                [100000, 'red']
            ],
            'blockgroups': [
                [0, 'yellow'],
                [5000, 'red']
            ],
            'zipcodes': [
                [0, 'yellow'],
                [10000, 'red']
            ],
            'tracts': [
                [0, 'yellow'],
                [10000, 'red']
            ],
            'cities': [
                [100, 'yellow'],
                [50000, 'red']
            ],
            'counties': [
                [10000, 'yellow'],
                [1000000, 'red']
            ],
            'states': [
                [1000000, 'yellow'],
                [10000000, 'red']
            ]
        }
    },
    {
        'id': 'average-household-size',
        'name': 'Average Household Size',
        'fillStops': {
            'default': [
                [0, 'yellow'],
                [4, 'red']
            ]
        }
    }
];
