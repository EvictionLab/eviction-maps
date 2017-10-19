import { MapDataAttribute } from '../map/map-data-attribute';

export const DataAttributes: Array<MapDataAttribute> = [
    {
        'id': 'p',
        'name': 'Population',
        'default': 'rgba(0, 0, 0, 0)',
        'fillStops': {
            'default': [
                [0, 'rgba(238, 226, 239, 0.7)'],
                [50000, 'rgba(137, 140, 206, 0.8)'],
                [100000, 'rgba(64, 71, 124, 0.9)']
            ],
            'blockgroups': [
                [0, 'rgba(238, 226, 239, 0.7)'],
                [2500, 'rgba(137, 140, 206, 0.8)'],
                [5000, 'rgba(64, 71, 124, 0.9)']
            ],
            'zipcodes': [
                [0, 'rgba(238, 226, 239, 0.7)'],
                [5000, 'rgba(137, 140, 206, 0.8)'],
                [10000, 'rgba(64, 71, 124, 0.9)']
            ],
            'tracts': [
                [0, 'rgba(238, 226, 239, 0.7)'],
                [5000, 'rgba(137, 140, 206, 0.8)'],
                [10000, 'rgba(64, 71, 124, 0.9)']
            ],
            'cities': [
                [0, 'rgba(238, 226, 239, 0.7)'],
                [25000, 'rgba(137, 140, 206, 0.8)'],
                [50000, 'rgba(64, 71, 124, 0.9)']
            ],
            'counties': [
                [0, 'rgba(238, 226, 239, 0.7)'],
                [750000, 'rgba(137, 140, 206, 0.8)'],
                [1500000, 'rgba(64, 71, 124, 0.9)']
            ],
            'states': [
                [0, 'rgba(238, 226, 239, 0.7)'],
                [500000, 'rgba(137, 140, 206, 0.8)'],
                [1000000, 'rgba(64, 71, 124, 0.9)']
            ]
        }
    },
    {
        'id': 'pr',
        'name': 'Poverty Rate',
        'default': 'rgba(0, 0, 0, 0)',
        'fillStops': {
            'default': [
                [0, 'rgba(238, 226, 239, 0.7)'],
                [0.13, 'rgba(137, 140, 206, 0.8)'],
                [0.26, 'rgba(64, 71, 124, 0.9)']
            ]
        }
    }
];
