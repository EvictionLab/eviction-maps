# United States GeoJSON / mbtiles

This repository contains GeoJSON and mbtiles for the United States on the following levels:

- Country
- State
- County
- City
- Tract
- Block Group

## Collecting and Converting Data

This section contains the method that was used to retrieve the data and produce GeoJSON and mbtiles files.

### Prerequisites

These steps were completed on OSX, but should work in any unix environment.  The system must have Node.js installed, and npm.

To generate GeoJSON from shape files, you will need the  [shapefile](https://www.npmjs.com/package/shapefile) npm package.

```bash
$: npm install -g shapefile
```

To merge GeoJSON data into one file, geojson-merge will be used.

```bash
npm install -g @mapbox/geojson-merge
```

To generate vector map tiles from GeoJSON, you will need tippecanoe.

```bash
$: brew install tippecanoe
```

## Retrieving the data

The data is collected from the [United States Census Bureau Mapping Data](https://www.census.gov/geo/maps-data/).  Shapefiles have been collected from the public FTP sites below:

  - [Block Groups](ftp://ftp2.census.gov/geo/tiger/TIGER2016/BG/)
  - [Tract](ftp://ftp2.census.gov/geo/tiger/TIGER2016/TRACT/)
  - [Cities](ftp://ftp2.census.gov/geo/tiger/TIGER2016/CONCITY/)
  - [Counties](ftp://ftp2.census.gov/geo/tiger/TIGER2016/COUNTY/)
  - [States](ftp://ftp2.census.gov/geo/tiger/TIGER2016/STATE/)

## Converting the Shapefiles to GeoJSON

Shapefiles were downloaded into corresponding directories based on what they represent (block groups, tract, etc). Go into each folder and then unzip all of the shapefiles in that folder:

```bash
$: cd block-groups
$: unzip \*.zip
```

Afterwards, convert the unzipped shapefiles to GeoJSON.

```bash
$: for f in ./*.shp; do shp2json $f >"${f%.*}.geojson"; done
```

Then clean up the other files so only the GeoJSON is left.

```bash
$: rm -f *.shp *.shx *.xml *.prj *.dbf *.cpg *.zip
```

## Merging GeoJSON Files

For block groups, tracts, cities, and counties we want to combine the GeoJSON files that are separated by state so that there is one GeoJSON file that represents the country.

> Note: Files could be too big to merge using geojson-merge.  If an error occurs, try merging ~15 files at a time and then manually combining them using Sublime Text or another editor that can handle large files.

## Converting GeoJSON to Vector Tiles

Use tippecanoe to generate an .mbtiles file from the GeoJSON files.  You should limit the maximum zoom level of the generated tiles using the `-z` option.  Look at the [tippecanoe documentation](https://github.com/mapbox/tippecanoe#options) for all command line options.

```bash
$: tippecanoe -z 10 -o output_name.mbtiles input_name.geojson
```

After the mbtiles file is generated, you can use docker to preview the vector tiles:

```bash
docker run -it -v $(pwd):/data -p 8080:80 klokantech/tileserver-gl --verbose block-groups.mbtiles
```
