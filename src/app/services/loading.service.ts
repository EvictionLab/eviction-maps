import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { timer } from "rxjs/observable/timer";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/observable/race";
import { environment } from "../../environments/environment";

@Injectable()
export class LoadingService {
  isLoading = false;
  get isLoading$() {
    return this.keysLoading$.map(keys => {
      return (
        keys
          // do not include hover and highlight in loading status
          .filter(k => k !== "hover" && k !== "highlight").length > 0
      );
    });
  }
  private keysLoading$ = new BehaviorSubject<string[]>([]);
  private loadingItems = [];
  // an array of observables for each id
  private loadingStore = {};
  private subscriptionStore = {};
  private timeStore = {};
  private _debug = false;
  private _timeout = 10000; // timeout any loaders after 10 seconds
  private _loadingSubscription = null;
  private _loadingKeys = [];

  constructor() {
    this.isLoading$.subscribe(loading => {
      this.isLoading = loading;
    });
    this.debugLoadTimes();
  }

  /**
   * Triggers loading to start for a given identifier
   */
  start(id: string, done$?: Observable<any>) {
    const timeout$ = timer(this._timeout);
    const itemLoading$ = done$ ? Observable.race(done$, timeout$) : timeout$;
    this.debug("start", id);
    if (this.loadingStore[id]) {
      this.subscriptionStore[id].unsubscribe();
    }
    this.loadingStore[id] = itemLoading$;
    this.subscriptionStore[id] = this.loadingStore[id].subscribe(done =>
      this.end(id)
    );
    this.updateKeysLoading();
  }

  /**
   * Marks an identifier as done loading, sets loading status to false if
   * no more items are left to load.
   */
  end(id: string) {
    this.debug("end", id);
    if (this.subscriptionStore[id]) {
      this.subscriptionStore[id].unsubscribe();
    }
    if (this.loadingStore[id]) {
      delete this.loadingStore[id];
    }
    this.updateKeysLoading();
  }

  /** Gets an observable of all of the loading items combined */
  updateKeysLoading() {
    this.keysLoading$.next(Object.keys(this.loadingStore));
  }

  /** Checks if the given item is already loading */
  isItemLoading(id: string) {
    return this.loadingStore.hasOwnProperty(id);
  }

  /** Logs loading times to the console when debug is enabled */
  private debugLoadTimes() {
    if (!this._debug) {
      return;
    }
    this.keysLoading$.subscribe(keys => {
      const storeKeys = Object.keys(this.timeStore);
      if (keys.sort().join(",") !== storeKeys.sort().join(",")) {
        Object.keys(this.timeStore).forEach(k => {
          if (keys.indexOf(k) === -1) {
            const totalTime = window.performance.now() - this.timeStore[k];
            this.debug("time for " + k, totalTime);
            delete this.timeStore[k];
          }
        });
        keys.forEach(k => {
          if (!this.timeStore.hasOwnProperty(k)) {
            this.timeStore[k] = window.performance.now();
          }
        });
      }
    });
  }

  private debug(...args) {
    // tslint:disable-next-line
    environment.production || !this._debug
      ? null
      : console.debug.apply(console, ["loading: ", ...args]);
  }
}
