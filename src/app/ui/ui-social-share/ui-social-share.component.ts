import { Component, Input } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { PlatformService } from '../../services/platform.service';
import { UiDialogService } from '../ui-dialog/ui-dialog.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ui-social-share',
  templateUrl: './ui-social-share.component.html',
  styleUrls: ['./ui-social-share.component.scss']
})
export class UiSocialShareComponent {

  @Input() facebook = true;
  @Input() embed: string;
  @Input() link = true;
  @Input() tweet: string;
  @Input() shareUrl: string;
  @Input() emailSubject: string;

  constructor(
    public platform: PlatformService,
    private dialogService: UiDialogService,
    private translatePipe: TranslatePipe,
    private analytics: AnalyticsService
  ) { }

  getShareUrl() {
    return this.shareUrl ? this.shareUrl : this.platform.currentUrl();
  }

  getEncodedShareUrl() {
    return this.platform.urlEncode(this.getShareUrl());
  }

  /**
   * Get pym.js HTML for embedding map
   */
  getEmbedCode() {
    return `<div data-pym-src="${this.embed}">Loading...</div>` +
      '<script type="text/javascript" src="https://pym.nprapps.org/pym-loader.v1.min.js"></script>';
  }

  shareFacebook() {
    this.trackShare('facebook');
    const href = 'https://www.facebook.com/sharer/sharer.php?u=' + this.getEncodedShareUrl();
    this.openWindow(href);
  }

  shareTwitter() {
    this.trackShare('twitter');
    const href = 'https://twitter.com/intent/tweet?text=' + this.platform.urlEncode(this.tweet);
    this.openWindow(href);
  }

  shareLink() {
    this.trackShare('link');
  }

  /**
   * Display dialog with error message if mailto link doesn't open after 1 second
   * @param e
   */
  shareEmail(e) {
    this.trackShare('email');
    // Cancel if on mobile, since behavior isn't the same
    if (this.platform.isMobile) { return; }

    // https://www.uncinc.nl/articles/dealing-with-mailto-links-if-no-mail-client-is-available
    let timeout;
    this.platform.nativeWindow.addEventListener('blur', () => clearTimeout(timeout));
    timeout = setTimeout(this.promptNoEmailClient.bind(this), 2000);
  }

  private promptNoEmailClient() {
    this.dialogService.showDialog({
      title: this.translatePipe.transform('FOOTER.SHARE_EMAIL_ERROR'),
      content: [{
        type: 'text',
        data: this.translatePipe.transform('FOOTER.SHARE_EMAIL_ERROR_MESSAGE')
      }]
    });
  }

  private trackShare(shareType: string) {
    this.analytics.trackEvent('share', { shareType });
  }

  private openWindow(href: string) {
    this.platform.nativeWindow.open(href, 'Social Share', 'height=285,width=550,resizable=1');
  }


}
