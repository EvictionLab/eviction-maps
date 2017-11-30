import { MapDataObject } from './map-data-object';

export interface MapLayerGroup extends MapDataObject {
    id: string;
    name: string;
    langKey?: string;
    layerIds?: string[];
    zoom?: Array<number>;
    minzoom: number;
}
