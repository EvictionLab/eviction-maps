import { MapLayerGroup } from '../map/map-layer-group';

export const DataLevels: Array<MapLayerGroup> = [
    {
       'id': 'blockgroups',
       'name': 'Block Groups',
       'layerIds': [
          'blockgroups',
          'blockgroups_stroke',
          'blockgroups_bubbles',
          'blockgroups_text'
       ],
       'minzoom': 7,
       'zoom': [ 10, 16 ]
    },
    {
       'id': 'zipcodes',
       'name': 'Zip Codes',
       'layerIds': [
        'zipcodes',
        'zipcodes_stroke',
        'zipcodes_bubbles',
        'zipcodes_text'
       ],
       'minzoom': 6,
       'zoom': [ 9, 10 ]
    },
    {
       'id': 'tracts',
       'name': 'Tracts',
       'layerIds': [
          'tracts',
          'tracts_stroke',
          'tracts_bubbles',
          'tracts_text'
       ],
       'minzoom': 7,
       'zoom': [ 8, 9 ]
    },
    {
       'id': 'cities',
       'name': ' Cities',
       'layerIds': [
          'cities',
          'cities_stroke',
          'cities_bubbles',
          'cities_text'
       ],
       'minzoom': 0,
    },
    {
       'id': 'counties',
       'name': 'Counties',
       'layerIds': [
          'counties',
          'counties_stroke',
          'counties_bubbles',
          'counties_text'
       ],
       'minzoom': 0,
       'zoom': [ 5, 8 ]
    },
    {
       'id': 'states',
       'name': 'States',
       'layerIds': [
          'states',
          'states_stroke',
          'states_bubbles',
          'states_text'
       ],
       'minzoom': 0,
       'zoom': [ 0, 5 ]
    }
 ];
