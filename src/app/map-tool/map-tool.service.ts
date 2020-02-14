import { Injectable, EventEmitter } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import "rxjs/add/observable/forkJoin";
import * as _isEqual from "lodash.isequal";
import * as polylabel from "polylabel";
import * as geoViewport from "@mapbox/geo-viewport";

import { environment } from "../../environments/environment";
import { PlatformService } from "../services/platform.service";
import { MapDataAttribute } from "./data/map-data-attribute";
import { MapLayerGroup } from "./data/map-layer-group";
import { MapFeature } from "./map/map-feature";

import { AnalyticsService } from "../services/analytics.service";
import { DataService } from "../services/data.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";

@Injectable()
export class MapToolService {
  /** Attributes to track the current state */
  activeYear;
  activeFeatures: MapFeature[] = [];
  activeDataLevel: MapLayerGroup = this.dataLevels[0];
  activeDataHighlight: MapDataAttribute = this.choroplethAttributes[0];
  activeBubbleHighlight: MapDataAttribute = this.bubbleAttributes[0];
  activeGraphType = "line";
  graphDisplayCI = true;
  activeLineYearStart = environment.minYear;
  activeLineYearEnd = environment.maxYear;
  activeShowGraphAvg = true;
  cardsCollapsed = false;
  embed = false;
  kiosk = false;
  activeMapView;
  mapConfig;
  usAverage;
  usAverageLoaded = new EventEmitter<any>();
  state = new BehaviorSubject<any>({});
  private _activeFeatures = new BehaviorSubject<Array<MapFeature>>([]);

  get choroplethAttributes() {
    return this.dataAttributes.filter(d => d.type === "choropleth");
  }
  get bubbleAttributes() {
    return this.dataAttributes.filter(d => d.type === "bubble");
  }
  get cardAttributes() {
    return this.dataAttributes.filter(d => d.id !== "none");
  }
  get dataAttributes() {
    return this.dataService.dataAttributes;
  }
  get dataLevels() {
    return this.dataService.dataLevels;
  }

  constructor(
    private translate: TranslateService,
    private analytics: AnalyticsService,
    private platform: PlatformService,
    private dataService: DataService
  ) {
    this.kiosk = this.platform.nativeWindow.location.hostname.includes("kiosk");
    this.dataService
      .getNationalData()
      .take(1)
      .subscribe(data => {
        this.usAverage = data;
        this.usAverageLoaded.emit();
      });
    this.setState({
      year: this.activeYear,
      bubble: this.activeBubbleHighlight,
      choro: this.activeDataHighlight,
      region: this.activeDataLevel
    });
  }

