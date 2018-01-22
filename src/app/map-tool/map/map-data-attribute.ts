import { MapDataObject } from './map-data-object';

export interface MapDataAttribute extends MapDataObject {
    id: string;
    name: string;
    langKey?: string;
    format?: string;
    default?: string | number;
    stops?: {
        [id: string]: Array<Array<any>>
    };
    expressions?: {
        [id: string]: Array<any>
    };
}
