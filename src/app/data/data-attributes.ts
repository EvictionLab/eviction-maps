import { MapDataAttribute } from '../map-tool/map/map-data-attribute';

export const DataAttributes: Array<MapDataAttribute> = [
  {
    'id': 'none',
    'name': 'None',
    'langKey': 'STATS.NONE',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
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
    'stops': {
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
        [250000, 'rgba(170, 191, 226, 0.75)'],
        [500000, 'rgba(133, 157, 204, 0.8)'],
        [750000, 'rgba(81, 101, 165, 0.85)'],
        [1000000, 'rgba(37, 51, 132, 0.9)']
      ],
      'counties': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [250000, 'rgba(170, 191, 226, 0.75)'],
        [500000, 'rgba(133, 157, 204, 0.8)'],
        [750000, 'rgba(81, 101, 165, 0.85)'],
        [1000000, 'rgba(37, 51, 132, 0.9)']
      ],
      'states': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [7500000, 'rgba(170, 191, 226, 0.75)'],
        [15000000, 'rgba(133, 157, 204, 0.8)'],
        [22500000, 'rgba(81, 101, 165, 0.85)'],
        [30000000, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'pr',
    'name': 'Poverty Rate',
    'langKey': 'STATS.POVERTY_RATE',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [5, 'rgba(170, 191, 226, 0.75)'],
        [10, 'rgba(133, 157, 204, 0.8)'],
        [15, 'rgba(81, 101, 165, 0.85)'],
        [20, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'pro',
    'name': '% Renter Occupied',
    'langKey': 'STATS.PCT_RENTER',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [25, 'rgba(170, 191, 226, 0.75)'],
        [50, 'rgba(133, 157, 204, 0.8)'],
        [75, 'rgba(81, 101, 165, 0.85)'],
        [100, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'mgr',
    'name': 'Median Gross Rent',
    'langKey': 'STATS.MED_RENT',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [250, 'rgba(170, 191, 226, 0.75)'],
        [500, 'rgba(133, 157, 204, 0.8)'],
        [750, 'rgba(81, 101, 165, 0.85)'],
        [1000, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'mpv',
    'name': 'Median Property Value',
    'langKey': 'STATS.MED_PROPERTY',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [50000, 'rgba(170, 191, 226, 0.75)'],
        [100000, 'rgba(133, 157, 204, 0.8)'],
        [150000, 'rgba(81, 101, 165, 0.85)'],
        [200000, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'mhi',
    'name': 'Median Household Income',
    'langKey': 'STATS.MED_INCOME',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [25000, 'rgba(170, 191, 226, 0.75)'],
        [50000, 'rgba(133, 157, 204, 0.8)'],
        [75000, 'rgba(81, 101, 165, 0.85)'],
        [100000, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'pw',
    'name': '% White',
    'langKey': 'STATS.PCT_WHITE',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [25, 'rgba(170, 191, 226, 0.75)'],
        [50, 'rgba(133, 157, 204, 0.8)'],
        [75, 'rgba(81, 101, 165, 0.85)'],
        [100, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'paa',
    'name': '% African American',
    'langKey': 'STATS.PCT_AFR_AMER',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [25, 'rgba(170, 191, 226, 0.75)'],
        [50, 'rgba(133, 157, 204, 0.8)'],
        [75, 'rgba(81, 101, 165, 0.85)'],
        [100, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'ph',
    'name': '% Hispanic/Latinx',
    'langKey': 'STATS.PCT_HISPANIC',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [25, 'rgba(170, 191, 226, 0.75)'],
        [50, 'rgba(133, 157, 204, 0.8)'],
        [75, 'rgba(81, 101, 165, 0.85)'],
        [100, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'pai',
    'name': '% American Indian/Alaskan Native',
    'langKey': 'STATS.PCT_AMER_INDIAN',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [25, 'rgba(170, 191, 226, 0.75)'],
        [50, 'rgba(133, 157, 204, 0.8)'],
        [75, 'rgba(81, 101, 165, 0.85)'],
        [100, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'pa',
    'name': '% Asian',
    'langKey': 'STATS.PCT_ASIAN',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [25, 'rgba(170, 191, 226, 0.75)'],
        [50, 'rgba(133, 157, 204, 0.8)'],
        [75, 'rgba(81, 101, 165, 0.85)'],
        [100, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'pnp',
    'name': '% Native Hawaiian or Pacific Islander',
    'langKey': 'STATS.PCT_HAW_ISL',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [25, 'rgba(170, 191, 226, 0.75)'],
        [50, 'rgba(133, 157, 204, 0.8)'],
        [75, 'rgba(81, 101, 165, 0.85)'],
        [100, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'pm',
    'name': '% Multiple Races',
    'langKey': 'STATS.PCT_MULTIPLE',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [25, 'rgba(170, 191, 226, 0.75)'],
        [50, 'rgba(133, 157, 204, 0.8)'],
        [75, 'rgba(81, 101, 165, 0.85)'],
        [100, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  },
  {
    'id': 'po',
    'name': '% Other Race',
    'langKey': 'STATS.PCT_OTHER',
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [25, 'rgba(170, 191, 226, 0.75)'],
        [50, 'rgba(133, 157, 204, 0.8)'],
        [75, 'rgba(81, 101, 165, 0.85)'],
        [100, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  }
];

export const BubbleAttributes: Array<MapDataAttribute> = [
  {
    'id': 'none',
    'name': 'None',
    'langKey': 'STATS.NONE',
    'default': 0,
    'expressions': {
      'default': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          0, ['/', ['var', 'data_prop'], 1],
          1, ['/', ['var', 'data_prop'], 1]
        ]
      ]
    }
  },
  {
    'id': 'er',
    'name': 'Judgment Rate',
    'langKey': 'STATS.JUDGMENT_RATE',
    'default': 0,
    'expressions': {
      'default': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          4, ['/', ['var', 'data_prop'], 16],
          6, ['/', ['var', 'data_prop'], 8],
          8, ['/', ['var', 'data_prop'], 2.5],
          9, ['/', ['var', 'data_prop'], 0.8],
          10, ['/', ['var', 'data_prop'], 0.8]
        ]
      ],
      'states': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          2, ['/', ['var', 'data_prop'], 0.8],
          4, ['/', ['var', 'data_prop'], 0.4],
          6, ['/', ['var', 'data_prop'], 0.2]
        ]
      ],
      'counties': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          2, ['/', ['var', 'data_prop'], 2.5],
          4, ['/', ['var', 'data_prop'], 2.5],
          5, ['/', ['var', 'data_prop'], 0.8]
        ]
      ],
      'cities': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          4, ['/', ['var', 'data_prop'], 16],
          6, ['/', ['var', 'data_prop'], 8],
          8, ['/', ['var', 'data_prop'], 2.5],
          9, ['/', ['var', 'data_prop'], 0.8],
          10, ['/', ['var', 'data_prop'], 0.8]
        ]
      ],
      'tracts': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          7, ['/', ['var', 'data_prop'], 8],
          10, ['/', ['var', 'data_prop'], 2.5],
          12, ['/', ['var', 'data_prop'], 0.8]
        ]
      ],
      'block-groups': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          7, ['/', ['var', 'data_prop'], 8],
          10, ['/', ['var', 'data_prop'], 2.5],
          12, ['/', ['var', 'data_prop'], 0.8]
        ]
      ]
    }
  },
  {
    'id': 'efr',
    'name': 'Filing Rate',
    'langKey': 'STATS.FILING_RATE',
    'default': 0,
    'expressions': {
      'default': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          4, ['/', ['var', 'data_prop'], ['*', 16, 1.5]],
          6, ['/', ['var', 'data_prop'], ['*', 8, 1.5]],
          8, ['/', ['var', 'data_prop'], ['*', 2.5, 1.5]],
          9, ['/', ['var', 'data_prop'], ['*', 0.8, 1.5]]
        ]
      ],
      'states': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          2, ['/', ['var', 'data_prop'], ['*', 0.8, 1.5]],
          4, ['/', ['var', 'data_prop'], ['*', 0.4, 1.5]],
          6, ['/', ['var', 'data_prop'], ['*', 0.2, 1.5]]
        ]
      ],
      'counties': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          2, ['/', ['var', 'data_prop'], ['*', 8, 1.5]],
          4, ['/', ['var', 'data_prop'], ['*', 2.5, 1.5]],
          6, ['/', ['var', 'data_prop'], ['*', 0.8, 1.5]],
          8, ['/', ['var', 'data_prop'], ['*', 0.4, 1.5]]
        ]
      ],
      'cities': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          4, ['/', ['var', 'data_prop'], ['*', 16, 1.5]],
          6, ['/', ['var', 'data_prop'], ['*', 8, 1.5]],
          8, ['/', ['var', 'data_prop'], ['*', 2.5, 1.5]],
          9, ['/', ['var', 'data_prop'], ['*', 0.8, 1.5]]
        ]
      ],
      'tracts': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          7, ['/', ['var', 'data_prop'], ['*', 8, 1.5]],
          10, ['/', ['var', 'data_prop'], ['*', 2.5, 1.5]],
          12, ['/', ['var', 'data_prop'], ['*', 0.8, 1.5]]
        ]
      ],
      'block-groups': [
        'let', 'data_prop', ['min', 20, ['get', 'PROP']],
        [
          'interpolate', ['linear'], ['zoom'],
          7, ['/', ['var', 'data_prop'], ['*', 8, 1.5]],
          10, ['/', ['var', 'data_prop'], ['*', 2.5, 1.5]],
          12, ['/', ['var', 'data_prop'], ['*', 0.8, 1.5]]
        ]
      ]
    }
  }
];
