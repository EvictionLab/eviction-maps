export interface MapFeature extends GeoJSON.Feature<GeoJSON.GeometryObject> {
    properties: {
        [name: string]: string
    };
}
