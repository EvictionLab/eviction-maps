export interface MapFeature extends GeoJSON.Feature<GeoJSON.GeometryObject> {
    bbox?: number[];
    properties: {
        [n: string]: string;
    };
}
