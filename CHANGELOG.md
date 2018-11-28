# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.3] - 2018-11-28
### Fixed
  - Eviction data is properly removed from the map when selecting "None"

## [1.1.2] - 2018-09-06
### Added
  - changelog
### Fixed
  - add override for Milwaukee in search so center point is correct (Fixes #1187)

## [1.1.1] - 2018-05-13
### Fixed
  - Fixes search zoom level so places like Memphis work (Fixes #1176)
  - Adds checks on features when assigning geoDepth (Fixes (#1174)
  - Hides overflow on line graph tooltips on embed to fix issue with overflowing on embeds

## [1.1.0] - 2018-05-04
### Added
  - Embeddable graphs
  - Linking to the map from rankings
  - Link to media guide
### Fixed
  - Analytics tracking for tertiarySelection
  - Graph stays within provided minVal and maxVal
  - properties is undefined error when setting highlights

## [1.0.6] - 2018-04-06
### Changed
  - Compact legend style adjustment on embeds
  - Add link in rankings intro
### Fixed
  - Do not try and call map functions when it is unavailable
  - Add unsupported message to map embeds when maps are not supported.

## [1.0.5] - 2018-04-25
### Fixed
  - load language in an object for the header instead of using translate pipe (issue #1140)
  - do not generate tweet if location is unavailable (issue #1138)
  - don't update highlights if features unavailable (issue #1139)
  - debounce route updates (issue #1142)

## [1.0.4] - 2018-04-22
### Changed
  - add labels in embed legend
  - link to map from embed
  - switch translate loader
  - add link to media guide
### Fixed
  - fix error with keyboard nav in dropdowns
  - fix error with bar graph as default selection
  - fix bug with stacked bars in graph when location name is not unique

## [1.0.3] - 2018-04-13
### Fixed
  - updates links from menu / footer to maintain spanish language if selected
  - updates the error message on max locations and expands the cards as a visual cue
  - split cards after eviction data, use "census demographics" label
  - map card style adjustments
  - hero style updates on rankings
  - tapping on map closes cards on touch devices
  - fix vh sizing for browsers with collapsible location bar
  - Skip the first emitted value when resizing map height

## [1.0.2] - 2018-04-09
### Changed
  - Switches to Mapbox basemap instead of self hosted OpenMapTiles
### Fixed
  - update menu focus states
  - spacing in subnav on rankings to accommodate long spanish page names
  - update wording on rankings to remove area (english only)


## [1.0.0] - 2018-04-06
### Added
  - First release of Eviction Lab mapping tool