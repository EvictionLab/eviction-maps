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

