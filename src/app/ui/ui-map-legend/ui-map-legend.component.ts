import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ui-map-legend',
  templateUrl: './ui-map-legend.component.html',
  styleUrls: ['./ui-map-legend.component.scss']
})
export class UiMapLegendComponent {
  /** Current `MapDataAttribute` being shown for choropleths */
  @Input() choropleth;
  /** Current `MapDataAttribute` being shown for bubbles */
  @Input() bubbles;
  /** Current data layer being shown on the map */
  @Input() layer;
  /** Gets the fill stops based on the selected choropleth */
  get stops() {
    if (!this.choropleth || !this.layer) { return null; }
    return this.choropleth.stops[this.layer.id] || this.choropleth.stops['default'];
  }

  get hintData() {
    return {
      geography: this.stripHtmlFromString(this.layer['name']),
      attribute: this.choropleth['name'],
      min: this.stops[1][0],
      max: this.stops[this.stops.length - 1][0]
    };
  }
  /** Gets the CSS background gradient for the legend */
  get legendGradient() {
    if (this.stops && this.stops.length) {
      return this.sanitizer.bypassSecurityTrustStyle(`linear-gradient(
          to right, ${this.stops[1][1]}, ${this.stops[this.stops.length - 1][1]}
      )`);
    }
    return null;
  }

  constructor(private sanitizer: DomSanitizer) { }

  private stripHtmlFromString(htmlString: string) {
    return htmlString.replace(/<(?:.|\n)*?>*.<\/(?:.|\n)*?>+/g, '');
  }

}
