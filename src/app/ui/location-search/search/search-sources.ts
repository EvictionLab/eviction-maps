import { MapFeature } from '../../../map-tool/map/map-feature';

export interface SearchSource {
    key: string;
    baseUrl: string;
    query(text: string): string;
    results(results: Object): MapFeature[];
}

export const MapzenSource: SearchSource = {
    key: 'mapzen-FgUaZ97',
    baseUrl: 'https://search.mapzen.com/v1/autocomplete?',
    query: function (text: string): string {
        const mapzenParams = [
            'sources=whosonfirst,openstreetmap',
            'layers=address,localadmin,locality,county,region,postalcode',
            'boundary.country=USA',
            'api_key=' + this.key
        ];
        return `${this.baseUrl}text=${text}&${mapzenParams.join('&')}`;
    },
    results: function(results: Object): MapFeature[] {
        const layerMap = {
            'region': 'states',
            'county': 'counties',
            'locality': 'cities',
            'localadmin': 'cities',
            'postalcode': 'zip-codes'
        };
        return results['features'].map(f => {
            f.properties.layerId = layerMap.hasOwnProperty(f.properties.layer) ?
                layerMap[f.properties.layer] : 'block-groups';
            return f;
        });
    }
};

export const MapboxSource: SearchSource = {
    key: 'pk.eyJ1IjoiZXZpY3Rpb24tbGFiIiwiYSI6ImNqYzJoNzVxdzAwMTMzM255dmsxM2YwZWsifQ.4et5d5nstXWM5P0JG67XEQ',
    baseUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
    query: function(text: string) {
        const queryParams = [
            `access_token=${this.key}`,
            'country=us',
            'autocomplete=true',
            'types=region,district,place,locality,address'
        ];
        return `${this.baseUrl}${text}.json?${queryParams.join('&')}`;
    },
    results: function(results: Object) {
        const layerMap = {
            'region': 'states',
            'district': 'cities',
            'place': 'cities',
            'locality': 'cities'
        };

        return results['features'].map(r => {
            r.properties.label = r.place_name;
            r.properties.layerId = layerMap.hasOwnProperty(r.place_type[0]) ?
                layerMap[r.place_type[0]] : 'block-groups';
            return r;
        });
    }
};

export const OSMNamesSource: SearchSource = {
    key: 'ECgM5z4CQXQEdoCqJpBt',
    baseUrl: 'https://geocoder.tilehosting.com/us/q/',
    query: function (text: string): string {
        return `${this.baseUrl}${text}.js?key=${this.key}`;
    },
    results: function(results: Object): MapFeature[] {
        return results['results'].map(r => {
            // Determine layer
            let layerId = 'cities';
            if (r.name === r.county) {
                layerId = 'counties';
            } else if (r.name === r.state) {
                layerId = 'states';
            }

            return {
                bbox: r.boundingbox,
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [r.lon, r.lat]
                },
                properties: {
                    ...r, layerId: layerId,
                    label: `${r.name}, ${r.name_suffix}`,
                }
            };
        });
    }
};
