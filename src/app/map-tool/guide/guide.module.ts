import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TooltipModule } from "ngx-bootstrap/tooltip";

import { UiModule } from "../../ui/ui.module";

import { GuideService } from "./guide.service";
import { GuideComponent } from "./guide.component";
import { GuideStepComponent } from "./guide-step/guide-step.component";

@NgModule({
  exports: [GuideComponent],
  imports: [
    CommonModule,
    UiModule,
    TranslateModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [GuideService],
  declarations: [GuideComponent, GuideStepComponent],
  entryComponents: [GuideComponent]
})
export class GuideModule {}
