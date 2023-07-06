import {ChangeDetectorRef, EventEmitter, OnDestroy, Pipe, PipeTransform, untracked, ɵisPromise, ɵisSubscribable} from '@angular/core';
import {Observable, Subscribable, Unsubscribable} from 'rxjs';


interface SubscriptionStrategy {
  createSubscription(async: Subscribable<any>|Promise<any>, updateLatestValue: any): Unsubscribable
      |Promise<any>;
  dispose(subscription: Unsubscribable|Promise<any>): void;
}

class SubscribableStrategy implements SubscriptionStrategy {
  createSubscription(async: Subscribable<any>, updateLatestValue: any): Unsubscribable {
    return untracked(() => async.subscribe({
      next: updateLatestValue,
      error: (e: any) => {
        throw e;
      }
    }));
  }

  dispose(subscription: Unsubscribable): void {
    untracked(() => subscription.unsubscribe());
  }
}

class PromiseStrategy implements SubscriptionStrategy {
  createSubscription(async: Promise<any>, updateLatestValue: (v: any) => any): Promise<any> {
    return async.then(updateLatestValue, e => {
      throw e;
    });
  }

  dispose(subscription: Promise<any>): void {}
}

const _promiseStrategy = new PromiseStrategy();
const _subscribableStrategy = new SubscribableStrategy();

/**
 * The code is exactly the same as native pipe async only have in the refresh method a detectChanges for work in Zoneless mode
 */
@Pipe({
  name: 'asyncZoneless',
  pure: false,
})
export class AsyncPipeZoneless implements OnDestroy, PipeTransform {
  private _ref: ChangeDetectorRef|null;
  private _latestValue: any = null;

  private _subscription: Unsubscribable|Promise<any>|null = null;
  private _obj: Subscribable<any>|Promise<any>|EventEmitter<any>|null = null;
  private _strategy: SubscriptionStrategy|null = null;

  constructor(ref: ChangeDetectorRef) {
    this._ref = ref;
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._dispose();
    }
    this._ref = null;
  }


  transform<T>(obj: Observable<T>|Subscribable<T>|Promise<T>): T|null;
  transform<T>(obj: null|undefined): null;
  transform<T>(obj: Observable<T>|Subscribable<T>|Promise<T>|null|undefined): T|null;
  transform<T>(obj: Observable<T>|Subscribable<T>|Promise<T>|null|undefined): T|null {
    if (!this._obj) {
      if (obj) {
        this._subscribe(obj);
      }
      return this._latestValue;
    }

    if (obj !== this._obj) {
      this._dispose();
      return this.transform(obj);
    }

    return this._latestValue;
  }

  private _subscribe(obj: Subscribable<any>|Promise<any>|EventEmitter<any>): void {
    this._obj = obj;
    this._strategy = this._selectStrategy(obj);
    this._subscription = this._strategy.createSubscription(
        obj, (value: Object) => this._updateLatestValue(obj, value));
  }

  private _selectStrategy(obj: Subscribable<any>|Promise<any>|
                          EventEmitter<any>): SubscriptionStrategy {
    if (ɵisPromise(obj)) {
      return _promiseStrategy;
    }

    if (ɵisSubscribable(obj)) {
      return _subscribableStrategy;
    }

    throw Error(`${AsyncPipeZoneless}`, obj);
  }

  private _dispose(): void {
    this._strategy!.dispose(this._subscription!);
    this._latestValue = null;
    this._subscription = null;
    this._obj = null;
  }

  private _updateLatestValue(async: any, value: Object): void {
    if (async === this._obj) {
      this._latestValue = value;
      this._ref!.detectChanges();
    }
  }
}