  setState(newState: any) {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      ...newState
    });
  }

  /**
   * Sets the choropleth layer based on the provided `DataAttributes` ID
   * @param id string corresponding to the `MapDataAttribute` in `DataAttributes`
   */
  setChoroplethHighlight(id: string) {
    const dataAttr = this.choroplethAttributes.find(attr => attr.id === id);
    if (dataAttr) {
      this.activeDataHighlight = dataAttr;
      this.setState({
        choro: this.activeDataHighlight
      });
    }
  }

  /**
   * Sets the bubble layer based on the provided `BubbleAttributes` ID
   * @param id string corresponding to the `MapDataAttribute` in `BubbleAttributes`
   */
  setBubbleHighlight(id: string) {
    const bubbleAttr = this.bubbleAttributes.find(attr => attr.id === id);
    if (bubbleAttr) {
      this.activeBubbleHighlight = bubbleAttr;
      this.setState({
        bubble: this.activeBubbleHighlight
      });
    }
  }

  /**
   * Sets the layer geography based on the provided `DataLevels` ID
   * @param id string of the MapLayerGroup in `DataLevels`
   */
  setGeographyLevel(id: string) {
    const geoLevel = this.dataLevels.find(level => level.id === id);
    if (geoLevel) {
      this.activeDataLevel = geoLevel;
      this.setState({
        region: this.activeDataLevel
      });
    }
  }

  setActiveYear(year: number) {
    this.activeYear = year;
    this.setState({
      year: this.activeYear
    });
  }

  /** Sets the type of graph to show in the data panel */
  setGraphType(type: string) {
    this.activeGraphType = type;
  }

  setLineYears(years: any) {
    console.log("update years", years);
    this.activeLineYearStart = years.start;
    this.activeLineYearEnd = years.end;
  }

  /** */
  setLocations(locations) {
    locations.forEach(l => {
      this.dataService.getTileData(l.geoid, l.lonLat, true).subscribe(
        data => {
          this.addLocation(data);
        },
        err => {
          console.error(err.message);
        }
      );
    });
  }

  /**
   * Sets the bounding box for the map to focus to
   * @param mapBounds an array with four coordinates representing west, south, east, north
   */
  setMapBounds(mapBounds: Array<any>) {
    this.activeMapView = mapBounds.map(b => +b);
    this.mapConfig = {
      ...this.mapConfig,
      ...geoViewport.viewport(this.activeMapView, [
        this.platform.viewportWidth,
        this.platform.viewportHeight
      ])
    };
  }

  /**
   * Configures the data service based on any route parameters
   */
  setCurrentData(data: Object) {
    this.translate.use(data["lang"] || "en");
    if (data["year"]) {
      this.setActiveYear(data["year"]);
    }
    if (data["geography"]) {
      const geo = data["geography"];
      if (geo !== "auto") {
        this.setGeographyLevel(geo);
      }
    }
    if (data["bounds"]) {
      const b = data["bounds"].split(",");
      if (b.length === 4) {
        this.setMapBounds(b);
      }
    }
    if (data["choropleth"]) {
      this.setChoroplethHighlight(data["choropleth"]);
    }
    if (data["type"]) {
      this.setBubbleHighlight(data["type"]);
    }
    if (data["locations"]) {
      const locations = this.getLocationsFromString(data["locations"]);
      this.setLocations(locations);
    }
    if (data["graph"]) {
      this.setGraphType(data["graph"]);
    }
  }

  getCurrentData() {
    const locations = this.activeFeatures
      .map((f, i, arr) => {
        const lonLat = this.getFeatureLonLat(f).map(
          v => Math.round(v * 1000) / 1000
        );
        return `${f.properties["GEOID"]},${lonLat[0]},${lonLat[1]}`;
      })
      .join("+");
    return {
      year: this.activeYear,
      geography: this.activeDataLevel.id,
      bounds: this.activeMapView ? this.activeMapView.join() : null,
      lang: this.translate.currentLang,
      type: this.stripYearFromAttr(this.activeBubbleHighlight.id),
      choropleth: this.stripYearFromAttr(this.activeDataHighlight.id),
      locations: locations,
      graph: this.activeGraphType
    };
  }

  /**
   * Gets a string representing the current state for analytics tracking. String
   * is formatted as:
   *    <Map OR Rankings>|<evictionDataType>|<censusDataSelected>|<locationSelectedLevel>|
   *    <First Location Selected>|<number of locations selected>
   */
  getCurrentDataString() {
    const numSelected = this.activeFeatures.length;
    const firstSelected =
      numSelected > 0
        ? this.getFullLocationName(this.activeFeatures[0])
        : "none";
    const data = [
      "map-tool",
      this.activeBubbleHighlight.langKey,
      this.activeDataHighlight.langKey,
      this.activeDataLevel.langKey,
      firstSelected,
      numSelected
    ];
    return data.join("|");
  }

  /**
   * Removes a location from the cards and data panel
   */
  removeLocation(feature) {
    const featuresCopy = this.activeFeatures.slice();
    const i = featuresCopy.findIndex(f => _isEqual(f, feature));
    if (i > -1) {
      featuresCopy.splice(i, 1);
      this.setActiveFeatures(featuresCopy);
    }
  }

  /**
   * Adds or updates a location to the cards and data panel
   * @param feature the feature for the corresponding location to add
   * @returns boolean based on if the max number of locations is reached or not
   */
  addLocation(feature): boolean {
    const exists = this.activeFeatures.find(
      f => f.properties.GEOID === feature.properties.GEOID
    );
    if (exists) {
      return null;
    }
    // Process feature if bbox and layerId not included based on current data level
    if (!(feature.bbox && feature.properties.layerId)) {
      feature = this.dataService.processMapFeature(feature);
    }
    const maxLocations = this.activeFeatures.length >= 3;
    if (!maxLocations) {
      // Add flag properties
      this.addDisplayName(feature);
      this.addFlaggedProps(feature);
      this.setActiveFeatures([...this.activeFeatures, feature]);
      // track comparissons added
      if (this.activeFeatures.length === 2) {
        this.analytics.trackEvent("secondaryLocationSelection", {
          secondaryLocation: this.getFullLocationName(this.activeFeatures[1]),
          locationSelectedLevel: this.activeFeatures[1].properties.layerId,
          combinedSelections: this.getCurrentDataString()
        });
      }
      if (this.activeFeatures.length === 3) {
        this.analytics.trackEvent("tertiaryLocationSelection", {
          tertiaryLocation: this.getFullLocationName(this.activeFeatures[2]),
          locationSelectedLevel: this.activeFeatures[2].properties.layerId,
          combinedSelections: this.getCurrentDataString()
        });
      }
    }
    return maxLocations;
  }

  /**
   * Updates an active feature with updated geometry and properties
   * @param feature the active feature to update
   */
  updateLocation(feature: MapFeature) {
    // Process feature if bbox and layerId not included based on current data level
    if (!(feature.bbox && feature.properties.layerId)) {
      feature = this.dataService.processMapFeature(feature);
    }
    const newFeatures = this.activeFeatures.map(f => {
      if (feature.properties.GEOID === f.properties.GEOID) {
        f.properties = feature.properties;
        f.geometry = feature.geometry;
        this.addFlaggedProps(f);
      }
      return f;
    });
    this.setActiveFeatures(newFeatures);
  }

  /**
   * Gets a LonLat value for the center of the feature
   * @param feature
   */
  getFeatureLonLat(feature): Array<number> {
    const coords =
      feature.geometry["type"] === "MultiPolygon"
        ? feature.geometry["coordinates"][0]
        : feature.geometry["coordinates"];
    return polylabel(coords, 1.0);
  }

  /** Gets a location string for a feature, including its parent location */
  getFullLocationName(feature: MapFeature) {
    return feature.properties.n + ", " + feature.properties.pl;
  }

  /** Gets a string with all of the active locations, separated by a semicolon */
  getActiveLocationNames() {
    return this.activeFeatures.map(f => this.getFullLocationName(f)).join(";");
  }

  /** Adds a string of property names that are in the 99th percentile for the feature */
  addFlaggedProps(feature: MapFeature) {
    this.dataService
      .getOutliers()
      .take(1)
      .subscribe(flagValues => {
        if (
          !flagValues ||
          !feature.properties.layerId ||
          !(feature.properties.layerId in flagValues)
        ) {
          return;
        }
        const percentileVals = flagValues[feature.properties.layerId];
        const flaggedProps = Object.keys(percentileVals);
        feature["highProps"] = flaggedProps
          .filter((p: string) => feature.properties[p] >= percentileVals[p])
          .join(",");
      });
  }

  bindFeatureChange(handler: Function) {
    return this._activeFeatures.subscribe(f => handler(f));
  }

  private setActiveFeatures(features: Array<MapFeature>) {
    this.activeFeatures = features;
    this._activeFeatures.next(features);
  }

  /** Get location name and truncate if it's too long */
  private addDisplayName(feature: MapFeature) {
    const max = 24;
    const layerId = feature["properties"]["layerId"];
    const name = feature["properties"]["n"] as string;
    const displayName =
      name.length > max ? name.substring(0, max) + "..." : name;
    feature["displayName"] = displayName;
  }

  private stripYearFromAttr(attr: string) {
    return attr.split("-")[0];
  }

  /**
   * Gets an array of objects containing the layer type and
   * longitude / latitude coordinates for the locations in the string.
   * @param locations string that represents locations
   */
  private getLocationsFromString(locations: string) {
    return locations
      .split("+")
      .map(loc => {
        const locArray = loc.split(",");
        if (locArray.length !== 3) {
          return null;
        } // invalid location
        return {
          geoid: locArray[0],
          layer: this.dataService.getLayerFromGEOID(locArray[0]),
          lonLat: [parseFloat(locArray[1]), parseFloat(locArray[2])]
        };
      })
      .filter(loc => loc); // filter null values
  }
}
