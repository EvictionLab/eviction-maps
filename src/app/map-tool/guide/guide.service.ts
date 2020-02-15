import { Injectable } from "@angular/core";
import { PlatformService } from "../../services/platform.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Guide, GuideStep } from "./guide";
import { Subscription } from "rxjs/Subscription";
import { environment } from "../../../environments/environment";

// local storage key for on / off status
const STATUS = "GUIDE_STATUS";

// mock local storage in case unavailable
const mockLocalStorage = (() => {
  let _store = {};
  const getItem = (key: string) => _store[key];
  const setItem = (key: string, val: string) => (_store[key] = val);
  const clear = () => (_store = {});
  return { getItem, setItem, clear };
})();

@Injectable()
export class GuideService {
  currentGuideId: string;
  stepNum: number;
  completed: BehaviorSubject<Array<string>>;
  currentStep: BehaviorSubject<GuideStep>;
  private paused: boolean;
  private guide: Guide;
  private started: Array<string> = [];
  private _completed: Array<string> = [];
  private viewed: Array<number> = [];
  private off: boolean;
  private currentStep$: Subscription;
  private _debug = true;
  private storage = window.localStorage || mockLocalStorage;

  private _currentStep: GuideStep;

  constructor(private platform: PlatformService) {
    this.currentStep = new BehaviorSubject(null);
    this.completed = new BehaviorSubject([]);
  }

  /**
   * Sets the current guide and optional start step
   * @param guide
   * @param step
   */
  load(guide: Guide, step = 0) {
    this.debug("load", guide.id);
    if (this.off) return;
    if (this.isGuideLoaded()) this.unload();
    this.started.push(guide.id);
    this.viewed = [];
    this.guide = guide;
    this.currentGuideId = guide.id;
    this.stepNum = step;
    this.currentStep$ = this.currentStep.subscribe(s => {
      this._currentStep = s;
    });
  }

  unload() {
    this.setCurrentStep(null);
    this.stepNum = 0;
    this.currentGuideId = null;
    this.guide = null;
    this.viewed = [];
    if (this.currentStep$) {
      this.currentStep$.unsubscribe();
      this.currentStep$ = null;
    }
  }

  /**
   * Gets the step that is currently visible
   */
  getVisibleStep(): GuideStep {
    return this._currentStep;
  }

  /**
   * Starts a the currently set guide
   */
  start() {
    this.debug("start", this.stepNum);
    this.setStepFromNumber(this.stepNum);
  }

  /**
   * Pause the guide on the current step
   */
  pause() {
    this.debug("pause", this.stepNum);
    this.paused = true;
    this.setStepFromNumber(null);
  }

  /**
   * Resume the guide at the provided step number
   */
  resume(step = this.stepNum) {
    this.debug("resume", step);
    this.paused = false;
    this.stepNum = step;
    this.setStepFromNumber(this.stepNum);
  }

  /**
   * Stop the guide and reset step to the start
   */
  stop() {
    this.debug("stop", this.stepNum);
    this.setStepFromNumber(null);
    this.stepNum = 0;
  }

  /**
   * Progress to the next guide step if able
   */
  next() {
    // is last step?
    if (this.stepNum === this.guide.steps.length - 1) return this.end();
    this.stepNum++;
    this.setStepFromNumber(this.stepNum);
  }

  /**
   * Go back to the previous guide step if able
   */
  previous() {
    // is first step?
    if (this.stepNum === 0) return;
    this.stepNum--;
    this.setStepFromNumber(this.stepNum);
  }

  disable() {
    this.debug("disable");
    this.off = true;
    this.storage.setItem("GUIDE_STATUS", "off");
    this.unload();
    // TODO: track dismiss
  }

  enable() {
    this.storage.setItem("GUIDE_STATUS", "on");
    this.off = false;
  }

  /**
   * Finish the guide
   */
  end() {
    this.debug("completed", this.currentGuideId);
    this.setCompleted(this.currentGuideId);
    this.unload();
    // TODO: track completion
  }

  reset() {
    this.enable();
    this._currentStep = null;
    this.started = [];
    this._completed = [];
    if (this.isGuideLoaded()) this.unload();
  }

  setCompleted(guideId: string) {
    this._completed = [...this._completed, guideId];
    this.completed.next(this._completed);
  }

  isGuideComplete(guideId: string): boolean {
    return this._completed.indexOf(guideId) > -1;
  }

  isGuideOff() {
    return (
      this.off ||
      this.storage.getItem(STATUS) === "off" ||
      !this.platform.isLargerThanMobile
    );
  }

  isVisibleStep() {
    return Boolean(this._currentStep);
  }

  isStepNumberViewed(num: number) {
    return this.viewed.indexOf(num) > -1;
  }

  isGuideLoaded(guideId?: string): boolean {
    if (guideId) return this.currentGuideId === guideId;
    return Boolean(this.currentGuideId);
  }

  isLastStep() {
    if (!this.guide) return false;
    return this.stepNum === this.guide.steps.length - 1;
  }

  hasGuideStarted(guideId: string): boolean {
    return this.started.indexOf(guideId) > -1;
  }

  getNumberOfSteps() {
    if (!this.guide || !this.guide.steps) return 0;
    return this.guide.steps.length;
  }

  getCurrentGuide() {
    return this.guide;
  }

  private setCurrentStep(step: GuideStep) {
    this.currentStep.next(step);
  }

  /**
   * Set the current step for the guide
   * @param num
   */
  private setStepFromNumber(num: number) {
    this.debug("setting num", num);
    if (this.off) return;
    if (!num && num !== 0) this.setCurrentStep(null);
    if (num > -1 && num < this.guide.steps.length) {
      this.setCurrentStep(this.guide.steps[num]);
      this.viewed.push(num);
    } else throw new Error(`Guide step ${num} out of bounds`);
  }

  private debug(...args) {
    // tslint:disable-next-line
    environment.production || !this._debug
      ? null
      : console.debug.apply(console, ["guide: ", ...args]);
  }
}
