# `app-map`

## Inputs

    - location: used to set the location displayed in the map
    - autoSwitch: determines if the data levels should auto switch based on zoom level

## Outputs

    - yearChange: emits the year when it is changed
    - evictionTypeChange: emits the eviction type string when changed
    - featureClick: emits a feature when on is clicked on the map
    - featureHover: emits a feature when one is hovered in the map

## Methods


# `app-location-cards`

## Inputs

    - features: an array of features to display cards form

## Outputs

    - viewMoreClick: emits when the "Show More" button is clicked
    - dismissCard: emits the feature when the close button is clicked


# `app-data-panel`

## Inputs

    - features
    
## Outputs

    - locationAdded
    - locationRemoved
