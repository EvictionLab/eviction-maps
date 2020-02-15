import { Guide } from "../guide/guide";

export const SELECTION_GUIDE: Guide = {
  id: "selections",
  steps: [
    {
      title: "Eviction Data Selection",
      content: `Start by selecting one of the eviction metrics
                that are represented by red bubbles on the map:
                <ul><li><strong>Eviction Rate:</strong> represents
                the percent of people that are evicted each year.
                (2% = 2 people per 100 renters)</li>
                <li><strong>Eviction Filing Rate:</strong> represents
                the percent of people that have evictions filed against
                them each year</li></ul>`,
      selector: ".select--bubble",
      vAlign: "bottom"
    },
    {
      title: "Census Data Selection",
      content: `Next, select a census data variable to compare
              eviction rates to.  This will help identify
              correlations between eviction rates and the census
              data of your choosing.`,
      selector: ".select--choro",
      vAlign: "bottom"
    },
    {
      title: "Map Geography Selection",
      content: `The map will adust to an appropriate geography
              level as you zoom in, or you can manually set the
              geography level to States, Counties, Cities, or
              Census Tracts.`,
      selector: ".select--layer",
      vAlign: "bottom"
    }
  ]
};

export const LOCATION_GUIDE: Guide = {
  id: "location",
  steps: [
    {
      title: "Location Selection",
      content: `Click a location on the map or use the
                location search at the top of the page
                to view detailed statistics for a location.
                You can view up to 3 locations at once.`,
      selector: ".guide-point--inner",
      vAlign: "top",
      hAlign: "center"
    }
  ]
};

export const DATA_GUIDE: Guide = {
  id: "data",
  steps: [
    {
      title: "Full Dataset and Charts",
      content: `Press the “View More Data” button to view a
                tabular breakdown, interactive charts, and
                export options for your selected locations.`,
      selector: ".btn-compare",
      vAlign: "top"
    }
  ]
};
