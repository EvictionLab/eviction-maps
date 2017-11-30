import { MapDataAttribute } from '../map-tool/map/map-data-attribute';

export const DataAttributes: Array<MapDataAttribute> = [
  {
    'id': 'none',
    'name': 'None',
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
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
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
            'value': 2
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
            'value': 6
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
            'value': 2
          },
          1.2525
        ],
        [
          {
            'zoom': 2,
            'value': 4
          },
          2.505
        ],
        [
          {
            'zoom': 2,
            'value': 6
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
            'value': 2
          },
          4
        ],
        [
          {
            'zoom': 3,
            'value': 4
          },
          8
        ],
        [
          {
            'zoom': 3,
            'value': 6
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
            'value': 2
          },
          12
        ],
        [
          {
            'zoom': 4,
            'value': 4
          },
          24
        ],
        [
          {
            'zoom': 4,
            'value': 6
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
            'value': 2
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
            'value': 6
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
            'value': 2
          },
          1
        ],
        [
          {
            'zoom': 3,
            'value': 4
          },
          1.7144
        ],
        [
          {
            'zoom': 3,
            'value': 6
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
            'value': 2
          },
          1.7144
        ],
        [
          {
            'zoom': 4,
            'value': 4
          },
          3.4288
        ],
        [
          {
            'zoom': 4,
            'value': 6
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
            'value': 2
          },
          4
        ],
        [
          {
            'zoom': 5,
            'value': 4
          },
          8
        ],
        [
          {
            'zoom': 5,
            'value': 6
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
            'value': 2
          },
          6
        ],
        [
          {
            'zoom': 6,
            'value': 4
          },
          12
        ],
        [
          {
            'zoom': 6,
            'value': 6
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
            'value': 2
          },
          12
        ],
        [
          {
            'zoom': 9,
            'value': 4
          },
          20
        ],
        [
          {
            'zoom': 9,
            'value': 6
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
            'value': 2
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
            'value': 6
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
            'value': 2
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
            'value': 6
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
            'value': 2
          },
          1.78
        ],
        [
          {
            'zoom': 7,
            'value': 4
          },
          2.67
        ],
        [
          {
            'zoom': 7,
            'value': 6
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
            'value': 2
          },
          3.48
        ],
        [
          {
            'zoom': 8,
            'value': 4
          },
          5.2
        ],
        [
          {
            'zoom': 8,
            'value': 6
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
            'value': 2
          },
          6.78
        ],
        [
          {
            'zoom': 9,
            'value': 4
          },
          10
        ],
        [
          {
            'zoom': 9,
            'value': 6
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
            'value': 2
          },
          13.22
        ],
        [
          {
            'zoom': 10,
            'value': 4
          },
          19.8
        ],
        [
          {
            'zoom': 10,
            'value': 6
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
            'value': 2
          },
          25.77
        ],
        [
          {
            'zoom': 11,
            'value': 4
          },
          38.66
        ],
        [
          {
            'zoom': 11,
            'value': 6
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
            'value': 2
          },
          42
        ],
        [
          {
            'zoom': 12,
            'value': 4
          },
          63
        ],
        [
          {
            'zoom': 12,
            'value': 6
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
            'value': 2
          },
          87.56
        ],
        [
          {
            'zoom': 13,
            'value': 4
          },
          131.33
        ],
        [
          {
            'zoom': 13,
            'value': 6
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
            'value': 2
          },
          170.73
        ],
        [
          {
            'zoom': 14,
            'value': 4
          },
          256.1
        ],
        [
          {
            'zoom': 14,
            'value': 6
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
            'value': 2
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
            'value': 6
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
            'value': 2
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 4
          },
          1.4625
        ],
        [
          {
            'zoom': 8,
            'value': 6
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
            'value': 2
          },
          1.9
        ],
        [
          {
            'zoom': 9,
            'value': 4
          },
          2.85
        ],
        [
          {
            'zoom': 9,
            'value': 6
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
            'value': 2
          },
          3.7
        ],
        [
          {
            'zoom': 10,
            'value': 4
          },
          5.56
        ],
        [
          {
            'zoom': 10,
            'value': 6
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
            'value': 2
          },
          7.23
        ],
        [
          {
            'zoom': 11,
            'value': 4
          },
          10.84
        ],
        [
          {
            'zoom': 11,
            'value': 6
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
            'value': 2
          },
          11.77
        ],
        [
          {
            'zoom': 12,
            'value': 4
          },
          17.66
        ],
        [
          {
            'zoom': 12,
            'value': 6
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
            'value': 2
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
            'value': 6
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
            'value': 2
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 4
          },
          1.3
        ],
        [
          {
            'zoom': 9,
            'value': 6
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
            'value': 2
          },
          1.27
        ],
        [
          {
            'zoom': 10,
            'value': 4
          },
          2.5
        ],
        [
          {
            'zoom': 10,
            'value': 6
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
            'value': 2
          },
          2.47
        ],
        [
          {
            'zoom': 11,
            'value': 4
          },
          4.94
        ],
        [
          {
            'zoom': 11,
            'value': 6
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
            'value': 2
          },
          4.02
        ],
        [
          {
            'zoom': 12,
            'value': 4
          },
          8.05
        ],
        [
          {
            'zoom': 12,
            'value': 6
          },
          12.07
        ]
      ]
    }
  },
  {
    'id': 'efr',
    'name': 'Filing Rate',
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
            'value': 5
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
            'value': 15
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
            'value': 5
          },
          1.2525
        ],
        [
          {
            'zoom': 2,
            'value': 10
          },
          2.505
        ],
        [
          {
            'zoom': 2,
            'value': 15
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
            'value': 5
          },
          4
        ],
        [
          {
            'zoom': 3,
            'value': 10
          },
          8
        ],
        [
          {
            'zoom': 3,
            'value': 15
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
            'value': 5
          },
          12
        ],
        [
          {
            'zoom': 4,
            'value': 10
          },
          24
        ],
        [
          {
            'zoom': 4,
            'value': 15
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
            'value': 5
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
            'value': 15
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
            'value': 5
          },
          1
        ],
        [
          {
            'zoom': 3,
            'value': 10
          },
          1.7144
        ],
        [
          {
            'zoom': 3,
            'value': 15
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
            'value': 5
          },
          1.7144
        ],
        [
          {
            'zoom': 4,
            'value': 10
          },
          3.4288
        ],
        [
          {
            'zoom': 4,
            'value': 15
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
            'value': 5
          },
          4
        ],
        [
          {
            'zoom': 5,
            'value': 10
          },
          8
        ],
        [
          {
            'zoom': 5,
            'value': 15
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
            'value': 5
          },
          6
        ],
        [
          {
            'zoom': 6,
            'value': 10
          },
          12
        ],
        [
          {
            'zoom': 6,
            'value': 15
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
            'value': 5
          },
          12
        ],
        [
          {
            'zoom': 9,
            'value': 10
          },
          20
        ],
        [
          {
            'zoom': 9,
            'value': 15
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
            'value': 5
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
            'value': 15
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
            'value': 5
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
            'value': 15
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
            'value': 5
          },
          1.78
        ],
        [
          {
            'zoom': 7,
            'value': 10
          },
          2.67
        ],
        [
          {
            'zoom': 7,
            'value': 15
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
            'value': 5
          },
          3.48
        ],
        [
          {
            'zoom': 8,
            'value': 10
          },
          5.2
        ],
        [
          {
            'zoom': 8,
            'value': 15
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
            'value': 5
          },
          6.78
        ],
        [
          {
            'zoom': 9,
            'value': 10
          },
          10
        ],
        [
          {
            'zoom': 9,
            'value': 15
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
            'value': 5
          },
          13.22
        ],
        [
          {
            'zoom': 10,
            'value': 10
          },
          19.8
        ],
        [
          {
            'zoom': 10,
            'value': 15
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
            'value': 5
          },
          25.77
        ],
        [
          {
            'zoom': 11,
            'value': 10
          },
          38.66
        ],
        [
          {
            'zoom': 11,
            'value': 15
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
            'value': 5
          },
          42
        ],
        [
          {
            'zoom': 12,
            'value': 10
          },
          63
        ],
        [
          {
            'zoom': 12,
            'value': 15
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
            'value': 5
          },
          87.56
        ],
        [
          {
            'zoom': 13,
            'value': 10
          },
          131.33
        ],
        [
          {
            'zoom': 13,
            'value': 15
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
            'value': 5
          },
          170.73
        ],
        [
          {
            'zoom': 14,
            'value': 10
          },
          256.1
        ],
        [
          {
            'zoom': 14,
            'value': 15
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
            'value': 5
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
            'value': 15
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
            'value': 5
          },
          1
        ],
        [
          {
            'zoom': 8,
            'value': 10
          },
          1.4625
        ],
        [
          {
            'zoom': 8,
            'value': 15
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
            'value': 5
          },
          1.9
        ],
        [
          {
            'zoom': 9,
            'value': 10
          },
          2.85
        ],
        [
          {
            'zoom': 9,
            'value': 15
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
            'value': 5
          },
          3.7
        ],
        [
          {
            'zoom': 10,
            'value': 10
          },
          5.56
        ],
        [
          {
            'zoom': 10,
            'value': 15
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
            'value': 5
          },
          7.23
        ],
        [
          {
            'zoom': 11,
            'value': 10
          },
          10.84
        ],
        [
          {
            'zoom': 11,
            'value': 15
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
            'value': 5
          },
          11.77
        ],
        [
          {
            'zoom': 12,
            'value': 10
          },
          17.66
        ],
        [
          {
            'zoom': 12,
            'value': 15
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
            'value': 5
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
            'value': 15
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
            'value': 5
          },
          1
        ],
        [
          {
            'zoom': 9,
            'value': 10
          },
          1.3
        ],
        [
          {
            'zoom': 9,
            'value': 15
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
            'value': 5
          },
          1.27
        ],
        [
          {
            'zoom': 10,
            'value': 10
          },
          2.5
        ],
        [
          {
            'zoom': 10,
            'value': 15
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
            'value': 5
          },
          2.47
        ],
        [
          {
            'zoom': 11,
            'value': 10
          },
          4.94
        ],
        [
          {
            'zoom': 11,
            'value': 15
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
            'value': 5
          },
          4.02
        ],
        [
          {
            'zoom': 12,
            'value': 10
          },
          8.05
        ],
        [
          {
            'zoom': 12,
            'value': 15
          },
          12.07
        ]
      ]
    }
  }
];
