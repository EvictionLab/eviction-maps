import { MapLayerGroup } from '../map/map-layer-group';

export const DataLevels: Array<MapLayerGroup> = [
    {
       'id': 'blockgroups',
       'name': 'Block Groups',
       'layerIds': [
          'blockgroups',
          'blockgroups_stroke',
          'blockgroups_bubbles',
          'blockgroups_text',
          'blockgroups_hover'
       ],
       'zoom': [ 10, 16 ]
    },
    {
       'id': 'zipcodes',
       'name': 'Zip Codes',
       'layerIds': [
        'zipcodes',
        'zipcodes_stroke',
        'zipcodes_bubbles',
        'zipcodes_text',
        'zipcodes_hover'
       ],
       'zoom': [ 9, 10 ]
    },
    {
       'id': 'tracts',
       'name': 'Tracts',
       'layerIds': [
          'tracts',
          'tracts_stroke',
          'tracts_bubbles',
          'tracts_text',
          'tracts_hover'
       ],
       'zoom': [ 8, 9 ]
    },
    {
       'id': 'cities',
       'name': ' Cities',
       'layerIds': [
          'cities',
          'cities_stroke',
          'cities_bubbles',
          'cities_text',
          'cities_hover'
       ]
    },
    {
       'id': 'counties',
       'name': 'Counties',
       'layerIds': [
          'counties',
          'counties_stroke',
          'counties_bubbles',
          'counties_text',
          'counties_hover'
       ],
       'zoom': [ 5, 8 ]
    },
    {
       'id': 'states',
       'name': 'States',
       'layerIds': [
          'states',
          'states_stroke',
          'states_bubbles',
          'states_text',
          'states_hover'
       ],
       'zoom': [ 0, 5 ]
    }
 ];
