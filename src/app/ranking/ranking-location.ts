export interface RankingLocation {
  geoId: number;
  evictions: number;
  filings: number;
  evictionRate: number;
  filingRate: number;
  name: string;
  parentLocation: string;
  latLon: Array<number>;
  areaType: number;
}
