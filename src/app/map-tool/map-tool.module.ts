import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { NgxPageScrollModule } from "ngx-page-scroll";
import { TranslateModule } from "@ngx-translate/core";
import { NgxCarouselModule } from "ngx-carousel";
import "hammerjs";

import { MapToolComponent } from "./map-tool.component";
import { MapModule } from "./map/map.module";
import { UiModule } from "../ui/ui.module";
import { GuideModule } from "./guide/guide.module";
import { DataPanelModule } from "./data-panel/data-panel.module";
import { MapToolService } from "./map-tool.service";
import { EmbedComponent } from "./embed/embed.component";

@NgModule({
  declarations: [MapToolComponent, EmbedComponent],
  exports: [MapToolComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxCarouselModule,
    UiModule,
    GuideModule,
    DataPanelModule,
    MapModule,
    NgxPageScrollModule,
    TranslateModule
  ],
  providers: [MapToolService]
})
export class MapToolModule {}
