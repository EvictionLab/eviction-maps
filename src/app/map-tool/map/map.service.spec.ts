import { TestBed, inject } from '@angular/core/testing';

import { MapService } from './map.service';

describe('MapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService]
    });
  });

  it('should be created', inject([MapService], (service: MapService) => {
    expect(service).toBeTruthy();
  }));

  it('should return null from getUnionFeature with an empty array',
    inject([MapService], (service: MapService) => {
      const featureStub = {
        type: 'Feature',
        properties: { 'n': 'name' },
        geometry: { type: 'Polygon', coordinates: [] }
      } as GeoJSON.Feature<GeoJSON.Polygon>;
      const mapboxStub = {
        queryRenderedFeatures: (a, b) => []
      };
      service.setMapInstance(mapboxStub);
      expect(service.getUnionFeature('layer', featureStub)).toEqual(null);
    }
  ));

  it('should return a Feature if features returned from getUnionFeature',
    inject([MapService], (service: MapService) => {
      const featureStub = {
        type: 'Feature',
        properties: { 'n': 'name' },
        geometry: { type: 'Polygon', coordinates: [[[1, 1], [2, 2]]] }
      } as GeoJSON.Feature<GeoJSON.Polygon>;
      const mapboxStub = {
        queryRenderedFeatures: (a, b) => [featureStub]
      };
      service.setMapInstance(mapboxStub);
      expect(service.getUnionFeature('layer', featureStub)).toBeTruthy();
    }
  ));
});
