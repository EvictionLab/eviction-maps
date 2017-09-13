export interface MapFeature {
    type: string;
    layer: Object;
    geometry: any;
    properties: {
        [name: string]: string
    };
}
