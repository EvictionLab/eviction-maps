import { MapDataObject } from './map-data-object';

export interface MapDataAttribute extends MapDataObject {
  id: string;
  type?: string;
  langKey: string;
  yearAttr?: string;
  hintKey?: string;
  order?: number;
  name?: string;
  format?: string;
  default?: string | number;
  stops?: {
      [id: string]: Array<Array<any>>
  };
  expressions?: {
      [id: string]: Array<any>
  };
}
