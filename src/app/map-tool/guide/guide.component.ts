import { Component, OnInit, ElementRef, Input, OnDestroy } from "@angular/core";
import { GuideService } from "./guide.service";
import { Guide, GuideStep } from "./guide";
import { Subscription } from "rxjs/Subscription";

const sampleSteps: Array<GuideStep> = [
  {
    id: "step1",
    title: "Eviction Data Selection",
    content: `Start by selecting one of the eviction metrics
              that are represented by red bubbles on the map:`,
    selector: ".map-ui",
    order: 1
  },
  {
    id: "step2",
    title: "Census Data Selection",
    content: `Next, select a census data variable to compare
              eviction rates to.  This will help identify
              correlations between eviction rates and the census
              data of your choosing.`,
    selector: ".map-ui",
    order: 2
  },
  {
    id: "step3",
    title: "Map Geography Selection",
    content: `The map will adust to an appropriate geography
              level as you zoom in, or you can manually set the
              geography level to States, Counties, Cities, or
              Census Tracts.`,
    selector: ".map-ui",
    order: 3
  }
];

@Component({
  selector: "app-guide",
  templateUrl: "./guide.component.html",
  styleUrls: ["./guide.component.scss"]
})
export class GuideComponent implements OnInit, OnDestroy {
  @Input() id = "guide";
  @Input() steps: Array<GuideStep> = sampleSteps;
  currentStep: GuideStep;
  private step$: Subscription;

  constructor(public guide: GuideService, public el: ElementRef) {}

  ngOnInit() {
    if (this.id && this.steps) {
      this.step$ = this.guide.currentStep.subscribe(step => {
        this.updateCurrentStep(step);
        console.log("guide:", "new step", step);
      });
      this.guide.init({
        id: this.id,
        steps: this.steps
      });
      this.guide.start();
    }
  }

  ngOnDestroy() {
    this.step$.unsubscribe();
  }

  updateCurrentStep(step) {
    this.currentStep = step;
  }

  onDismiss() {
    this.guide.pause();
  }
  onNext() {
    this.guide.next();
  }
  onPrevious() {
    this.guide.previous();
  }
  onEnd() {
    this.guide.end();
  }
  onStop() {
    this.guide.stop();
  }
}
