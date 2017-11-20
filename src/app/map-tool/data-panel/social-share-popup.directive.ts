import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSocialSharePopup]'
})
export class SocialSharePopupDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click', ['$event']) onClick(e) {
    e.preventDefault();
    const href = this.el.nativeElement.getAttribute('href');
    window.open(href, 'Social Share', 'height=285,width=550,resizable=1');
  }
}
