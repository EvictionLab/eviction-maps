import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';

@Component({
  selector: 'app-ui-toast',
  templateUrl: './ui-toast.component.html',
  styleUrls: ['./ui-toast.component.scss']
})
export class UiToastComponent implements OnInit {
  message = ''; // Message to display
  @Input() position = 'topright'; // Accepts topright, bottomright, topleft, bottomleft
  @Input() duration = 3000; // Duration visible in milliseconds
  // Binding host position to position input
  @HostBinding('style.top') top = this.position.startsWith('top') ? '10px' : 'auto';
  @HostBinding('style.bottom') bottom = this.position.startsWith('bottom') ? '10px' : 'auto';
  @HostBinding('style.left') left = this.position.endsWith('left') ? '10px' : 'auto';
  @HostBinding('style.right') right = this.position.endsWith('right') ? '10px' : 'auto';
  @HostBinding('style.opacity') opacity = '0';
  @HostListener('click') onClick() { this.opacity = '0'; }

  constructor() { }

  ngOnInit() { }

  /**
   * Display toast component for specified duration
   */
  display(message: string) {
    this.message = message;
    this.opacity =  '1';
    setTimeout(() => this.opacity = '0', this.duration);
  }

}
