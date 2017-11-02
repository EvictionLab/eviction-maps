export interface MapFeature extends GeoJSON.Feature<GeoJSON.GeometryObject> {
    properties: {
        [n: string]: string
    };
}
