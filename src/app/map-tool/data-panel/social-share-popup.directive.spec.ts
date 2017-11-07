import { ElementRef } from '@angular/core';
import { SocialSharePopupDirective } from './social-share-popup.directive';

describe('SocialSharePopupDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef(null);
    const directive = new SocialSharePopupDirective(el);
    expect(directive).toBeTruthy();
  });
});
