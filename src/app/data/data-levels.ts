import { MapLayerGroup } from '../map-tool/map/map-layer-group';

export const DataLevels: Array<MapLayerGroup> = [
  {
    'id': 'states',
    'name': 'States',
    'langKey': 'LAYERS.STATES',
    'layerIds': [
      'states',
      'states_stroke',
      'states_bubbles',
      'states_text',
      'states_null'
    ],
    'minzoom': 0,
    'zoom': [0, 7]
  },
  {
    'id': 'counties',
    'name': 'Counties',
    'langKey': 'LAYERS.COUNTIES',
    'layerIds': [
      'counties',
      'counties_stroke',
      'counties_bubbles',
      'counties_text',
      'counties_null'
    ],
    'minzoom': 0,
    'zoom': [7, 9]
  },
  {
    'id': 'cities',
    'name': ' Cities',
    'langKey': 'LAYERS.CITIES',
    'layerIds': [
      'cities',
      'cities_stroke',
      'cities_bubbles',
      'cities_text',
      'cities_null'
    ],
    'minzoom': 7,
    'zoom': [9, 11]
  },
  {
    'id': 'tracts',
    'name': 'Tracts',
    'langKey': 'LAYERS.TRACTS',
    'layerIds': [
      'tracts',
      'tracts_stroke',
      'tracts_bubbles',
      'tracts_text',
      'tracts_null'
    ],
    'minzoom': 7,
    'zoom': [11, 13]
  },
  {
    'id': 'block-groups',
    'name': 'Block Groups',
    'langKey': 'LAYERS.BLOCK_GROUPS',
    'layerIds': [
      'block-groups',
      'block-groups_stroke',
      'block-groups_bubbles',
      'block-groups_text',
      'block-groups_null'
    ],
    'minzoom': 7,
    'zoom': [13, 16]
  }
];
