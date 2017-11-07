[![Build Status](https://travis-ci.org/EvictionLab/eviction-maps.svg?branch=master)](https://travis-ci.org/EvictionLab/eviction-maps)

# EvictionMaps

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Deep Linking

The following options can be set through app routes or URL parameters:

  - Locations
  - Map Bounds
  - Eviction Type
  - Choropleth Highlight
  - Geography Layer

## Routes

Routes for the app are as follows:

http://{{BASE_URL}}/:locations/:year/:geography/:type/:choropleth/:bounds

With the following options

  - `:locations`: a list of locations separated by `+`.  Each location is formatted as `{{layerId}},{{x}},{{y}}`.  Set to `none` for no active locations.
    - e.g. `states,257,381+counties,230,385` would activate Illinois and Kearney County
  - `:year`: a year anywhere from 1990 to 2016
  - `:geography`: `states`, `counties`, `cities`, `zip-codes`, `tracts`, or `block-groups`. 
  - `:type`: an ID for the corresponding `BubbleAttribute` (`er` or `efr`)
  - `:choropleth`: an ID for the corresponding choropleth `DataAttribute` (`p` or `pr`, more to come)
  - `:bounds` a comma separated bounding box for the map to zoom to `{{west}},{{south}},{{east}},{{north}}`

Data must be set through routes in this order `:locations/:year/:geography/:type/:choropleth/:bounds`.  If you want to set only one of these parameters, use the URL Parameters.

## URL Parameters

Map settings can also be set through URL parameters instead of routes, with the following format:

http://{{BASE_URL}}/link;locations={{locations}};year={{year}};geography={{geography}};type={{type}};choropleth={{choropleth}};bounds={{bounds}}

All settings are optional, so you could set only the year, eviction rate bubbles, and bounds with:

http://{{BASE_URL}}/link;year=2015;type=er;bounds=-92.52,38.25,-86.53,41.76

### Getting the Current URL Parameters

A string of the URL parameters based on the current view is available using `DataService.getUrlParameters()`, which returns a string of parameters based on the current view.  (e.g. `year=2015;type=er;bounds=-92.52,38.25,-86.53,41.76`).

# App Components 

## `app-map`

### Inputs

    - boundingBox: used to set the location displayed in the map
    - autoSwitch: determines if the data levels should auto switch based on zoom level

### Outputs

    - yearChange: emits the year when it is changed
    - evictionTypeChange: emits the eviction type string when changed
    - featureClick: emits a feature when on is clicked on the map
    - featureHover: emits a feature when one is hovered in the map
    - bboxChange: emits the bounding box anytime the map finished moving

### Methods

    - enableZoom(): enables scroll to zoom on map
    - disableZoom(): disables scroll to zoom on map


## `app-location-cards`

### Inputs

    - features: an array of features to display cards form
    - year: the year to display data for in the card
    - cardProperties: an object containing the property names to show, and the corresponding label.  e.g. `{ 'e': 'Eviction Rate' }`

### Outputs

    - viewMore: emits when the "View More" button is clicked
    - dismissCard: emits the feature when the close button is clicked


## `app-data-panel`

### Inputs

    - locations: an array of features representing different locations
    - year: the year to display data for
    
### Outputs

    - locationAdded: TODO
    - locationRemoved: emits the feature that remove was triggered for

# UI Components 

## `app-ui-slider`

## `app-ui-toggle`

## `app-ui-select`

### Inputs
  - `values`: an aray of values or objects to select from
  - `selectedValue`: an optional value to select by default
  - `labelProperty`: an optional property to use for the item label if an object array is passed to `values`
  - `label`: label the input field

### Outputs
  - `change`: emits the selected value on change

## `app-ui-hint`

## `app-ui-dialog`

## `app-progress-bar`

## `app-predictive-search`

