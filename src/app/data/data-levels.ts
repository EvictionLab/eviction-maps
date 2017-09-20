import { MapLayerGroup } from '../map/map-layer-group';

export const DataLevels: Array<MapLayerGroup> = [
    {
       'id': 'blockgroups-2010',
       'name': 'Block Groups',
       'layerIds': [
          'blockgroups-2010',
          'blockgroups_stroke-2010',
          'blockgroups_bubbles-2010',
          'blockgroups_text-2010',
          'blockgroups_hover-2010'
       ],
       'zoom': [ 10, 16 ]
    },
    {
       'id': 'zipcodes-2010',
       'name': 'Zip Codes',
       'layerIds': [
        'zipcodes-2010',
        'zipcodes_stroke-2010',
        'zipcodes_bubbles-2010',
        'zipcodes_text-2010',
        'zipcodes_hover-2010'
       ],
       'zoom': [ 9, 10 ]
    },
    {
       'id': 'tracts-2010',
       'name': 'Tracts',
       'layerIds': [
          'tracts-2010',
          'tracts_stroke-2010',
          'tracts_bubbles-2010',
          'tracts_text-2010',
          'tracts_hover-2010'
       ],
       'zoom': [ 8, 9 ]
    },
    {
       'id': 'cities-2010',
       'name': ' Cities',
       'layerIds': [
          'cities-2010',
          'cities_stroke-2010',
          'cities_bubbles-2010',
          'cities_text-2010',
          'cities_hover-2010'
       ]
    },
    {
       'id': 'counties-2010',
       'name': 'Counties',
       'layerIds': [
          'counties-2010',
          'counties_stroke-2010',
          'counties_bubbles-2010',
          'counties_text-2010',
          'counties_hover-2010'
       ],
       'zoom': [ 5, 8 ]
    },
    {
       'id': 'states-2010',
       'name': 'States',
       'layerIds': [
          'states-2010',
          'states_stroke-2010',
          'states_bubbles-2010',
          'states_text-2010',
          'states_hover-2010'
       ],
       'zoom': [ 0, 5 ]
    }
 ];
