import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Guide, GuideStep } from "./guide";

@Injectable()
export class GuideService {
  guide: Guide;
  stepNum: number;
  paused: boolean;
  currentStep: BehaviorSubject<GuideStep>;

  constructor() {
    this.currentStep = new BehaviorSubject(null);
  }

  /**
   * Sets the current guide and optional start step
   * @param guide
   * @param step
   */
  init(guide: Guide, step = 0) {
    this.guide = guide;
    this.stepNum = step;
  }

  /**
   * Set the current step for the guide
   * @param num
   */
  setStep(num: number) {
    console.log("guide:", "set step", num);
    if (!num && num !== 0) this.currentStep.next(null);
    if (num > -1 && num < this.guide.steps.length)
      this.currentStep.next(this.guide.steps[num]);
    else throw new Error(`Guide step ${num} out of bounds`);
  }

  /**
   * Starts a the currently set guide
   */
  start() {
    this.setStep(this.stepNum);
  }

  /**
   * Pause the guide on the current step
   */
  pause() {
    this.paused = true;
    this.setStep(null);
  }

  /**
   * Resume the guide at the provided step number
   */
  resume(step = this.stepNum) {
    this.paused = false;
    this.setStep(step);
  }

  /**
   * Stop the guide and reset step to the start
   */
  stop() {
    this.setStep(null);
    this.stepNum = 0;
  }

  /**
   * Progress to the next guide step if able
   */
  next() {
    // is last step?
    if (this.stepNum === this.guide.steps.length - 1) return this.end();
    this.stepNum++;
    this.setStep(this.stepNum);
  }

  /**
   * Go back to the previous guide step if able
   */
  previous() {
    // is first step?
    if (this.stepNum === 0) return;
    this.stepNum--;
    this.setStep(this.stepNum);
  }

  /**
   * Finish the guide
   */
  end() {
    this.stop();
    // TODO: add analytics to track completion?
  }
}
