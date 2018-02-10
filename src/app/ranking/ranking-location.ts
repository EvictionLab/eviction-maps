export interface RankingLocation {
  geoId: number;
  evictions: number;
  filings: number;
  evictionRate: number;
  filingRate: number;
  name: string;
  displayName: string;
  parentLocation: string;
  displayParentLocation: string;
  latLon: Array<number>;
  areaType: number;
  rank?: number;
}
