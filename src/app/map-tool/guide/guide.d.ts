export interface Guide {
  id?: string;
  steps: Array<GuideStep>;
}

export interface GuideStep {
  selector: string;
  title: string;
  content: string;
  vAlign?: string;
  hAlign?: string;
  x?: number;
  y?: number;
}
