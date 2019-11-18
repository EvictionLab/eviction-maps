import { Component } from '@angular/core';
import { NgxBootstrapProductTourService } from 'ngx-bootstrap-product-tour';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent {

  public loaded = false;
  constructor(public tourService: NgxBootstrapProductTourService) {
    this.loaded = false;
    this.tourService.events$.subscribe(console.log);
    this.tourService.initialize([{
      anchorId: 'start.tour',
      content: 'Welcome to the Ngx-Tour tour!',
      placement: 'right',
      title: 'Welcome',
      orphan: true,
      promise: this.apiSimulation(),
      backdrop: true
    },
    {
      anchorId: 'ngx-tour',
      content: 'Thanks to ngx-tour for the inspiration for the library',
      title: 'Ngx-tour',
      placement: 'right',
      backdrop: true
    }, {
      anchorId: 'installation',
      content: 'First, install the library...',
      title: 'Installation',
      backdrop: true
    }, {
      anchorId: 'usage',
      content: '...then use it.',
      title: 'Usage',
    }, {
      anchorId: 'tourService.start',
      content: 'Don\'t forget to actually start the tour.',
      title: 'Start the tour',
    }, {
      anchorId: 'config.anchorId',
      content: 'Every step needs an anchor.',
      title: 'Anchor',
    }, {
      anchorId: 'config.route',
      content: 'Tours can span multiple routes.',
      title: 'Route',
    }, {
      anchorId: 'another.route',
      content: 'Like this!',
      route: 'other',
      title: 'Another Route',
    }, {
      anchorId: 'lazyLoadDemo',
      content: 'And you can Lazy load modules!',
      route: 'lazyLoadDemo',
      title: 'LazyLoaded Route',
    }, {
      anchorId: 'config.route',
      content: 'And then back again.',
      placement: 'bottom',
      title: 'Route Return'
    }, {
      anchorId: 'config.placement.default',
      content: 'Steps can be positioned around an anchor. You can even have multiple steps use the same anchor.',
      title: 'Placement',
    }, {
      anchorId: 'config.placement.default',
      content: 'Sliiide to the left.',
      placement: 'left',
      title: 'Placement',
    }, {
      anchorId: 'config.placement.default',
      content: 'Sliiide to the right.',
      placement: 'right',
      title: 'Placement',
    }, {
      anchorId: 'config.placement.default',
      content: 'Take it back now y\'all.  One hop this time.',
      placement: 'bottom',
      title: 'Placement',
    }, {
      anchorId: 'events',
      content: 'You can subscribe to events',
      title: 'Events',
    },
    {
      anchorId: 'template',
      content: 'You can define custom template',
      title: 'Custom template',
    }], {
        route: '',
        containerClass: 'example-custom-container-class'
      });
  }

  apiSimulation(): Promise<any> {
    return this.apiDataLoad().then((data) => {
      this.loaded = data;
      return new Promise(function (resolve, reject) {
        setTimeout(() => { resolve(true); });
      });
    });
  }

  apiDataLoad(): Promise<boolean> {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

}
