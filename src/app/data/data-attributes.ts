import { MapDataAttribute } from '../map/map-data-attribute';

export const DataAttributes: Array<MapDataAttribute> = [
    {
        'id': 'poverty-rate',
        'name': 'Poverty Rate',
        'opacityStops' : {
            'default': [
                [0, 0],
                [0.5, 1]
            ]
        }
    },
    {
        'id': 'population',
        'name': 'Population',
        'opacityStops' : {
            'default': [
                [0, 0],
                [100000, 1]
            ],
            'blockgroups': [
                [0, 0],
                [5000, 1]
            ],
            'zipcodes': [
                [0, 0],
                [10000, 1]
            ],
            'tracts': [
                [0, 0],
                [10000, 1]
            ],
            'cities': [
                [100, 0],
                [50000, 1]
            ],
            'counties': [
                [10000, 0],
                [1000000, 1]
            ],
            'states': [
                [1000000, 0],
                [10000000, 1]
            ]
        }
    },
    {
        'id': 'average-household-size',
        'name': 'Average Household Size',
        'opacityStops': {
            'default': [
                [0, 0],
                [4, 1]
            ]
        }
    }
];
