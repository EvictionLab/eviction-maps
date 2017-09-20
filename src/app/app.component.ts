import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MapDataAttribute } from './map/map-data-attribute';
import { MapLayerGroup } from './map/map-layer-group';
import { MapDataObject } from './map/map-data-object';
import { MapFeature } from './map/map-feature';
import { MapboxComponent } from './map/mapbox/mapbox.component';
import { MapService } from './map/map.service';
import { DataLevels } from './data/data-levels';
import { DataAttributes } from './data/data-attributes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ MapService ]
})
export class AppComponent implements OnInit {
  title = 'Eviction Lab';
  zoom: number;
  censusYear = 2010;
  dataYear = 2015;
  dataLevels: Array<MapLayerGroup> = DataLevels;
  attributes: Array<MapDataAttribute> = DataAttributes;
  hoveredFeature;
  activeFeature;
  mapFeatures: Observable<Object>;
  activeDataLevel: MapLayerGroup;
  activeDataHighlight: MapDataAttribute;
  autoSwitchLayers = true;
  mapConfig = {
    style: './assets/style.json',
    center: [-77.99, 41.041480],
    zoom: 6.5,
    minZoom: 3,
    maxZoom: 14,
    container: 'map'
  };
  legend;
  mapEventLayers: Array<string> = [
    'states-2010',
    'cities-2010',
    'tracts-2010',
    'blockgroups-2010',
    'zipcodes-2010',
    'counties-2010'
  ];
  private hover_HACK = 0; // used to ignore first hover event when on touch, temp hack

  constructor(private map: MapService) {}

  ngOnInit() {}

  isMobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
  }

  updateLegend() {
    if (!this.activeDataLevel || !this.activeDataHighlight) {
      this.legend = null;
      return;
    }
    this.legend = this.activeDataHighlight.fillStops[this.activeDataLevel.id] ||
      this.activeDataHighlight.fillStops['default'];
  }

  onMapReady(map) {
    this.map.setMapInstance(map);
    // this.setGroupVisibility(this.dataLevels[0]);
    this.activeDataLevel = this.dataLevels[4];
    this.activeDataHighlight = this.attributes[0];
    this.setDataYear(this.dataYear);
    this.onMapZoom(this.mapConfig.zoom);
    this.autoSwitchLayers = true;
  }

  /**
   * Set the zoom value for the app, auto adjust layers if enabled
   * @param zoom the current zoom level of the map
   */
  onMapZoom(zoom) {
    this.zoom = zoom;
    if (this.autoSwitchLayers) {
      const visibleGroups = this.map.filterLayerGroupsByZoom(this.dataLevels, zoom);
      if (visibleGroups.length > 0) {
        this.activeDataLevel = visibleGroups[0];
        this.mapFeatures = this.map.queryMapLayer(this.activeDataLevel);
        this.updateLegend();
      }
    }
  }

  /**
   * Updates mapFeatures on map render
   * @param event
   */
  onMapRender(event) {
    if (this.activeDataLevel) {
      this.mapFeatures = this.map.queryMapLayer(this.activeDataLevel);
    }
  }

  onFeatureClick(feature) {
    // console.log('feature click:', feature);
    if (
      this.hoveredFeature &&
      this.hoveredFeature.properties.name === feature.properties.name &&
      this.hoveredFeature.properties['parent-location'] === feature.properties['parent-location']
    ) {
      // user has hovered the feature, jump to the more data on click
      console.log('feature click', feature);
      this.activeFeature = feature;
      this.hoveredFeature = null;
    } else {
      // no hover, probably a touch device, show preview first
      this.onFeatureHover(feature);
    }
  }

  onFeatureHover(feature) {
    console.log('feature hover', feature);
    if (this.hover_HACK > 0 || !this.isMobile()) {
      this.hover_HACK = 0;
      this.hoveredFeature = feature;
      const hoverLayer =
        this.activeDataLevel.layerIds[this.activeDataLevel.layerIds.length - 1];
      if (this.hoveredFeature) {
        this.map.setLayerFilter(
          hoverLayer, [
            'all',
            ['==', 'name', this.hoveredFeature.properties.name],
            ['==', 'parent-location', this.hoveredFeature.properties['parent-location']]
          ]
        );
      } else {
        this.map.setLayerFilter(hoverLayer, ['==', 'name', '']);
      }
    } else if (this.hover_HACK === 0 && feature) {
      this.hover_HACK = 1;
    }
  }

  /**
   * Sets auto changing of layers to false, and zooms the map the selected features
   * @param feature map feature returned from select
   */
  onSearchSelect(feature: MapFeature) {
    this.autoSwitchLayers = false;
    this.map.zoomToFeature(feature);
    this.activeFeature = feature;
    this.hoveredFeature = null;
  }

  /**
   * Sets the visibility on a layer group
   * @param mapLayer the layer group that was selected
   */
  setGroupVisibility(layerGroup: MapLayerGroup) {
    this.autoSwitchLayers = false;
    layerGroup = this.addYearToObject(layerGroup, this.censusYear);
    this.dataLevels.forEach((group: MapLayerGroup) => {
      this.map.setLayerGroupVisibility(group, (group.id === layerGroup.id));
    });
    this.activeDataLevel = layerGroup;
  }

  /**
   * Sets the highlights (choropleths) to a different data property available in the tile data.
   * @param attr the map data attribute to set highlights for
   */
  setDataHighlight(attr: MapDataAttribute) {
    console.log(attr);
    this.activeDataHighlight = this.addYearToObject(attr, this.dataYear);
    this.updateLegend();
    this.mapEventLayers.forEach((layerId) => {
      const newFill = {
        'property': attr.id,
        'stops': (attr.fillStops[layerId] ? attr.fillStops[layerId] : attr.fillStops['default'])
      };
      this.map.setLayerStyle(layerId, 'fill-color', newFill);
    });
  }

  /**
   * Sets the zoom level across both the map and zoom control components
   * @param zoomLevel new zoom level
   */
  setMapZoomLevel(zoomLevel: number) {
    this.zoom = +zoomLevel;
    this.map.setZoomLevel(zoomLevel);
  }

  /**
   * Add year to data attribute or level from selector
   * @param dataObject
   * @param year
   */
  addYearToObject(dataObject: MapDataObject, year: number) {
    if (/.*\d{4}.*/g.test(dataObject.id)) {
      dataObject.id = dataObject.id.replace(/\d{4}/g, year + '');
    } else {
      dataObject.id += '-' + year;
    }
    return dataObject;
  }

  /**
   * Sets the data year for the map, updates data highlights and layers
   * @param year
   */
  setDataYear(year: number) {
    this.dataYear = year;
    this.censusYear = this.getCensusYear(year);
    this.setDataHighlight(this.addYearToObject(this.activeDataHighlight, this.dataYear));
    this.setGroupVisibility(this.addYearToObject(this.activeDataLevel, this.censusYear));
    this.updateLegend();
  }

  /**
   * Returns the nearest census year for a given year
   * @param year
   */
  getCensusYear(year: number) {
    return Math.floor(year / 10) * 10;
  }
}
