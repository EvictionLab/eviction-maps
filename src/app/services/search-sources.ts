import { environment } from '../../environments/environment';
import { MapFeature } from '../map-tool/map/map-feature';

export interface SearchSource {
    key: string;
    baseUrl: string;
    csvUrl?: string;
    featureList?: MapFeature[];
    query(text: string): string;
    results(results: Object, text?: string): MapFeature[];
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
    results: function (results: Object, text?: string): MapFeature[] {
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
    key: environment.mapboxApiKey,
    baseUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
    csvUrl: environment.mapboxCountyUrl,
    featureList: [],
    query: function (text: string) {
        const queryParams = [
            `access_token=${this.key}`,
            'country=us',
            'autocomplete=true',
            'types=region,district,place,locality,address'
        ];
        return `${this.baseUrl}${text}.json?${queryParams.join('&')}`;
    },
    results: function (results: Object, text?: string) {
        const layerMap = {
            'region': 'states',
            'district': 'cities',
            'place': 'cities',
            'locality': 'cities'
        };

        const countyFeatures = this.featureList.filter(f => {
            return f.properties.label.toLowerCase().startsWith(text.toLowerCase());
        }).map(f => { f.center = f.geometry.coordinates; return f; });

        return countyFeatures.concat(results['features'].map(r => {
            r.properties.label = r.place_name;
            r.properties.layerId = layerMap.hasOwnProperty(r.place_type[0]) ?
                layerMap[r.place_type[0]] : 'block-groups';
            return r;
        }));
    }
};

export const OSMNamesSource: SearchSource = {
    key: 'ECgM5z4CQXQEdoCqJpBt',
    baseUrl: 'https://geocoder.tilehosting.com/us/q/',
    query: function (text: string): string {
        return `${this.baseUrl}${text}.js?key=${this.key}`;
    },
    results: function (results: Object, text?: string): MapFeature[] {
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
