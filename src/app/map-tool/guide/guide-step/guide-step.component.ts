import {
  Component,
  OnInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostBinding
} from "@angular/core";

@Component({
  selector: "app-guide-step",
  templateUrl: "./guide-step.component.html",
  styleUrls: ["./guide-step.component.scss"]
})
export class GuideStepComponent implements OnInit {
  @Input() title: string;
  @Input() content: string;
  @Input() step: number;
  @Input() total: number;
  @Input() x: number;
  @Input() y: number;
  @Input() direction: string;
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  @Output() onPrevious: EventEmitter<any> = new EventEmitter();
  @Output() onStop: EventEmitter<any> = new EventEmitter();
  @Output() onDismiss: EventEmitter<any> = new EventEmitter();
  @Output() onEnd: EventEmitter<any> = new EventEmitter();
  @HostBinding("class.guide-step") defaultClass = true;
  @HostBinding("class.top") top = this.direction === "top";
  @HostBinding("class.bottom") bottom = this.direction === "bottom";
  @HostBinding("class.left") left = this.direction === "left";
  @HostBinding("class.right") right = this.direction === "right";

  constructor(public el: ElementRef) {}

  ngOnInit() {}
}
