export interface Guide {
  id: string;
  steps: Array<GuideStep>;
}

export interface GuideStep {
  id: string;
  order: number;
  selector: string;
  title: string;
  content: string;
}
