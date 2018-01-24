import { TestBed, inject } from '@angular/core/testing';
import { MapFeature } from './map-feature';
import { MapService } from './map.service';

describe('MapService', () => {
  let mapFeatureStub: MapFeature;
  let featureStub: GeoJSON.Feature<GeoJSON.Polygon>;
  let mapboxStub;
  let spy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService]
    });

    featureStub = {
      type: 'Feature',
      bbox: [-1, -1, 1, 1],
      properties: { n: 'name', layerId: 'layer', GEOID: '1' },
      geometry: { type: 'Polygon', coordinates: [] }
    } as GeoJSON.Feature<GeoJSON.Polygon>;
    mapFeatureStub = featureStub as MapFeature;
    mapboxStub = {
      queryRenderedFeatures: (a, b) => [featureStub]
    };
  });

  it('should be created', inject([MapService], (service: MapService) => {
    expect(service).toBeTruthy();
  }));

  it('should return null from getUnionFeature with an empty array',
    inject([MapService], (service: MapService) => {
      mapboxStub.queryRenderedFeatures = (a, b) => [];
      service.setMapInstance(mapboxStub);
      expect(service.getUnionFeature('layer', featureStub)).toEqual(null);
    }
  ));

  it('should return a Feature if features returned from getUnionFeature',
    inject([MapService], (service: MapService) => {
      service.setMapInstance(mapboxStub);
      expect(service.getUnionFeature('layer', featureStub)).toBeTruthy();
    }
  ));

  it('highlight features should create a union feature if rendered features are present',
    inject([MapService], (service: MapService) => {
      service.setMapInstance(mapboxStub);
      spyOn(service, 'getSourceData').and.returnValue([]);
      spyOn(service, 'hasRenderedFeatures').and.returnValue(true);
      spyOn(service, 'setSourceData');
      spy = spyOn(service, 'getUnionFeature').and.returnValue(featureStub);
      service.updateHighlightFeatures('layer', [mapFeatureStub]);

      expect(service.getUnionFeature).toHaveBeenCalledWith('layer', mapFeatureStub);
    }
  ));

  it('highlight features should use existing feature, updating color if in current features',
    inject([MapService], (service: MapService) => {
      service.setMapInstance(mapboxStub);
      const altFeature = featureStub;
      altFeature.properties = {
        ...altFeature.properties, alt: true
      };
      spyOn(service, 'getSourceData').and.returnValue([altFeature]);
      spyOn(service, 'hasRenderedFeatures').and.returnValue(false);
      spyOn(service, 'setSourceData').and.callFake(function() {
        const feat = arguments[1][0];
        expect(feat.properties.alt).toBeTruthy();
        expect(feat.properties.color).toEqual('#e24000');
      });
      service.updateHighlightFeatures('layer', [mapFeatureStub]);
    }
  ));

  it('highlight features should add from bbox if no geometry and not present',
    inject([MapService], (service: MapService) => {
      service.setMapInstance(mapboxStub);
      spyOn(service, 'getSourceData').and.returnValue([]);
      spyOn(service, 'hasRenderedFeatures').and.returnValue(false);
      spyOn(service, 'setSourceData').and.callFake(function() {
        const features = arguments[1];
        expect(features.length).toEqual(1);
      });
      service.updateHighlightFeatures('layer', [mapFeatureStub]);
    })
  );

  it('highlight features should not add null feature',
    inject([MapService], (service: MapService) => {
      service.setMapInstance(mapboxStub);
      spyOn(service, 'getSourceData').and.returnValue([]);
      spyOn(service, 'hasRenderedFeatures').and.returnValue(true);
      spyOn(service, 'getUnionFeature').and.returnValue(null);
      spyOn(service, 'setSourceData');
      service.updateHighlightFeatures('layer', [mapFeatureStub]);
      expect(service.setSourceData).toHaveBeenCalledWith('highlight', []);
    })
  );
});
