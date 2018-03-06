import { Component, Input } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  deployUrl = environment.deployUrl;

  @Input() navigation: Array<any> = [];

}
