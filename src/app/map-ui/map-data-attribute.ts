export interface MapDataAttribute {
    id: string;
    name: string;
    fillStops: {
        [id: string]: Array<Array<any>>
    };
}
