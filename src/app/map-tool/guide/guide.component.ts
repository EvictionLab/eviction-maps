import {
  Component,
  OnInit,
  ElementRef,
  Input,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  HostListener
} from "@angular/core";
import { GuideService } from "./guide.service";
import { Guide, GuideStep } from "./guide";
import { Subscription } from "rxjs/Subscription";
import { GuideStepComponent } from "./guide-step/guide-step.component";
import {
  trigger,
  transition,
  style,
  animate,
  state
} from "@angular/animations";

@Component({
  selector: "app-guide",
  templateUrl: "./guide.component.html",
  styleUrls: ["./guide.component.scss"],
  animations: [
    trigger("popin", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("0.4s ease-in", style({ opacity: 1 }))
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate("0.4s ease-out", style({ opacity: 0 }))
      ])
    ])
  ]
})
export class GuideComponent implements OnDestroy, AfterViewInit {
  stepEl: ElementRef;
  currentStep: GuideStep;
  private step$: Subscription;

  constructor(public guide: GuideService, public el: ElementRef) {}

  ngAfterViewInit() {
    this.step$ = this.guide.currentStep.subscribe(step => {
      this.updateCurrentStep(step);
    });
  }

  ngOnDestroy() {
    this.step$.unsubscribe();
  }

  onStepReady(stepEl: ElementRef) {
    this.stepEl = stepEl;
    this.updateCurrentStep(this.guide.getVisibleStep());
  }

  updateCurrentStep(step: GuideStep) {
    if (!step) {
      this.currentStep = null;
      return;
    }
    const position = this.getStepPosition(step);
    this.currentStep = step
      ? {
          ...step,
          ...position
        }
      : null;
  }

  onDismiss() {
    this.guide.isLastStep() ? this.guide.end() : this.guide.pause();
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
    this.guide.disable();
  }

  /**
   * Checks the container, source (guide step), and
   * dest (target DOM element) rectangles to determine
   * horizontal placement of source rect.
   * @param container Rect
   * @param src Rect
   * @param dest Rect
   */
  private getHorizontalAlignment(container, src, dest): string {
    // check horizontal space
    const spaceLeft = dest.x - container.x;
    const spaceRight = container.x + container.width - (dest.x + dest.width);
    // check if space on left or right allow for center spacing
    const diff = (src.width - dest.width) / 2;
    if (spaceLeft > diff && spaceRight > diff) return "center";
    // check if space to left align
    if (diff * 2 < spaceRight) return "left";
    // check if space to right align
    if (diff * 2 < spaceLeft) return "right";
    // default center if no space
    return "center";
  }

  /**
   * Checks the container, source (guide step), and
   * dest (target DOM element) rectangles to determine
   * vertical placement of source rect.
   * @param container Rect
   * @param src Rect
   * @param dest Rect
   */
  private getVerticalAlignment(container, src, dest): string {
    const spaceAbove = dest.y - container.y;
    const spaceBelow = container.y + container.height - (dest.y + dest.height);
    // check if space above / below allow for center placment
    const diff = (src.height - dest.height) / 2;
    if (spaceAbove > diff && spaceBelow > diff) return "center";
    // check if space below for bottom align
    if (diff * 2 < spaceBelow) return "bottom";
    // check if space above for top align
    if (diff * 2 < spaceAbove) return "top";
    // default center if no space
    return "center";
  }

  /**
   * Gets the y positioning of the src rectangle based on
   * the container rectangle, destination rectangle, and
   * vertical alignment
   */
  private getYFromRects(container, src, dest, align): number {
    switch (align) {
      case "bottom":
        return dest.y - container.y + dest.height;
      case "top":
        return dest.y - container.y - src.height;
      case "center":
        return dest.y - container.y - src.height / 2;
      default:
        return 0;
    }
  }

  /**
   * Gets the x positioning of the src rectangle based on
   * the container rectangle, destination rectangle, and
   * horizontal alignment
   */
  private getXFromRects(container, src, dest, align): number {
    switch (align) {
      case "left":
        return dest.x - container.x;
      case "right":
        return dest.x - container.x + dest.width - src.width;
      case "center":
        return dest.x - container.x + dest.width / 2 - src.width / 2;
      default:
        return 0;
    }
  }

  /**
   * Gets the x, y position and alignment for the provided
   * guide step.
   * @param step the guide step to find position for
   */
  private getStepPosition(step: GuideStep) {
    if (!step || !this.stepEl) return;
    const el = this.el.nativeElement.querySelector(step.selector);
    const containerRect = this.el.nativeElement.getBoundingClientRect();
    const sourceRect = this.stepEl.nativeElement.getBoundingClientRect();
    if (!el)
      throw new Error(`No element matching query selector for guide step`);
    const destRect = el.getBoundingClientRect();
    const vAlign =
      step.vAlign ||
      this.getVerticalAlignment(containerRect, sourceRect, destRect);
    const y = this.getYFromRects(containerRect, sourceRect, destRect, vAlign);
    const hAlign =
      step.hAlign ||
      this.getHorizontalAlignment(containerRect, sourceRect, destRect);
    const x = this.getXFromRects(containerRect, sourceRect, destRect, hAlign);
    return { x, y, hAlign, vAlign };
  }

  /**
   * Update the position of the guide step on resize
   */
  @HostListener("window:resize", ["$event"])
  onResize() {
    this.updateCurrentStep(this.guide.getVisibleStep());
  }

  /**
   * Hide the step if the user interacts with UI
   * @param e
   */
  @HostListener("document:click", ["$event"]) hideStep(e) {
    // deactivate search if click outside active element
    const el = this.el.nativeElement.querySelector(".guide-step");
    const el2 = this.el.nativeElement.querySelector(".overview");
    if (el && !el.contains(e.target) && el2 && !el2.contains(e.target)) {
      this.guide.pause();
    }
  }
}
