import { MapDataObject } from './map-data-object';

export interface MapDataAttribute extends MapDataObject {
    id: string;
    name: string;
    default?: string;
    fillStops?: {
        [id: string]: Array<Array<any>>
    };
}
