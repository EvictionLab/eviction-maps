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
  }
];

export const BubbleAttributes: Array<MapDataAttribute> = [
  {
    'id': 'none',
    'name': 'None',
    'langKey': 'STATS.NONE',
    'default': 0,
    'stops': {
      'default': [
        [
          {
            'zoom': 1,
            'value': 0
          },
          0
        ]
      ]
    }
  },
  {
    'id': 'er',
    'name': 'Judgment Rate',
    'langKey': 'STATS.JUDGMENT_RATE',
    'default': 0,
    'stops': {
      'default': [
        [
          {
            'zoom': 1,
            'value': 0
          },
          1
        ]
      ],
      'circle-color': [
        [
          -1,
          'rgba(198,204,207,0.8)'
        ],
        [
          0,
          'rgba(255,120,119,0.8)'
        ],
        [
          6,
          'rgba(255,4,0,0.8)'
        ]
      ],
      'states': [
        [
          {
            'zoom': 1,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 1,
            'value': 4
          },
          1
        ],
        [
          {
            'zoom': 1,
            'value': 8
          },
          1
        ],
        [
          {
            'zoom': 1,
            'value': 12
          },
          1.5
        ],
        [
          {
            'zoom': 2,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 2,
            'value': 4
          },
          1.2525
        ],
        [
          {
            'zoom': 2,
            'value': 8
          },
          2.505
        ],
        [
          {
            'zoom': 2,
            'value': 12
          },
          3.7575
        ],
        [
          {
            'zoom': 3,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 3,
            'value': 4
          },
          4
        ],
        [
          {
            'zoom': 3,
            'value': 8
          },
          8
        ],
        [
          {
            'zoom': 3,
            'value': 12
          },
          12
        ],
        [
          {
            'zoom': 4,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 4,
            'value': 4
          },
          12
        ],
        [
          {
            'zoom': 4,
            'value': 8
          },
          24
        ],
        [
          {
            'zoom': 4,
            'value': 12
          },
          36
        ]
      ],
      'counties': [
        [
          {
            'zoom': 2,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 2,
            'value': 4
          },
          1
        ],
        [
          {
            'zoom': 2,
            'value': 8
          },
          1
        ],
        [
          {
            'zoom': 2,
            'value': 12
          },
          1
        ],
        [
          {
            'zoom': 3,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 3,
            'value': 4
          },
          1
        ],
        [
          {
            'zoom': 3,
            'value': 8
          },
          1.7144
        ],
        [
          {
            'zoom': 3,
            'value': 12
          },
          2.143
        ],
        [
          {
            'zoom': 4,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 4,
            'value': 4
          },
          1.7144
        ],
        [
          {
            'zoom': 4,
            'value': 8
          },
          3.4288
        ],
        [
          {
            'zoom': 4,
            'value': 12
          },
          4.286
        ],
        [
          {
            'zoom': 5,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 5,
            'value': 4
          },
          4
        ],
        [
          {
            'zoom': 5,
            'value': 8
          },
          8
        ],
        [
          {
            'zoom': 5,
            'value': 12
          },
          10
        ],
        [
          {
            'zoom': 6,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 6,
            'value': 4
          },
          6
        ],
        [
          {
            'zoom': 6,
            'value': 8
          },
          12
        ],
        [
          {
            'zoom': 6,
            'value': 12
          },
          15
        ],
        [
          {
            'zoom': 9,
            'value': 0
          },
          2
        ],
        [
          {
            'zoom': 9,
            'value': 4
          },
          12
        ],
        [
          {
            'zoom': 9,
            'value': 8
          },
          20
        ],
        [
          {
            'zoom': 9,
            'value': 12
          },
          36
        ]
      ],
      'cities': [
        [
          {
            'zoom': 5,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 5,
            'value': 4
          },
          1
        ],
        [
          {
            'zoom': 5,
            'value': 8
          },
          1
        ],
        [
          {
            'zoom': 5,
            'value': 12
          },
          1
        ],
        [
          {
            'zoom': 6,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 6,
            'value': 4
          },
          1
        ],
        [
          {
            'zoom': 6,
            'value': 8
          },
          1
        ],
        [
          {
            'zoom': 6,
            'value': 12
          },
          1.4625
        ],
        [
          {
            'zoom': 7,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 7,
            'value': 4
          },
          1.78
        ],
        [
          {
            'zoom': 7,
            'value': 8
          },
          2.67
        ],
        [
          {
            'zoom': 7,
            'value': 12
          },
          3.56
        ],
        [
          {
            'zoom': 8,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 4
          },
          3.48
        ],
        [
          {
            'zoom': 8,
            'value': 8
          },
          5.2
        ],
        [
          {
            'zoom': 8,
            'value': 12
          },
          7
        ],
        [
          {
            'zoom': 9,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 4
          },
          6.78
        ],
        [
          {
            'zoom': 9,
            'value': 8
          },
          10
        ],
        [
          {
            'zoom': 9,
            'value': 12
          },
          13.555318359374997
        ],
        [
          {
            'zoom': 10,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 10,
            'value': 4
          },
          13.22
        ],
        [
          {
            'zoom': 10,
            'value': 8
          },
          19.8
        ],
        [
          {
            'zoom': 10,
            'value': 12
          },
          26.43
        ],
        [
          {
            'zoom': 11,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 11,
            'value': 4
          },
          25.77
        ],
        [
          {
            'zoom': 11,
            'value': 8
          },
          38.66
        ],
        [
          {
            'zoom': 11,
            'value': 12
          },
          51.5
        ],
        [
          {
            'zoom': 12,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 12,
            'value': 4
          },
          42
        ],
        [
          {
            'zoom': 12,
            'value': 8
          },
          63
        ],
        [
          {
            'zoom': 12,
            'value': 12
          },
          84
        ],
        [
          {
            'zoom': 13,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 13,
            'value': 4
          },
          87.56
        ],
        [
          {
            'zoom': 13,
            'value': 8
          },
          131.33
        ],
        [
          {
            'zoom': 13,
            'value': 12
          },
          175
        ],
        [
          {
            'zoom': 14,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 14,
            'value': 4
          },
          170.73
        ],
        [
          {
            'zoom': 14,
            'value': 8
          },
          256.1
        ],
        [
          {
            'zoom': 14,
            'value': 12
          },
          341.47
        ]
      ],
      'tracts': [
        [
          {
            'zoom': 7,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 7,
            'value': 4
          },
          1
        ],
        [
          {
            'zoom': 7,
            'value': 8
          },
          1
        ],
        [
          {
            'zoom': 7,
            'value': 12
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 4
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 8
          },
          1.4625
        ],
        [
          {
            'zoom': 8,
            'value': 12
          },
          1.95
        ],
        [
          {
            'zoom': 9,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 4
          },
          1.9
        ],
        [
          {
            'zoom': 9,
            'value': 8
          },
          2.85
        ],
        [
          {
            'zoom': 9,
            'value': 12
          },
          3.8
        ],
        [
          {
            'zoom': 10,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 10,
            'value': 4
          },
          3.7
        ],
        [
          {
            'zoom': 10,
            'value': 8
          },
          5.56
        ],
        [
          {
            'zoom': 10,
            'value': 12
          },
          7.4
        ],
        [
          {
            'zoom': 11,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 11,
            'value': 4
          },
          7.23
        ],
        [
          {
            'zoom': 11,
            'value': 8
          },
          10.84
        ],
        [
          {
            'zoom': 11,
            'value': 12
          },
          14.46
        ],
        [
          {
            'zoom': 12,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 12,
            'value': 4
          },
          11.77
        ],
        [
          {
            'zoom': 12,
            'value': 8
          },
          17.66
        ],
        [
          {
            'zoom': 12,
            'value': 12
          },
          23.54
        ]
      ],
      'block-groups': [
        [
          {
            'zoom': 8,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 4
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 8
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 12
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 4
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 8
          },
          1.3
        ],
        [
          {
            'zoom': 9,
            'value': 12
          },
          1.95
        ],
        [
          {
            'zoom': 10,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 10,
            'value': 4
          },
          1.27
        ],
        [
          {
            'zoom': 10,
            'value': 8
          },
          2.5
        ],
        [
          {
            'zoom': 10,
            'value': 12
          },
          3.8
        ],
        [
          {
            'zoom': 11,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 11,
            'value': 4
          },
          2.47
        ],
        [
          {
            'zoom': 11,
            'value': 8
          },
          4.94
        ],
        [
          {
            'zoom': 11,
            'value': 12
          },
          7.4
        ],
        [
          {
            'zoom': 12,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 12,
            'value': 4
          },
          4.02
        ],
        [
          {
            'zoom': 12,
            'value': 8
          },
          8.05
        ],
        [
          {
            'zoom': 12,
            'value': 12
          },
          12.07
        ]
      ]
    }
  },
  {
    'id': 'efr',
    'name': 'Filing Rate',
    'langKey': 'STATS.FILING_RATE',
    'default': 0,
    'stops': {
      'default': [
        [
          {
            'zoom': 1,
            'value': 0
          },
          1
        ]
      ],
      'circle-color': [
        [
          -1,
          'rgba(198,204,207,0.8)'
        ],
        [
          0,
          'rgba(255,120,119,0.8)'
        ],
        [
          15,
          'rgba(255,4,0,0.8)'
        ]
      ],
      'states': [
        [
          {
            'zoom': 1,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 1,
            'value': 10
          },
          1
        ],
        [
          {
            'zoom': 1,
            'value': 20
          },
          1
        ],
        [
          {
            'zoom': 1,
            'value': 30
          },
          1.5
        ],
        [
          {
            'zoom': 2,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 2,
            'value': 10
          },
          1.2525
        ],
        [
          {
            'zoom': 2,
            'value': 20
          },
          2.505
        ],
        [
          {
            'zoom': 2,
            'value': 30
          },
          3.7575
        ],
        [
          {
            'zoom': 3,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 3,
            'value': 10
          },
          4
        ],
        [
          {
            'zoom': 3,
            'value': 20
          },
          8
        ],
        [
          {
            'zoom': 3,
            'value': 30
          },
          12
        ],
        [
          {
            'zoom': 4,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 4,
            'value': 10
          },
          12
        ],
        [
          {
            'zoom': 4,
            'value': 20
          },
          24
        ],
        [
          {
            'zoom': 4,
            'value': 30
          },
          36
        ]
      ],
      'counties': [
        [
          {
            'zoom': 2,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 2,
            'value': 10
          },
          1
        ],
        [
          {
            'zoom': 2,
            'value': 20
          },
          1
        ],
        [
          {
            'zoom': 2,
            'value': 30
          },
          1
        ],
        [
          {
            'zoom': 3,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 3,
            'value': 10
          },
          1
        ],
        [
          {
            'zoom': 3,
            'value': 20
          },
          1.7144
        ],
        [
          {
            'zoom': 3,
            'value': 30
          },
          2.143
        ],
        [
          {
            'zoom': 4,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 4,
            'value': 10
          },
          1.7144
        ],
        [
          {
            'zoom': 4,
            'value': 20
          },
          3.4288
        ],
        [
          {
            'zoom': 4,
            'value': 30
          },
          4.286
        ],
        [
          {
            'zoom': 5,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 5,
            'value': 10
          },
          4
        ],
        [
          {
            'zoom': 5,
            'value': 20
          },
          8
        ],
        [
          {
            'zoom': 5,
            'value': 30
          },
          10
        ],
        [
          {
            'zoom': 6,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 6,
            'value': 10
          },
          6
        ],
        [
          {
            'zoom': 6,
            'value': 20
          },
          12
        ],
        [
          {
            'zoom': 6,
            'value': 30
          },
          15
        ],
        [
          {
            'zoom': 9,
            'value': 0
          },
          2
        ],
        [
          {
            'zoom': 9,
            'value': 10
          },
          12
        ],
        [
          {
            'zoom': 9,
            'value': 20
          },
          20
        ],
        [
          {
            'zoom': 9,
            'value': 30
          },
          36
        ]
      ],
      'cities': [
        [
          {
            'zoom': 5,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 5,
            'value': 10
          },
          1
        ],
        [
          {
            'zoom': 5,
            'value': 20
          },
          1
        ],
        [
          {
            'zoom': 5,
            'value': 30
          },
          1
        ],
        [
          {
            'zoom': 6,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 6,
            'value': 10
          },
          1
        ],
        [
          {
            'zoom': 6,
            'value': 20
          },
          1
        ],
        [
          {
            'zoom': 6,
            'value': 30
          },
          1.4625
        ],
        [
          {
            'zoom': 7,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 7,
            'value': 10
          },
          1.78
        ],
        [
          {
            'zoom': 7,
            'value': 20
          },
          2.67
        ],
        [
          {
            'zoom': 7,
            'value': 30
          },
          3.56
        ],
        [
          {
            'zoom': 8,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 10
          },
          3.48
        ],
        [
          {
            'zoom': 8,
            'value': 20
          },
          5.2
        ],
        [
          {
            'zoom': 8,
            'value': 30
          },
          7
        ],
        [
          {
            'zoom': 9,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 10
          },
          6.78
        ],
        [
          {
            'zoom': 9,
            'value': 20
          },
          10
        ],
        [
          {
            'zoom': 9,
            'value': 30
          },
          13.55
        ],
        [
          {
            'zoom': 10,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 10,
            'value': 10
          },
          13.22
        ],
        [
          {
            'zoom': 10,
            'value': 20
          },
          19.8
        ],
        [
          {
            'zoom': 10,
            'value': 30
          },
          26.43
        ],
        [
          {
            'zoom': 11,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 11,
            'value': 10
          },
          25.77
        ],
        [
          {
            'zoom': 11,
            'value': 20
          },
          38.66
        ],
        [
          {
            'zoom': 11,
            'value': 30
          },
          51.5
        ],
        [
          {
            'zoom': 12,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 12,
            'value': 10
          },
          42
        ],
        [
          {
            'zoom': 12,
            'value': 20
          },
          63
        ],
        [
          {
            'zoom': 12,
            'value': 30
          },
          84
        ],
        [
          {
            'zoom': 13,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 13,
            'value': 10
          },
          87.56
        ],
        [
          {
            'zoom': 13,
            'value': 20
          },
          131.33
        ],
        [
          {
            'zoom': 13,
            'value': 30
          },
          175
        ],
        [
          {
            'zoom': 14,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 14,
            'value': 10
          },
          170.73
        ],
        [
          {
            'zoom': 14,
            'value': 20
          },
          256.1
        ],
        [
          {
            'zoom': 14,
            'value': 30
          },
          341.47
        ]
      ],
      'tracts': [
        [
          {
            'zoom': 7,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 7,
            'value': 10
          },
          1
        ],
        [
          {
            'zoom': 7,
            'value': 20
          },
          1
        ],
        [
          {
            'zoom': 7,
            'value': 30
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 10
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 20
          },
          1.4625
        ],
        [
          {
            'zoom': 8,
            'value': 30
          },
          1.95
        ],
        [
          {
            'zoom': 9,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 10
          },
          1.9
        ],
        [
          {
            'zoom': 9,
            'value': 20
          },
          2.85
        ],
        [
          {
            'zoom': 9,
            'value': 30
          },
          3.8
        ],
        [
          {
            'zoom': 10,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 10,
            'value': 10
          },
          3.7
        ],
        [
          {
            'zoom': 10,
            'value': 20
          },
          5.56
        ],
        [
          {
            'zoom': 10,
            'value': 30
          },
          7.4
        ],
        [
          {
            'zoom': 11,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 11,
            'value': 10
          },
          7.23
        ],
        [
          {
            'zoom': 11,
            'value': 20
          },
          10.84
        ],
        [
          {
            'zoom': 11,
            'value': 30
          },
          14.46
        ],
        [
          {
            'zoom': 12,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 12,
            'value': 10
          },
          11.77
        ],
        [
          {
            'zoom': 12,
            'value': 20
          },
          17.66
        ],
        [
          {
            'zoom': 12,
            'value': 30
          },
          23.54
        ]
      ],
      'block-groups': [
        [
          {
            'zoom': 8,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 10
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 20
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 30
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 10
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 20
          },
          1.3
        ],
        [
          {
            'zoom': 9,
            'value': 30
          },
          1.95
        ],
        [
          {
            'zoom': 10,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 10,
            'value': 10
          },
          1.27
        ],
        [
          {
            'zoom': 10,
            'value': 20
          },
          2.5
        ],
        [
          {
            'zoom': 10,
            'value': 30
          },
          3.8
        ],
        [
          {
            'zoom': 11,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 11,
            'value': 10
          },
          2.47
        ],
        [
          {
            'zoom': 11,
            'value': 20
          },
          4.94
        ],
        [
          {
            'zoom': 11,
            'value': 30
          },
          7.4
        ],
        [
          {
            'zoom': 12,
            'value': 0
          },
          1
        ],
        [
          {
            'zoom': 12,
            'value': 10
          },
          4.02
        ],
        [
          {
            'zoom': 12,
            'value': 20
          },
          8.05
        ],
        [
          {
            'zoom': 12,
            'value': 30
          },
          12.07
        ]
      ]
    }
  }
];
