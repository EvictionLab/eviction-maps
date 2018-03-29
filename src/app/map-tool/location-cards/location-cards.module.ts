import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


import { UiModule } from '../../ui/ui.module';
import { LocationCardsComponent } from './location-cards.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  exports: [ LocationCardsComponent ],
  imports: [
    CommonModule,
    FormsModule,
    UiModule,
    TranslateModule,
    TooltipModule
  ],
  declarations: [ LocationCardsComponent ],
  entryComponents: [ LocationCardsComponent ]
})
export class LocationCardsModule { }
