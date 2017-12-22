import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  isLoading = false;
  private loadingItems = [];

  constructor() { }

  /**
   * Triggers loading to start for a given identifier 
   */
  start(id: string) {
    this.isLoading = true;
    if (this.loadingItems.indexOf(id) === -1) {
      this.loadingItems.push(id);
    }
  }

  /**
   * Marks an identifier as done loading, sets loading status to false if
   * no more items are left to load.
   */
  end(id: string) {
    this.loadingItems = this.loadingItems.filter(itemId => itemId !== id);
    this.isLoading = !(this.loadingItems.length === 0);
  }

}
