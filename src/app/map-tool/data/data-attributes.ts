import { MapDataAttribute } from './map-data-attribute';

const colorScales = {
  3: [
    'rgba(238, 226, 239, 0.7)',
    'rgba(137, 140, 206, 0.8)',
    'rgba(64, 71, 124, 0.9)'
  ],
  5: [
    'rgba(215, 227, 244, 0.7)',
    'rgba(170, 191, 226, 0.75)',
    'rgba(133, 157, 204, 0.8)',
    'rgba(81, 101, 165, 0.85)',
    'rgba(37, 51, 132, 0.9)'
  ]
};

function getScale(scaleVals: Array<number>): Array<any> {
  let scaleArr = [-1.0, 'rgba(0, 0, 0, 0)'];
  colorScales[scaleVals.length].forEach((v, i) => {
    scaleArr = scaleArr.concat([scaleVals[i], v]);
  });
  return scaleArr;
}

export const DataAttributes: Array<MapDataAttribute> = [
  {
    'id': 'none',
    'type': 'choropleth',
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
    'type': 'choropleth',
    'langKey': 'STATS.POPULATION',
    'default': 'rgba(0, 0, 0, 0)',
    'order': 6,
    'stops': {
      'default': getScale([0, 50000, 100000]),
      'block-groups': getScale([0, 1250, 2500, 3750, 5000]),
      'tracts': getScale([0, 2500, 5000, 7500, 10000]),
      'cities': getScale([0, 250000, 500000, 750000, 1000000]),
      'counties': getScale([0, 250000, 500000, 750000, 1000000]),
      'states': getScale([0, 7500000, 15000000, 22500000, 30000000])
    }
  },
  {
    'id': 'pr',
    'type': 'choropleth',
    'langKey': 'STATS.POVERTY_RATE',
    'format': 'percent',
    'order': 5,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 10, 20, 30, 40]),
      'states': getScale([0, 5, 10, 15, 20]),
      'counties': getScale([0, 7.5, 15, 22.5, 30])
    }
  },
  {
    'id': 'pro',
    'type': 'choropleth',
    'langKey': 'STATS.PCT_RENTER',
    'format': 'percent',
    'default': 'rgba(0, 0, 0, 0)',
    'order': 7,
    'stops': {
      'default': getScale([0, 15, 30, 45, 60])
    }
  },
  {
    'id': 'mgr',
    'type': 'choropleth',
    'langKey': 'STATS.MED_RENT',
    'format': 'dollar',
    'order': 8,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 300, 600, 900, 1200])
    }
  },
  {
    'id': 'mpv',
    'type': 'choropleth',
    'langKey': 'STATS.MED_PROPERTY',
    'format': 'dollar',
    'order': 9,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 50000, 100000, 150000, 200000])
    }
  },
  {
    'id': 'rb',
    'type': 'choropleth',
    'langKey': 'STATS.RENT_BURDEN',
    'hintKey': 'HINTS.RENT_BURDEN',
    'format': 'percent',
    'order': 10,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([10, 20, 30, 40, 50])
    }
  },
  {
    'id': 'mhi',
    'type': 'choropleth',
    'langKey': 'STATS.MED_INCOME',
    'format': 'dollar',
    'order': 11,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 25000, 50000, 75000, 100000])
    }
  },
  {
    'id': 'pw',
    'type': 'choropleth',
    'langKey': 'STATS.PCT_WHITE',
    'format': 'percent',
    'order': 12,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 25, 50, 75, 100])
    }
  },
  {
    'id': 'paa',
    'type': 'choropleth',
    'langKey': 'STATS.PCT_AFR_AMER',
    'format': 'percent',
    'order': 13,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 25, 50, 75, 100])
    }
  },
  {
    'id': 'ph',
    'type': 'choropleth',
    'langKey': 'STATS.PCT_HISPANIC',
    'hintKey': 'HINTS.HISPANIC',
    'order': 14,
    'default': 'rgba(0, 0, 0, 0)',
    'format': 'percent',
    'stops': {
      'default': getScale([0, 25, 50, 75, 100])
    }
  },
  {
    'id': 'pai',
    'type': 'choropleth',
    'langKey': 'STATS.PCT_AMER_INDIAN',
    'format': 'percent',
    'order': 15,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 25, 50, 75, 100])
    }
  },
  {
    'id': 'pa',
    'type': 'choropleth',
    'langKey': 'STATS.PCT_ASIAN',
    'format': 'percent',
    'order': 16,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 25, 50, 75, 100])
    }
  },
  {
    'id': 'pnp',
    'type': 'choropleth',
    'langKey': 'STATS.PCT_HAW_ISL',
    'format': 'percent',
    'order': 17,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 25, 50, 75, 100])
    }
  },
  {
    'id': 'pm',
    'type': 'choropleth',
    'langKey': 'STATS.PCT_MULTIPLE',
    'format': 'percent',
    'order': 18,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 25, 50, 75, 100])
    }
  },
  {
    'id': 'po',
    'type': 'choropleth',
    'langKey': 'STATS.PCT_OTHER',
    'format': 'percent',
    'order': 19,
    'default': 'rgba(0, 0, 0, 0)',
    'stops': {
      'default': getScale([0, 25, 50, 75, 100])
    }
  },
  {
    'id': 'epd',
    'type': 'card',
    'langKey': 'STATS.JUDGMENTS_PER_DAY',
    'order': 0,
    'default': 0
  },
  {
    'id': 'e',
    'type': 'card',
    'langKey': 'STATS.JUDGMENTS',
    'order': 2,
    'default': 0
  },
  {
    'id': 'er',
    'type': 'bubble',
    'langKey': 'STATS.JUDGMENT_RATE',
    'hintKey': 'HINTS.EVICTION_RATE',
    'format': 'percent',
    'order': 1,
    'default': 0,
    'expressions': {
      'states': [
        'let', 'data_prop', ['get', 'PROP'],
        [
          'interpolate', ['linear'], ['zoom'],
          2, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 2,
            0, 2.5,
            30, 60,
            500, 60
          ],
          8, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 3,
            0, 2.5,
            30, 160,
            500, 160
          ]
        ]
      ],
      'counties': [
        'let', 'data_prop', ['get', 'PROP'],
        [
          'interpolate', ['linear'], ['zoom'],
          2, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 1.5,
            0, 1,
            30, 7,
            500, 7
          ],
          8, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 4,
            0, 2,
            30, 35,
            500, 35
          ]
        ]
      ],
      'cities': [
        'let', 'data_prop', ['get', 'PROP'],
        [
          'interpolate', ['linear'], ['zoom'],
          3, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 1,
            0, 1,
            40, 7.5,
            500, 7.5
          ],
          12, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 2,
            0, 1,
            40, 25,
            500, 25
          ]
        ]
      ],
      'tracts': [
        'let', 'data_prop', ['get', 'PROP'],
        [
          'interpolate', ['linear'], ['zoom'],
          8, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 1.5,
            0, 1,
            50, 10,
            500, 10
          ],
          12, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 3,
            0, 2,
            50, 50,
            500, 50
          ]
        ]
      ],
      'block-groups': [
        'let', 'data_prop', ['get', 'PROP'],
        [
          'interpolate', ['linear'], ['zoom'],
          8, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 1,
            0, 0.5,
            40, 7.5,
            500, 7.5
          ],
          12, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 2,
            0, 2,
            40, 30,
            500, 30
          ]
        ]
      ]
    }
  },
  {
    'id': 'ef',
    'order': 4,
    'type': 'card',
    'langKey': 'STATS.FILINGS',
    'default': 0
  },
  {
    'id': 'efr',
    'type': 'bubble',
    'order': 3,
    'langKey': 'STATS.FILING_RATE',
    'hintKey': 'HINTS.EVICTION_FILING_RATE',
    'format': 'percent',
    'default': 0,
    'expressions': {
      'states': [
        'let', 'data_prop', ['get', 'PROP'],
        [
          'interpolate', ['linear'], ['zoom'],
          2, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 2,
            0, 2.5,
            40, 40,
            500, 40
          ],
          8, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 3,
            0, 2.5,
            40, 120,
            500, 120
          ]
        ]
      ],
      'counties': [
        'let', 'data_prop', ['get', 'PROP'],
        [
          'interpolate', ['linear'], ['zoom'],
          2, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 1.5,
            0, 1,
            60, 7,
            500, 7
          ],
          8, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 4,
            0, 2,
            60, 35,
            500, 35
          ]
        ]
      ],
      'cities': [
        'let', 'data_prop', ['get', 'PROP'],
        [
          'interpolate', ['linear'], ['zoom'],
          3, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 1,
            0, 1,
            60, 5,
            500, 5
          ],
          12, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 2,
            0, 1,
            60, 25,
            500, 25
          ]
        ]
      ],
      'tracts': [
        'let', 'data_prop', ['get', 'PROP'],
        [
          'interpolate', ['linear'], ['zoom'],
          8, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 1.5,
            0, 1,
            60, 7,
            500, 7
          ],
          12, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 3,
            0, 2,
            60, 35,
            500, 35
          ]
        ]
      ],
      'block-groups': [
        'let', 'data_prop', ['get', 'PROP'],
        [
          'interpolate', ['linear'], ['zoom'],
          8, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 1,
            0, 0.5,
            60, 5,
            500, 5
          ],
          12, [
            'interpolate', ['linear'], ['number', ['var', 'data_prop']],
            -1, 2,
            0, 2,
            60, 25,
            500, 25
          ]
        ]
      ]
    }
  }
];
