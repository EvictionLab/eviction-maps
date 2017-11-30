import { MapDataAttribute } from '../map-tool/map/map-data-attribute';

export const DataAttributes: Array<MapDataAttribute> = [
  {
    'id': 'none',
    'name': 'None',
    'langKey': 'STATS.NONE',
    'default': 'rgba(0, 0, 0, 0)',
    'fillStops': {
      'default': [
        [0, 'rgba(0, 0, 0, 0)']
      ]
    }
  },
  {
    'id': 'p',
    'name': 'Population',
    'langKey': 'STATS.POPULATION',
    'default': 'rgba(0, 0, 0, 0)',
    'fillStops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(238, 226, 239, 0.7)'],
        [50000, 'rgba(137, 140, 206, 0.8)'],
        [100000, 'rgba(64, 71, 124, 0.9)']
      ],
      'block-groups': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [1250, 'rgba(170, 191, 226, 0.75)'],
        [2500, 'rgba(133, 157, 204, 0.8)'],
        [3750, 'rgba(81, 101, 165, 0.85)'],
        [5000, 'rgba(37, 51, 132, 0.9)']
      ],
      'tracts': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [2500, 'rgba(170, 191, 226, 0.75)'],
        [5000, 'rgba(133, 157, 204, 0.8)'],
        [7500, 'rgba(81, 101, 165, 0.85)'],
        [10000, 'rgba(37, 51, 132, 0.9)']
      ],
      'cities': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [12500, 'rgba(170, 191, 226, 0.75)'],
        [25000, 'rgba(133, 157, 204, 0.8)'],
        [37500, 'rgba(81, 101, 165, 0.85)'],
        [50000, 'rgba(37, 51, 132, 0.9)']
      ],
      'counties': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [10000, 'rgba(170, 191, 226, 0.75)'],
        [75000, 'rgba(133, 157, 204, 0.8)'],
        [150000, 'rgba(81, 101, 165, 0.85)'],
        [900000, 'rgba(37, 51, 132, 0.9)']
      ],
      'states': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [250000, 'rgba(170, 191, 226, 0.75)'],
        [500000, 'rgba(133, 157, 204, 0.8)'],
        [750000, 'rgba(81, 101, 165, 0.85)'],
        [1000000, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'pr',
    'name': 'Poverty Rate',
    'langKey': 'STATS.POVERTY_RATE',
    'default': 'rgba(0, 0, 0, 0)',
    'fillStops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [7, 'rgba(170, 191, 226, 0.75)'],
        [13, 'rgba(133, 157, 204, 0.8)'],
        [20, 'rgba(81, 101, 165, 0.85)'],
        [26, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  }
];

export const BubbleAttributes: Array<MapDataAttribute> = [
  {
    'id': 'none',
    'name': 'None',
    'langKey': 'STATS.NONE'
  },
  {
    'id': 'er',
    'name': 'Judgment Rate',
    'langKey': 'STATS.JUDGMENT_RATE'
  },
  {
    'id': 'efr',
    'name': 'Filing Rate',
    'langKey': 'STATS.FILING_RATE'
  }
];
